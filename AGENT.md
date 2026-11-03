# Agent.md

本文件是 AI 在本仓库中新增、修改功能或重构时的规则。规则只约束本项目的工程行为；
通用编码规范以 `project-coding-standards` skill 为准，两者冲突时以该 skill 的通用规范为准。

## 一、核心架构规则：功能自包含，壳子零功能

每个 feature 必须在自己的目录内包含完整实现：入口、页面、语言包、专属组件与逻辑、
宿主侧扩展。壳子只负责网格布局、功能切换、返回导航与装配注册，不承载任何具体功能。

- 功能实现一律留在 feature 目录；只被单个 feature 使用的代码不得放进 `src/common/` 或 `src/components/`。
- 宿主侧能力写在 feature 的 `host.ts`，由 `src/features/host.ts` 聚合，`src/index.ts` 只遍历调用。
- `src/features/index.ts`、`src/features/host.ts` 是装配清单，只列 feature 导出，不写实现。
- `src/shell/` 不感知任何 feature 的 id、文案、状态或业务逻辑。

**入口展现形式由 feature 自己设计**：外壳通过 `entry` 组件把入口原样渲染进网格，
不规定卡片结构、图标、标题排版或点击区域。

- 禁止在外壳中为入口新增统一的卡片模板、默认图标或字段（如 `titleKey`、`descriptionKey`、`icon`）。
- 入口的点击区域、可访问性（`button` / 焦点样式）由 feature 自行实现，外壳只传入 `open`。
- 功能页头部标题也由 feature 页面自行渲染，外壳只保留返回按钮。

## 二、feature 契约

定义位置：`src/shell/registry.ts` 的 `FeatureDefinition`，模板见 `src/features/power-pack/`（页面型）
与 `src/features/expand-process/`（开关型）。

| 字段 | 类型 | 说明 |
|------|------|------|
| `id` | `string` | 唯一标识，同时作为语言 key 前缀与渲染 key，重复时只保留第一个 |
| `locales` | `LocaleDictionaries` | 本功能中英文文案，外壳统一加 `<id>.` 前缀后注册 |
| `order` | `number` 可选 | 网格排序权重，越小越靠前，默认 100，相同权重保持注册顺序 |
| `entry` + `page` | `ComponentType<FeatureEntryProps>` + `ComponentType<FeaturePageProps>` | 页面型入口：网格入口 + 功能页面，二者必须同时提供 |
| `switch` | `ComponentType<FeatureSwitchProps>` | 开关型入口：网格中直接渲染开关，没有功能页面 |
| `client` | `FeatureClientExtension` 可选 | 网格与功能页之外的客户端扩展（如新会话界面选择器），由外壳统一执行 |

入口形态二选一：页面型提供 `entry` 与 `page`，开关型只提供 `switch`，不得混用。

客户端扩展（可选）由 feature 目录内的 `client.tsx` 导出 `apply(ctx, t)`，
外壳在设置页注册后统一执行。扩展用于网格与功能页之外的宿主界面（如新会话界面的
选择器），同样必须自包含在 feature 目录内；所需服务由扩展在 `apply` 内用
`ctx.inject([...], scoped => ...)` 按需声明，服务缺失时只跳过扩展，不能影响设置页主体。

组件 props：

- `FeatureEntryProps { t, open }`：`t` 已绑定本 feature 的前缀，`open()` 打开功能页面。
- `FeaturePageProps { t }`：`t` 已绑定本 feature 的前缀，页面直接用短 key（如 `title`）。
- `FeatureSwitchProps { t }`：`t` 已绑定本 feature 的前缀，开关外观与状态管理由 feature 自行实现。

契约校验：缺少 `id` / `locales`，或入口形态不完整（页面型缺 `entry`/`page`、开关型缺 `switch`），
或 id 重复的定义会被注册表跳过，单个 feature 出错不得影响整页渲染。
新增必需字段时必须同步更新 `isFeatureDefinition`。

## 三、新增 feature 的标准步骤

页面型：

