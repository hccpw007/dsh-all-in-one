/**
 * 「展开过程」开关的共享逻辑。
 *
 * 宿主侧把引导脚本注入 index.html 的 <head>，在客户端模块系统启动前接管
 * `window.__ModuleLoader__`，把「思考」与「运行命令」两类行组件的折叠状态交给开关；
 * 客户端侧只负责读写同一组 localStorage 键。
 *
 * 两端共用本文件，避免状态键与补丁规则出现两套定义。
 */

/** 总开关状态在 localStorage 中的键，宿主脚本与设置页共用。 */
export const EXPAND_PROCESS_STORAGE_KEY = 'dsh-all-in-one:expand-process'

/** 展开范围在 localStorage 中的键；只在总开关打开时参与判断。 */
export const EXPAND_PROCESS_MODE_STORAGE_KEY = 'dsh-all-in-one:expand-process-mode'

/** 展开范围：`all` 展开全部过程行，`active` 只展开当前这一轮对话的过程行。 */
export type ExpandProcessMode = 'all' | 'active'

/** 模式与总开关的存储键，注入脚本时整体传给浏览器端。 */
interface ExpandProcessKeys {
  /** 总开关键 */
  enabledKey: string
  /** 展开范围键 */
  modeKey: string
}

/** 模块注册项：只关心 patch 需要的 id 与 factory。 */
interface ModuleRegistration {
  id?: unknown
  factory?: unknown
  [key: string]: unknown
}

/** 客户端模块加载器：只声明本补丁介入的字段。 */
interface ModuleLoader {
  pendingQueue?: ModuleRegistration[]
  load?: (this: unknown, registration: ModuleRegistration) => unknown
  create?: (this: unknown, options: unknown) => unknown
  [key: string]: unknown
}

/**
 * 在浏览器中执行的引导脚本。
 *
 * 本函数会被 `Function.prototype.toString()` 序列化进 index.html，因此函数体内
 * 不能引用模块作用域的任何变量：存储键由调用参数传入，其余内容全部内联。
 *
 * 不修改 app 包体、不改变组件签名，只替换 factory 的源码文本；匹配不到时打印
 * warning 并放行，不会让界面加载失败。
 *
 * @param keys 总开关与展开范围所在的 localStorage 键
 */
