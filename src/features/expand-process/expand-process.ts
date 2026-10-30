/**
 * 「展开过程」开关的共享逻辑。
 *
 * 宿主侧把引导脚本注入 index.html 的 <head>，在客户端模块系统启动前接管
 * `window.__ModuleLoader__`，把「思考」与「运行命令」两类行组件的折叠状态初始值
 * 换成按开关取值；客户端侧只负责读写同一个 localStorage 键。
 *
 * 两端共用本文件，避免状态键与补丁规则出现两套定义。
 */

/** 开关状态在 localStorage 中的键，宿主脚本与设置页共用。 */
export const EXPAND_PROCESS_STORAGE_KEY = 'dsh-all-in-one:expand-process'

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
 * 不能引用模块作用域的任何变量：状态键由调用参数传入，其余内容全部内联。
 *
 * 不修改 app 包体、不改变组件签名，只替换 factory 的源码文本；匹配不到时打印
 * warning 并放行，不会让界面加载失败。
 *
 * @param storageKey 开关状态所在的 localStorage 键
 */
function bootExpandProcess(storageKey: string): void {
  const win = window as unknown as Record<string, unknown>
  if (win['__DSH_ALL_IN_ONE_EXPAND_PROCESS__']) return
  win['__DSH_ALL_IN_ONE_EXPAND_PROCESS__'] = true

  // 行在挂载时读取一次开关作为初始展开值，之后由行自己的折叠按钮接管；刷新页面即重新读取
  win['__DSH_EXPAND_PROCESS_ENABLED__'] = function enabled(): boolean {
    try {
      return window.localStorage.getItem(storageKey) === '1'
    } catch (error) {
      console.error('[expand-process] 读取开关状态失败:', error)
      return false
    }
  }

  /**
   * 包 id → [旧源码片段, 新源码片段] 列表。
   *
   * 展开状态必须留在行自己的 state 里：若把 `expanded` 直接换成开关值，
   * 点击折叠按钮只改 hook 内部 state、渲染仍按开关值走，单行就永远收不起来。
   * 这里的 useState 只把开关值当作初始值，之后完全由折叠按钮接管；
   * 初始化用函数形式，避免每次渲染都读一次 localStorage。
   */
  const RULES: Record<string, Array<[string, string]>> = {
    '@deepseek-ai/dsh-client-ui-tool': [
      [
        'const { expanded, toggle: toggleExpand } = useDisclosure();',
        'const [expanded, setExpanded] = (0, react.useState)(() => window.__DSH_EXPAND_PROCESS_ENABLED__()); const toggleExpand = () => setExpanded((value) => !value);',
      ],
    ],
    '@deepseek-ai/dsh-client-ui-chat': [
      [
        'const { expanded, toggle } = useDisclosure();',
        'const [expanded, setExpanded] = (0, react.useState)(() => window.__DSH_EXPAND_PROCESS_ENABLED__()); const toggle = () => setExpanded((value) => !value);',
      ],
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
export const EXPAND_PROCESS_SCRIPT = `(${bootExpandProcess.toString()})(${JSON.stringify(EXPAND_PROCESS_STORAGE_KEY)});`

/**
 * 读取开关状态；存储不可用时按关闭处理，不阻断设置页渲染。
 * @returns 是否默认展开思考与命令
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
 * 写入开关状态。
 * @param enabled 是否默认展开思考与命令
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