1. 参考 `src/features/power-pack/`，在 `src/features/<id>/` 下新建 `index.tsx`、`entry.tsx`、`page.tsx` 与 `locales.ts`。
2. 修改 `index.tsx` 的 `id`（与文件夹名一致），并重写入口、页面与文案。
3. 入口在卡片右下角放一个「设置 ›」入口（`src/components/CardChevron` 提供箭头）：网格里页面型
   与开关型卡片外观一致，用户只能靠这个入口判断哪些格子点得进去；开关型入口不放该按钮。
4. 在 `src/features/index.ts` 的 `featureList` 中追加该文件夹的默认导出。
5. 执行 `npm run build`，刷新 Harness 页面确认入口与页面正常。

开关型：

1. 复制 `src/features/expand-process/` 为 `src/features/<id>/`。
2. 修改 `index.tsx` 的 `id`，重写 `toggle.tsx` 与 `locales.ts`；不要提供 `entry` / `page`。
3. 在 `featureList` 中追加该文件夹的默认导出。
4. 执行 `npm run build`，刷新 Harness 页面确认开关可用。

feature 需要宿主侧能力时（如注入 `index.html`）：在 feature 目录内新增 `host.ts`，
导出 `inject` 与 `apply`，再在 `src/features/host.ts` 的 `featureHosts` 中追加该模块。
禁止把宿主能力直接写进 `src/index.ts`；那里只做聚合与遍历。

不得为接入新功能修改外壳的网格渲染逻辑、`AllInOnePage.tsx` 或 `entry.tsx` 以外的公共层；
确需新增公共能力时，先按第四节落位。

## 四、目录与分层