function bootExpandProcess(keys: ExpandProcessKeys): void {
  const win = window as unknown as Record<string, unknown>
  if (win['__DSH_ALL_IN_ONE_EXPAND_PROCESS__']) return
  win['__DSH_ALL_IN_ONE_EXPAND_PROCESS__'] = true

  /** 读总开关；存储不可用时按关闭处理。 */
  function readEnabled(): boolean {
    try {
      return window.localStorage.getItem(keys.enabledKey) === '1'
    } catch (error) {
      console.error('[expand-process] 读取开关状态失败:', error)
      return false
    }
  }

  /** 读展开范围；存储不可用或值无法识别时按「全部内容」处理。 */
  function readMode(): string {
    try {
      return window.localStorage.getItem(keys.modeKey) === 'active' ? 'active' : 'all'
    } catch (error) {
      console.error('[expand-process] 读取展开范围失败:', error)
      return 'all'
    }
  }

  const enabled = readEnabled()

  /**
   * 行标题与过程内容的视觉层级。
   *
   * 只在开关打开时注入：行标题改用主文字色，与展开后的内容区分；
   * 内容整体右移 20px（用 margin 而不是 padding，避免覆盖宿主已有的内边距），
   * 表达它比行标题低一级。内容左侧再用伪元素画一条半透明的浅灰竖线作为引用标记，
   * 线放在缩进留白里，不参与布局，因此不会挤动正文。
   * 选择器基于宿主稳定属性，不依赖构建哈希类名。
   */
  if (enabled) {
    const style = document.createElement('style')
    style.id = 'dsh-all-in-one-expand-process-style'
    style.textContent = [
      '[data-disclosure-header] [data-disclosure-row],',
      '[data-slot="tool.call.toolview"] [role="button"][aria-expanded] {',
      '  color: var(--dsw-alias-label-primary, #0f1115);',
      '}',
      '[data-disclosure-header] + div,',
      '[data-slot="tool.call.toolview"] [role="button"][aria-expanded] + div {',
      '  position: relative;',
      '  margin-left: 20px;',
      '}',
      '[data-disclosure-header] + div::before,',
      '[data-slot="tool.call.toolview"] [role="button"][aria-expanded] + div::before {',
      '  content: "";',
      '  position: absolute;',
      '  top: 17px;',
      '  bottom: 17px;',
      '  left: -12px;',
      '  width: 2px;',
      '  border-radius: 1px;',
      '  background: var(--dsw-alias-label-tertiary, #81858c);',
      '  opacity: 0.35;',
      '}',
    ].join('\n')
    ;(document.head || document.documentElement).appendChild(style)
  }

  /**
   * 行挂载时的初始展开值。
   *
   * 「全部内容」模式直接展开；「当前激活」模式先折叠，由行挂载后的布局阶段
   * 按轮次判定，避免历史轮次先展开再收起闪一下。开关关闭时一律折叠。
   */
  win['__DSH_EXPAND_PROCESS_INITIAL__'] = function (): boolean {
    return enabled && readMode() === 'all'
  }

  /** 所有已绑定行的重算函数；轮次或运行状态变化时统一调用。 */
  const binders: Array<() => void> = []
  /** 整页变动观察器与合并标记，避免流式输出期间每帧重算多次。 */
  let observer: MutationObserver | null = null
  let scheduled = false
  /** 上次参与判定的运行状态与轮次，两者都没变时不需要重算。 */
  let lastRunning: boolean | null = null
  let lastTurn: string | null = null

  /** 取 DOM 中最新一轮的标识；会话没有内容时返回 null。 */
  function latestTurn(): string | null {
    const nodes = document.querySelectorAll('[data-chat-turn]')
    if (!nodes.length) return null

    let best: string | null = null
    let bestValue = -Infinity

    for (const node of Array.from(nodes)) {
      const raw = node.getAttribute('data-chat-turn') ?? ''
      const value = Number(raw)

      // 轮次一般是从 0 开始递增的序号；不是数字时退化为按 DOM 顺序取最后一个
      if (Number.isFinite(value) && value > bestValue) {
        bestValue = value
        best = raw
      }
    }

    return best ?? nodes[nodes.length - 1].getAttribute('data-chat-turn')
  }

  /** 会话是否正在运行：宿主只在运行期间挂这个只存在于流中的标记。 */
  function isRunning(): boolean {
    return document.querySelector('[data-chat-running]') !== null
  }

  /** 重算所有已绑定行；运行状态与最新轮次都没变时直接跳过。 */
  function refresh(): void {
    const running = isRunning()
    const turn = latestTurn()
    if (running === lastRunning && turn === lastTurn) return

    lastRunning = running
    lastTurn = turn

    for (const update of [...binders]) update()
  }

  /** 把多次 DOM 变动合并到下一帧，避免流式输出期间反复重算。 */
  function schedule(): void {
    if (scheduled) return
    scheduled = true

    window.requestAnimationFrame(() => {
      scheduled = false
      refresh()
    })
  }

  /** 观察整页变动：运行标记出现或消失、新轮次挂载都会触发重算。 */
  function observe(): void {
    if (observer !== null || document.body === null) return

    observer = new MutationObserver(schedule)
    observer.observe(document.body, { childList: true, subtree: true })
  }

  /**
   * 绑定一行过程的展开状态。
   *
   * 「当前激活」模式下，只有属于最新一轮、且该轮仍在运行的过程行展开；
   * 轮次结束或新轮开始后自动收起。用户手动操作过的行不再被自动接管，
   * 避免刚折叠好又被观察器打开。
   * @param element 行组件根节点
   * @param setExpanded React 状态写入器
   * @param manual 该行是否已被用户手动操作过的标记
   * @returns 解绑函数，供 React 清理
   */
  function bind(
    element: Element | null,
    setExpanded: (value: boolean) => void,
    manual: { current: boolean },
  ): (() => void) | undefined {
    if (!enabled || readMode() !== 'active') return undefined
    if (element === null || typeof element.closest !== 'function') return undefined

    // 行的外层节点由宿主标记所属轮次，找不到时说明不是会话里的过程行
    const turnElement = element.closest('[data-chat-turn]')
    if (turnElement === null) return undefined

    const turn = turnElement.getAttribute('data-chat-turn')

    const update = (): void => {
      if (manual.current) return

      setExpanded(isRunning() && turn !== null && turn === latestTurn())
    }

    binders.push(update)
    observe()
    update()

    return () => {
      const index = binders.indexOf(update)
      if (index >= 0) binders.splice(index, 1)
    }
  }

  win['__DSH_EXPAND_PROCESS_BIND__'] = bind

  /**
   * 包 id → [旧源码片段, 新源码片段] 列表。
   *
   * 展开状态必须留在行自己的 state 里：若把 `expanded` 直接换成开关值，
   * 点击折叠按钮只改 hook 内部 state、渲染仍按开关值走，单行就永远收不起来。
   * 这里的 useState 只把开关值当作初始值，之后完全由折叠按钮接管；
   * 初始化用函数形式，避免每次渲染都读一次 localStorage。
   *
   * 行根节点补 `ref`：绑定需要拿到行所在的外层节点，才能判断它属于哪一轮。
   */
  const RULES: Record<string, Array<[string, string]>> = {
    '@deepseek-ai/dsh-client-ui-tool': [
      [
        'const { expanded, toggle: toggleExpand } = useDisclosure();',
        'const __aioRow = (0, react.useRef)(null); const __aioManual = (0, react.useRef)(false); const [expanded, setExpanded] = (0, react.useState)(() => window.__DSH_EXPAND_PROCESS_INITIAL__()); const toggleExpand = () => { __aioManual.current = true; setExpanded((value) => !value); }; (0, react.useLayoutEffect)(() => typeof window.__DSH_EXPAND_PROCESS_BIND__ === "function" ? window.__DSH_EXPAND_PROCESS_BIND__(__aioRow.current, setExpanded, __aioManual) : undefined, []);',
      ],
      ['"data-tool": toolName,', 'ref: __aioRow, "data-tool": toolName,'],
      ['"data-sample": "bash",', 'ref: __aioRow, "data-sample": "bash",'],
    ],
    '@deepseek-ai/dsh-client-ui-chat': [
      [
        'const { expanded, toggle } = useDisclosure();',
        'const __aioRow = (0, react.useRef)(null); const __aioManual = (0, react.useRef)(false); const [expanded, setExpanded] = (0, react.useState)(() => window.__DSH_EXPAND_PROCESS_INITIAL__()); const toggle = () => { __aioManual.current = true; setExpanded((value) => !value); }; (0, react.useLayoutEffect)(() => typeof window.__DSH_EXPAND_PROCESS_BIND__ === "function" ? window.__DSH_EXPAND_PROCESS_BIND__(__aioRow.current, setExpanded, __aioManual) : undefined, []);',
      ],
      ['"data-variant": "think",', 'ref: __aioRow, "data-variant": "think",'],
    ],
  }

  /**
   * 改写一个已注册模块的 factory 源码。
   *
   * factory 是闭包外的纯函数（依赖全部经由参数 require 传入），
   * 因此用字符串重建后行为与原来一致。
   */
  function patch(registration: ModuleRegistration | null | undefined): void {
    if (!registration || registration['__dshPatched'] || typeof registration.id !== 'string') return

    const rules = RULES[registration.id]
    if (!rules || typeof registration.factory !== 'function') return

    try {
      const src = Function.prototype.toString.call(registration.factory)
      let patched = true

      // 已经是本插件的版本时直接跳过，避免重复替换
      for (const [, next] of rules) {
        if (src.indexOf(next) === -1) patched = false
      }

      if (patched) {
        registration['__dshPatched'] = true
        console.info('[expand-process] 已是开关版，跳过 ' + registration.id)
        return
      }

      let output = src

      for (const [previous, next] of rules) output = output.split(previous).join(next)

      if (output === src) {
        registration['__dshPatched'] = true
        console.warn('[expand-process] 规则未命中 ' + registration.id + '，UI 实现可能已变化')
        return
      }

      // 逐条核对：某一处锚点消失时仍会部分生效，但必须留下线索，不能静默漏改
      for (const [previous, next] of rules) {
        if (output.indexOf(next) === -1) {
          console.warn('[expand-process] 部分规则未命中 ' + registration.id + '：' + previous)
        }
      }

      registration.factory = (0, eval)('(' + output + ')')
      registration['__dshPatched'] = true
      console.info('[expand-process] 已接管 ' + registration.id)
    } catch (error) {
      console.warn('[expand-process] 改写失败 ' + registration.id, error)
    }
  }

  /** 启动前扫一遍已经登记进队列的模块。 */
  function patchQueue(loader: ModuleLoader): void {
    const queue = loader.pendingQueue
    if (!queue || !queue.length) return

    for (const registration of queue) patch(registration)
  }

  /**
   * 只包 load：每次模块注册前先过一遍规则。
   *
   * live 模式下模块是动态注册的（`/plugins/…/client.js` 拉下来后调
   * `window.__ModuleLoader__.load({id, factory})`），所以这一层才是真正的入口。
   */
  function wrapLoad(loader: ModuleLoader): void {
    const load = loader.load
    if (typeof load !== 'function') return
    if ((load as unknown as Record<string, unknown>)['__dshPatched']) return

    const wrapped = function (this: unknown, registration: ModuleRegistration) {
      patch(registration)
      return load.call(this, registration)
    }

    ;(wrapped as unknown as Record<string, unknown>)['__dshPatched'] = true
    loader.load = wrapped
  }

  /**
   * 包装模块系统的 create。
   *
   * `createClientModuleSystem` 内部会重写 `load`，所以 create 返回后必须再包一次，
   * 否则动态注册的模块永远不会经过规则。
   */
  function wrap(loader: ModuleLoader): ModuleLoader {
    if (!loader['__dshPatched'] && typeof loader.create === 'function') {
      loader['__dshPatched'] = true
      const create = loader.create

      loader.create = function (this: unknown, options: unknown) {
        patchQueue(loader)
        const result = create.call(this, options)
        wrapLoad(loader)
        return result
      }
    }

    wrapLoad(loader)
    return loader
  }

  let currentLoader = win['__ModuleLoader__'] as ModuleLoader | undefined
  if (currentLoader) wrap(currentLoader)

  try {
    Object.defineProperty(window, '__ModuleLoader__', {
      configurable: true,
      enumerable: true,
      get() {
        return currentLoader
      },
      set(value: ModuleLoader) {
        currentLoader = wrap(value)
      },
    })
  } catch (error) {
    console.warn('[expand-process] 无法挂载模块钩子', error)
  }
}