```
├── index.js                 # 宿主侧插件产物，由 build.ts 生成，请勿手改
├── client.js                # 浏览器端产物，由 build.ts 生成，请勿手改
├── preset-pack.js           # 技能包预设内提示词行的产物，由 build.ts 生成
├── preset-isolate.js        # 技能包预设内隔离行的产物，由 build.ts 生成
├── cordis.patch.yml         # bundle 声明，安装时插入插件行
├── tsconfig.json            # TypeScript 配置（strict，仅类型检查不产出文件）
├── tailwind.config.ts       # Tailwind 配置，颜色映射宿主主题令牌
├── locale/{zh,en}.json      # 插件标题与描述
├── src/
│   ├── index.ts             # 宿主侧入口：只聚合各 feature 的 host 扩展并注册
│   ├── entry.tsx            # 注册 settings.section，合并外壳与各功能语言包
│   ├── styles/input.css     # Tailwind 入口
│   ├── types/               # 宿主 API（客户端与宿主侧）与资源模块的类型声明
│   ├── common/              # 被多个 feature 或壳子共用的纯逻辑与工具（kebab-case 文件）
│   │   ├── dsh-home.ts      # 解析 $DSH_HOME，技能包与删除会话共用
│   │   └── http-route.ts    # 本地 JSON 路由的回环校验与收发，两个功能的宿主路由共用
│   ├── components/          # 被多个 feature 或壳子共用的 UI 组件（PascalCase 文件）
│   │   └── CardChevron.tsx  # 「可进入」箭头标记，页面型入口共用
│   ├── shell/               # 外壳：feature 契约与注册表、网格页面、设置导航图标
│   └── features/
│       ├── index.ts         # featureList：登记所有功能（装配清单）
│       ├── host.ts          # featureHosts：登记各功能的宿主侧扩展（装配清单）
│       ├── registry.ts      # 校验后的共享注册表，外壳与入口共用
│       ├── power-pack/      # 技能包：按任务装配技能、插件，并控制已安装 MCP 是否生效
│       │   ├── index.tsx    # 注册定义：页面型入口与页面
│       │   ├── entry.tsx    # 网格入口：卡片主体进入页面，右侧是技能包总开关（默认关）
│       │   ├── page.tsx     # 技能包列表、编辑与删除
│       │   ├── PackEditor.tsx        # 单个技能包的编辑表单
│       │   ├── ResourceRuleField.tsx # 「全部 / 仅引用 / 仅排除」规则编辑
│       │   ├── api.ts       # 与宿主侧路由通信
│       │   ├── preset-entry.ts # 预设内提示词行，独立打包为 preset-pack.js
│       │   ├── types.ts     # 客户端与宿主共用的数据模型
│       │   ├── host.ts      # 宿主侧入口：安装按需注册与 HTTP 路由
│       │   ├── host/        # 技能包存储、技能扫描、模式行读取与组合、路由实现
│       │   │   ├── compose.ts       # 模式行 + 技能包行合成
│       │   │   ├── composition.ts   # 技能包自己追加的预设行
│       │   │   ├── presets.ts       # 组合预设的注册、失效与 id 解析
│       │   │   ├── preset-lazy.ts   # 按需注册：宿主解析组合 id 时才挂载预设
│       │   │   ├── isolation.ts     # 把全局能力规则翻译成隔离计划
│       │   │   ├── isolate-entry.ts # 预设内隔离行，独立打包为 preset-isolate.js
│       │   │   ├── global-catalog.ts # 枚举可隔离的全局能力组
│       │   │   └── package-scan.ts   # 已装插件的工具归属扫描
│       │   └── locales.ts   # 本功能的中英文文案
│       ├── expand-process/  # 开关型功能：展开过程
│           ├── index.tsx    # 注册定义：只提供 switch，没有独立页面
│           ├── toggle.tsx   # 网格中的开关入口
│           ├── expand-process.ts # 引导脚本与开关状态读写，本功能专属
│           ├── host.ts      # 宿主侧扩展：向 index.html 注入引导脚本
│           └── locales.ts   # 本功能的中英文文案
│       ├── image-preview/   # 开关型功能：会话中的本地图片地址下方显示预览，并统一图片放大层
│           ├── index.tsx    # 注册定义：switch 入口 + client 扩展
│           ├── toggle.tsx   # 网格中的开关入口
│           ├── storage.ts   # 开关状态读写（localStorage），本功能专属
│           ├── client.tsx   # 客户端扩展：开关打开时安装会话观察器与图片点击接管
│           ├── conversation.ts # 会话正文容器定位，扫描与点击接管共用同一套选择器
│           ├── observer.ts  # 观察会话正文容器，按帧合并扫描新增文本
│           ├── preview.ts   # 识别本地图片路径与附件 ID，并在消息块后插入预览节点
│           ├── image-click-zoom.ts # 接管会话区图片点击（含宿主图片），改用统一放大层
│           ├── lightbox.ts  # 统一放大层：关闭按钮、工具栏与拖动（原生 DOM，挂在 body 上）
│           ├── lightbox-zoom.ts # 缩放与位移计算：适应窗口、档位缩放、以光标为中心缩放
│           ├── host.ts      # 宿主侧扩展：注册图片读取路由
│           ├── host/        # 本地图片读取
│           │   └── routes.ts # GET /dsh-all-in-one/image
│           └── locales.ts   # 本功能的中英文文案
│       ├── session-history/ # 开关型功能：轮次导航条移到对话左侧
│           ├── index.tsx    # 注册定义：switch 入口 + client 扩展
│           ├── toggle.tsx   # 网格中的开关入口
│           ├── storage.ts   # 开关状态读写（localStorage），本功能专属
│           ├── client.tsx   # 客户端扩展：开关打开时安装导航条搬运
│           ├── turn-nav.ts  # 导航条左侧定位与预览卡反转
│           └── locales.ts   # 本功能的中英文文案
│       ├── sidebar-more/    # 开关型功能：侧边栏顶部入口收进左下角「更多」菜单
│           ├── index.tsx    # 注册定义：switch 入口 + client 扩展
│           ├── toggle.tsx   # 网格中的开关入口
│           ├── storage.ts   # 开关状态读写（localStorage），本功能专属
│           ├── client.tsx   # 客户端扩展：开关打开时安装菜单搬运
│           ├── sidebar-more.ts # 顶部面板隐藏与菜单项注入、顶部子项触发
│           ├── open-settings.ts # 菜单里的 All In One 入口：打开设置弹窗并切到本插件分区
│           └── locales.ts   # 本功能的中英文文案
│       ├── delete-session/  # 开关型功能：删除单条会话，或一键删除工作区里的全部会话
│           ├── index.tsx    # 注册定义：switch 入口 + client 扩展
│           ├── toggle.tsx   # 网格中的开关入口
│           ├── delete-session.ts # 开关状态读写（localStorage），本功能专属
│           ├── client.tsx   # 客户端扩展：注册会话行删除按钮、工作区「删除所有会话」入口与确认弹窗
│           ├── workspace-menu.ts # 工作区「更多」菜单的「删除所有会话」注入（宿主菜单无扩展点）
│           ├── DeleteSessionButton.tsx # 会话行上的删除图标按钮（只发起确认）
│           ├── DeleteSessionDialog.tsx # shell.overlay 里的确认弹窗（单条会话与工作区批量共用）
│           ├── confirm-store.ts        # 删除入口与弹窗之间的待确认请求快照存储
│           ├── api.ts       # 与宿主侧删除路由通信（单条与批量）
│           ├── types.ts     # 客户端与宿主共用的请求/响应模型
│           ├── host.ts      # 宿主侧扩展：注册删除路由
│           ├── host/        # 会话目录定位与递归删除、派生记录清理、路由实现
│           │   ├── delete-session.ts # 按会话 id 删除会话目录并汇总报告（单条与批量）
│           │   ├── session-records.ts # 清投影缓存与工作区里的会话 id
│           │   └── routes.ts         # POST /dsh-all-in-one/sessions 与 /sessions/batch
│           └── locales.ts   # 本功能的中英文文案
│       ├── project-memory/  # 页面型功能：按项目共享的长期记忆（格式同 Claude Code）
│           ├── index.tsx    # 注册定义：入口与记忆路径页面
│           ├── entry.tsx    # 网格入口：卡片主体进入页面，右侧是启用开关
│           ├── page.tsx     # 记忆路径配置页面（根目录、当前生效目录）
│           ├── api.ts       # 与宿主侧设置路由通信
│           ├── types.ts     # 客户端与宿主共用的设置模型
│           ├── host.ts      # 宿主侧扩展：提示词注入、记忆工具与设置路由
│           ├── host/        # 目录映射、文件读写、注入与工具实现
│           │   ├── paths.ts       # 根目录解析与项目目录映射（与 Claude Code 一致）
│           │   ├── settings.ts    # 开关与根目录的持久化（带 mtime 缓存）
│           │   ├── state.ts       # 运行期「当前该用哪个目录」
│           │   ├── session-dir.ts # 从会话头取项目目录
│           │   ├── store.ts       # 记忆文件读写、索引维护与注入文本渲染
│           │   ├── prompt.ts      # 提示词段落注册与渲染缓存
│           │   ├── tool.ts        # memory 工具（save/list/read/delete）
│           │   └── routes.ts      # GET/POST /dsh-all-in-one/memory
│           └── locales.ts   # 本功能的中英文文案
│       ├── auto-compact/    # 开关型功能：上下文达到阈值时压缩较早的历史
│       │   ├── index.tsx    # 注册定义：只提供 switch，没有独立页面
│       │   ├── toggle.tsx   # 网格中的开关入口与阈值/保留两个输入框
│       │   ├── api.ts       # 与宿主侧设置路由通信
│       │   ├── types.ts     # 客户端与宿主共用的设置模型
│       │   ├── host.ts      # 宿主侧扩展：设置路由与每步前的压缩检查
│       │   ├── host/        # 设置持久化、路由与触发逻辑
│       │   │   ├── settings.ts # 开关与两个百分比的持久化（带 mtime 缓存）
│       │   │   ├── routes.ts   # GET/POST /dsh-all-in-one/auto-compact
│       │   │   ├── region.ts   # 选压缩范围：保留近期尾部，压掉更早的历史
│       │   │   └── watcher.ts  # 每步前读占用，达阈值就压缩
│       │   └── locales.ts   # 本功能的中英文文案
│       ├── desktop-cookie/  # 开关型功能：桌面版启动时清理过期的认证 Cookie
│       │   ├── index.tsx    # 注册定义：只提供 switch，没有独立页面
│       │   ├── toggle.tsx   # 网格中的开关入口与阈值/保留两个输入框
│       │   ├── api.ts       # 与宿主侧设置路由通信
│       │   ├── types.ts     # 客户端与宿主共用的设置模型
│       │   ├── host.ts      # 宿主侧扩展：启动清理与设置路由
│       │   ├── host/        # 设置持久化、cookie 清理与路由
│       │   │   ├── settings.ts # 开关、阈值与保留条数的持久化
│       │   │   ├── cleanup.ts  # 定位 cookie 库并按阈值删除 dsh-auth-* 记录
│       │   │   └── routes.ts   # GET/POST /dsh-all-in-one/desktop-cookie
│       │   └── locales.ts   # 本功能的中英文文案
└── build.ts                 # 构建脚本，由 tsx 直接执行
```

### 项目记忆的格式约束

记忆文件必须与 Claude Code 保持同构，根目录指向 `~/.claude/projects` 时两边共用同一套：

- 目录映射：`<根目录>/<项目路径 slug>/memory/`，slug 为项目绝对路径中所有非字母数字字符
  替换成 `-`（`/Users/x/app` → `-Users-x-app`）。
- 索引：`MEMORY.md`，一行一条 `- [标题](name.md) — 摘要`；写入时按链接目标匹配已有行，
  保留原标题，只更新摘要。
- 单条：`<name>.md`，frontmatter 含 `name` / `description` / `metadata.type`，
  类型取 user / feedback / project / reference；正文用 `[[其它记忆名]]` 互引。
- 记忆名只允许 `[a-z0-9-]`：它拼进文件名与链接，越界即拒绝写入。

注入上下文的内容只有 `MEMORY.md` 索引 + 一行目录说明，**不要改成注入全部记忆正文**：
记忆随使用持续增长，全量注入会让每轮请求的上下文随记忆条数线性膨胀。正文由 `memory`
工具的 `read` 动作按需读取，与 Claude Code 的行为一致。

修改这几条规则前先确认真实目录里已有文件仍被正确解析（`parseMemoryFile` 只认上述字段，
其余内容原样留在正文）；本插件不得写出 Claude Code 读不懂的文件。