/** 注入到 index.html <head> 最前面的内联脚本。 */
export const EXPAND_PROCESS_SCRIPT = `(${bootExpandProcess.toString()})(${JSON.stringify({
  enabledKey: EXPAND_PROCESS_STORAGE_KEY,
  modeKey: EXPAND_PROCESS_MODE_STORAGE_KEY,
} satisfies ExpandProcessKeys)});`

/**
 * 读取总开关状态；存储不可用时按关闭处理，不阻断设置页渲染。
 * @returns 是否默认展开过程行
 */
export function readExpandProcessEnabled(): boolean {
  try {
    return window.localStorage.getItem(EXPAND_PROCESS_STORAGE_KEY) === '1'
  } catch (error) {
    console.error('[expand-process] 读取开关状态失败:', error)
    return false
  }
}

/**
 * 写入总开关状态。
 * @param enabled 是否默认展开过程行
 * @returns 是否写入成功；失败时调用方不应刷新页面
 */
export function writeExpandProcessEnabled(enabled: boolean): boolean {
  try {
    window.localStorage.setItem(EXPAND_PROCESS_STORAGE_KEY, enabled ? '1' : '0')
    return true
  } catch (error) {
    console.error('[expand-process] 写入开关状态失败:', error)
    return false
  }
}

/**
 * 读取展开范围；存储不可用或值无法识别时按「全部内容」处理。
 * @returns 当前展开范围
 */
export function readExpandProcessMode(): ExpandProcessMode {
  try {
    return window.localStorage.getItem(EXPAND_PROCESS_MODE_STORAGE_KEY) === 'active' ? 'active' : 'all'
  } catch (error) {
    console.error('[expand-process] 读取展开范围失败:', error)
    return 'all'
  }
}

/**
 * 写入展开范围。
 * @param mode 展开范围
 * @returns 是否写入成功；失败时调用方不应刷新页面
 */
export function writeExpandProcessMode(mode: ExpandProcessMode): boolean {
  try {
    window.localStorage.setItem(EXPAND_PROCESS_MODE_STORAGE_KEY, mode)
    return true
  } catch (error) {
    console.error('[expand-process] 写入展开范围失败:', error)
    return false
  }
}