| 目录 | 职责 |
|------|------|
| `src/shell/` | 外壳：feature 契约、注册表、网格页面、返回导航与设置导航图标 |
| `src/features/<id>/` | 单个功能：`index.tsx` 装配、`locales.ts` 文案；页面型另有 `entry.tsx` 入口与 `page.tsx` 页面，开关型另有 `toggle.tsx` 开关；需要宿主能力时另有 `host.ts` |
| `src/components/` | 被多个 feature 或壳子与 feature 共用的 UI 组件（PascalCase 文件名） |
| `src/common/` | 被多个 feature 或壳子与 feature 共用的纯逻辑与工具（kebab-case 文件名） |
| `src/types/` | 宿主 API 与资源模块的类型声明 |
| `locale/` | 插件标题与描述，供宿主展示插件信息 |

- 只被单个 feature 使用的代码留在该 feature 目录内，不提前抽象到公共层。
- 禁止 feature 反向依赖外壳页面的具体实现（只能依赖 `shell/registry` 的契约与公共层）。
- 新增宿主 API 能力时，先补 `src/types/plugin.ts` 的类型声明，不在业务代码里散落 `any`。

## 五、样式与语言包

- 颜色只能使用 `tailwind.config.ts` 中映射到宿主 `--dsw-alias-*` 令牌的类名，
  不写字面色值，不新增未映射的颜色；preflight 保持关闭。
- 不注入全局样式；样式随插件生命周期注入与移除（`entry.tsx` 中的 `effect`）。
- feature 文案写在各自的 `locales.ts`，key 不含前缀；外壳注册时统一加 `<id>.` 前缀。
  不同 feature 写同名 key 不会互相覆盖，禁止把 feature 文案写进外壳字典。
- 样式在构建期由 Tailwind 生成，页面跟随宿主自动切换明暗主题。
- 宿主在 `:root` 上把 `--dsw-corner-shape` 设为 `superellipse(1.5)`（超椭圆圆角），
  小尺寸胶囊（开关轨道与滑块）会因此看起来"圆角不够"；需要标准圆角的区域必须在容器内
  同时重置该变量与 `corner-shape: round`（入口网格 `.aio-card-grid` 已处理）。
- 入口网格的列数写在 `src/styles/input.css`（`.dsh-aio-root .aio-card-grid`，窄屏一列、
  宽屏两列），**不要改回 `grid-cols-1 sm:grid-cols-2` 工具类**：宿主与其它插件
  （如 dsh-ide）也会输出同名类 `.grid-cols-1`，同特异性下后注入的样式会盖掉响应式两列，
  网格会退化成一行一张卡片。插件样式要用两个类以上的特异性，才能不受注入顺序影响。

## 五之二、会话级隔离的两层结构

宿主的插件组合分两层，技能包的边界完全建立在这个区分上，改动组合逻辑前必须先确认落在哪一层：

- **全局层**：profile 的 `dsh.profile.bundles` 与 `$DSH_HOME/cordis.patch.yml` 在进程启动时加载，
  注册进全局作用域，任何会话都会继承。预设既不能卸载它，也不能靠再挂一行覆盖它
  （同一 `serverName`、同名工具都会冲突）。
- **预设层**：`agentPresets.register()` 的每一行挂在该预设自己的 scope 下，Agent 的 scope 以预设 scope
  为父，因此只对绑定它的会话可见。技能目录、`skill` 工具、MCP 客户端、提示词段都属于这一层。

因此：

- 想让技能包「少点什么」，只能让它在预设层不注册（标准工具行与技能目录都是这样做的）；
  已安装的 MCP 服务器由宿主配置文件声明，预设层没有对应行可删，只能用会话级掩码摘掉。
- 全局层里已有的能力只能用会话级掩码摘掉：`tools.restrict({ deny })`（工具）与
  `system-prompt/assemble` 上的装配过滤（提示词）。两者都必须在**预设作用域**里注册，
  写成全局注册会命中所有会话。
- 已装插件不要在预设里再挂一行：它已在全局层加载，重复挂载会冲突；技能包对它只有
  「保留 / 屏蔽」，由隔离行实现。
- 已装插件与全局 MCP 不单独建板块：它们分别进入 `plugins`（`pkg:<包名>`）与 `mcp`
  （`mcp:<服务器名>`）的三态规则，与标准行共用一套选择语义；不要再加
  「全局能力」之类的第二套开关。
- 技能包不再维护自己的 MCP 服务器定义：服务器只在宿主配置文件里声明，技能包只决定
  它在本次会话里是否生效。回归「添加 MCP 服务器」的做法会让同一台服务器散落在多份配置里。
- 严格提示词隔离在排除已装插件时自动启用（该类插件会改写提示词），没有独立开关。
  它只恢复 `sections`，`contexts` 必须保留下游结果：工作目录等运行时事实由官方插件
  在装配 waterfall 里补齐，回退成快照会把它们丢掉。
- 提示词注入有两条路径：`system-prompt/assemble` 事件（作用域监听器能拦）和直接包装
  `systemPrompt.assemble` 方法（事件拦不到，dsh-purge 走的就是这条）。后者由
  `host/prompt-overlay.ts` 在宿主侧兜底：预设行把干净段落写进 `globalThis` 上的
  共享 WeakMap，最外层包装在方法返回后按作用域替换。改动这段前先跑
  「构造 dsh-purge 式包装 + 两个预设」的验证，确认未隔离的会话仍能看到注入。

## 五之三、组合预设必须按需注册

宿主 `agentPresets.register()` 是 eager 的：注册的同时就挂载一整棵预设行树并审计
每一行。组合预设曾按 `compose-state` 在启动时逐条重建，实测每条组合多花约 1 秒、
CPU 占用显著抬高（三条组合把冷启动从 5.3 秒拖到 10 秒以上）。

因此组合预设一律**按需注册**：启动期只读记录，`host/preset-lazy.ts` 包住宿主解析
预设 id 的四个入口（`resolve` / `acquireScope` / `select` / `mount`），参数命中
`power-pack-*` 且尚未注册时才现场挂载那一条，并发请求合并为一次。

- 不要恢复「启动时批量重建」：那会重新引入冷启动延迟与 CPU 尖峰。
- 新增依赖预设解析的宿主入口时，把方法名与预设 id 的参数下标补进 `PRESET_ARG_INDEX`；
  宿主改签名时包装层会跳过缺失的方法，功能退化为「该入口不触发重建」，不会崩溃。
- 包装方法写在服务实例上而非原型：宿主的远程调用按原型读取参数签名，写在实例上
  既不影响远程校验，也能被 `Object.getOwnPropertyDescriptor` 判定为已安装。
- **名单必须包装补齐**：按需注册的组合不在宿主 `list()` 里，而会话标题旁的预设标签按
  名单查名字，查不到就退回显示原始 id（重启后第一次打开会话可见 `power-pack-xxx@mode`）。
  `preset-lazy.ts` 因此也包住宿主名单方法，用 `pendingComposedMeta()` 补上名称与描述。
  补齐行必须带 `isDefault: false`——`remoteExportList` 的结果走严格 schema，该字段必填，
  漏掉会让整个名单被拒、界面直接空掉。

## 五之三之二、技能包总开关

`power-packs.json` 的 `enabled` 字段控制新会话能否使用技能包，旧文件没有该字段时按关闭处理。

- 开关只影响**新组合**：`host/routes.ts` 的 `compose` 分支在关闭时直接拒绝；`client.tsx`
  的选择器按 `load()` 读到的开关状态决定是否渲染技能包下拉。
- 已经注册的组合预设与绑定它们的历史会话保持不变，不要因关闭去 `dispose` 预设：
  历史会话在重启后仍要靠按需重建恢复。
- 没有任何技能包时不允许打开：界面禁用开关并提示原因，服务端 `setEnabled` 同样拒绝。
- 开关写入 `power-packs.json` 本身，不另建配置文件。

## 五之四、插件不得拖慢宿主启动与稳态

本节是性能方面的硬约束，适用于**所有 feature**，不限于技能包。

### 后台任务：启动期只做流式读取，重活一律推迟或懒加载

插件 `apply()` 在宿主加载链路里同步执行，任何 `await` 都会推迟宿主就绪时间。

- 禁止在 `apply()` 及其同步分支里扫描目录树、读大文件、解析大量 JSON。
  这类工作只在用户打开对应页面或发请求时做（参考 `routes.ts` 的按需 `buildPayload`）。
- 禁止启动时循环调用会触发宿主挂载的宿主 API（`agentPresets.register` 只是其中最贵的
  一个）。凡「注册类」API 都要先确认它是惰性还是 eager，eager 的一律改成按需注册。
- 需要预热的少量状态用 `ctx.effect` 异步发起并 `void` 掉，且失败只记日志，不阻塞启动。

### 定时器与监听器：必须可回收，且不能自激

- 所有 `setInterval` / `setTimeout` / 事件订阅都必须在 `ctx.effect` 的清理函数里撤销；
  长间隔检查用 `timer.unref()` 保证不阻止进程退出（参考 `prompt-overlay.ts`）。
- 监听器里执行会再次触发同类事件的写操作时，必须有「进行中」闸门，否则会无限自激把
  CPU 打满（参考 `isolate-entry.ts` 的 `applying` 标志）。
- 客户端同理：`MutationObserver` 必须限定观察范围并及时 `disconnect`，回调里合并批次，
  不要对 `document.body` 全量子树做无节流的同步查询。

### 计费点：任何「按数量增长」的启动开销都是隐患

`compose-state` 那次事故的本质是：启动开销 = 历史记录条数 × 单条挂载成本。
凡是启动路径上出现「遍历用户积累的数据并逐个执行操作」，必须改为：

1. 启动期只读数据、只做过滤；
2. 真正的操作推迟到用户实际用到该条数据时；
3. 并发请求合并（同一目标只跑一次，见 `preset-lazy.ts` 的 `rebuilding` 表）。

### 性能改动必须实测，不能靠推断

改动涉及启动链路、定时器、监听器、宿主注册时，按以下方式给出前后对比数字：

- 启动耗时以「宿主打印 `dsh web: http://…`」或 UI 首屏可交互为终点，冷启动连测至少 3 次；
- CPU 用 `ps -o pcpu=` 采样，同时记录**启动期峰值**与**启动后稳态均值**；
- 对照实验法：保留/禁用本插件、清空引起增长的数据源，各测一轮，确认差异确实来自本插件；
- 结论写进提交说明，包含具体数值，不写「明显变快」这类无据描述。

## 六、设置导航图标

宿主设置导航的图标由内置 id 决定，`settings.section` 插槽不支持传图标。
`src/shell/settings-nav-icon.ts` 在设置弹窗挂载后，按当前语言的导航标签认领本插件那一行，
隐藏宿主齿轮并用 `icon.svg` 作为背景图绘制插件图标；语言切换或弹窗重建时自动重新认领，
插件卸载时移除标记与样式。宿主改动了设置弹窗结构时，最坏情况只是回退到宿主齿轮，不影响功能。

## 七、命名与代码规范

- 组件/页面文件用 PascalCase（`entry.tsx` 中的组件名如 `DemoEntry`），目录与工具文件用 kebab-case。
- 变量/函数 camelCase，类型/接口 PascalCase，常量 UPPER_SNAKE_CASE。
- 注释解释「为什么」，i18n key 所在元素上方必须注释业务含义；功能变更同步更新注释。
- 每个 `try` 必须有 `catch` 并输出日志，禁止空 catch 与吞错误。
- 修改文件前评估有效代码行：组件软阈值 400 / 硬阈值 600，公共工具 150 / 250。
  超阈值须按规范做拆分评估，结论必须给出「物理行数 / 有效代码行」两个数字。
- 死代码零残留：任务结束前清除未使用的变量、函数、导入与注释掉的旧代码。

## 八、构建与验证

技术栈：React（由宿主模块表提供，不随插件打包）、TypeScript（strict）、Tailwind CSS 3（构建期生成，preflight 关闭）。

- 源码与构建脚本均为 TypeScript；`npm run typecheck` 执行 `tsc --noEmit`（strict）。
- `npm run build` 先类型检查，再由 `build.ts` 生成 Tailwind 样式并产出根目录的 `index.js`、`client.js`。
- `src/features/power-pack/preset-entry.ts` 与 `src/features/power-pack/host/isolate-entry.ts`
  由构建脚本分别单独打包为根目录的 `preset-pack.js` 与 `preset-isolate.js`，它们被组合预设
  作为行加载，不能并进宿主入口：并进去就会随插件整体加载，而不是只在预设作用域生效。
- `index.js`、`client.js`、`preset-pack.js`、`preset-isolate.js`、`.build/` 是产物，禁止手改；改 `src/` 或构建脚本后必须重新构建。
- React 由宿主模块表提供，不随插件打包；新增运行时依赖前先确认宿主是否已提供。
- 任何代码改动完成后：先构建通过，再按项目约定确认验证方式，最后提交。

## 九、文档同步

`README.md` 面向使用者，只介绍插件是什么、有哪些功能以及怎么用，不写目录结构、构建命令等技术内容；
工程实现、目录约定与构建方式一律写在本文件。

以下内容变化时，必须在同一次修改中同步更新文档：

| 变化 | 需更新 |
|------|--------|
| 功能对使用者的行为、入口位置、配置方式 | `README.md` |
| feature 契约字段、注册流程 | 本文件 |
| 目录结构、公共层落位、构建命令与产物 | 本文件 |
| 插件标题/描述 | `locale/zh.json`、`locale/en.json` |
