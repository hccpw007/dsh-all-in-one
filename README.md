# dsh-all-in-one

DeepSeek Harness 的 all-in-one 插件：在「设置 → All In One」中用一个网格收纳各种独立小工具。
外壳只负责网格布局、功能切换与样式，每个功能的入口外观和页面内容都在自己的文件夹里实现。

## 目录结构

```
├── index.js                 # 宿主侧插件产物，由 build.ts 生成，请勿手改
├── client.js                # 浏览器端产物，由 build.ts 生成，请勿手改
├── preset-pack.js          # 「技能包」预设内提示词行的产物，由 build.ts 生成
├── cordis.patch.yml         # bundle 声明，安装时插入插件行
├── tsconfig.json            # TypeScript 配置（strict，仅类型检查不产出文件）
├── tailwind.config.ts       # Tailwind 配置，颜色映射宿主主题令牌
├── locale/{zh,en}.json      # 插件标题与描述
├── src/
│   ├── index.ts             # 宿主侧入口：只聚合各 feature 的 host 扩展并注册
│   ├── preset-pack.ts      # 「技能包」预设内的提示词行，独立打包为 preset-pack.js
│   ├── entry.tsx            # 注册 settings.section，合并外壳与各功能语言包
│   ├── styles/input.css     # Tailwind 入口
│   ├── types/               # 宿主 API（客户端与宿主侧）与资源模块的类型声明
│   ├── common/              # 被多个 feature 或壳子共用的纯逻辑与工具（kebab-case 文件）
│   ├── components/          # 被多个 feature 或壳子共用的 UI 组件（PascalCase 文件）
│   ├── shell/               # 外壳：feature 契约与注册表、网格页面、设置导航图标
│   └── features/
│       ├── index.ts         # featureList：登记所有功能（装配清单）
│       ├── host.ts          # featureHosts：登记各功能的宿主侧扩展（装配清单）
│       ├── registry.ts      # 校验后的共享注册表，外壳与入口共用
│       ├── demo/            # 页面型示例功能，可作为模板复制
│       │   ├── index.tsx    # 注册定义：id、入口、页面与文案的装配
│       │   ├── entry.tsx    # 功能在网格中的入口，外观由功能自己设计
│       │   ├── page.tsx     # 功能页面内容与页头标题
│       │   ├── Card.tsx     # 本功能专属面板，随 demo 一起复制
│       │   └── locales.ts   # 本功能的中英文文案
│       ├── power-pack/      # 技能包：按任务装配技能、插件与 MCP
│       │   ├── index.tsx    # 注册定义：页面型入口与页面
│       │   ├── entry.tsx    # 网格入口
│       │   ├── page.tsx     # 技能包列表、编辑与删除
│       │   ├── PackEditor.tsx      # 单个技能包的编辑表单
│       │   ├── ResourceRuleField.tsx # 「全部 / 仅引用 / 仅排除」规则编辑
│       │   ├── McpServerEditor.tsx  # MCP 服务器定义编辑
│       │   ├── api.ts       # 与宿主侧路由通信
│       │   ├── types.ts     # 客户端与宿主共用的数据模型
│       │   ├── host.ts      # 宿主侧入口：注册预设与 HTTP 路由
│       │   ├── host/        # 技能包存储、技能扫描、模式行读取与组合、路由实现
│       │   └── locales.ts   # 本功能的中英文文案
│       └── expand-process/  # 开关型示例功能：展开过程
│           ├── index.tsx    # 注册定义：只提供 switch，没有独立页面
│           ├── toggle.tsx   # 网格中的开关入口
│           ├── expand-process.ts # 引导脚本与开关状态读写，本功能专属
│           ├── host.ts      # 宿主侧扩展：向 index.html 注入引导脚本
│           └── locales.ts   # 本功能的中英文文案
└── build.ts                 # 构建脚本，由 tsx 直接执行
```

## 功能自包含，壳子零功能

每个 feature 在自己的目录内包含完整实现：入口、页面、语言包、专属组件与逻辑、
宿主侧扩展。外壳（`src/shell/`、`src/index.ts`、`src/features/index.ts`、
`src/features/host.ts`）只做网格布局、功能切换、返回导航与装配注册，不承载具体功能。

- 只被单个 feature 使用的代码必须留在该 feature 目录内，不放进 `src/common/` 或 `src/components/`。
- 需要宿主能力时，在 feature 目录内新增 `host.ts`（导出 `inject` 与 `apply`），
  再到 `src/features/host.ts` 登记；`src/index.ts` 只负责合并依赖并遍历调用。

## 设置导航图标

宿主设置导航的图标由内置 id 决定，`settings.section` 插槽不支持传图标。
`src/shell/settings-nav-icon.ts` 在设置弹窗挂载后，按当前语言的导航标签认领本插件那一行，
隐藏宿主齿轮并用 `icon.svg` 作为背景图绘制插件图标；语言切换或弹窗重建时自动重新认领，
插件卸载时移除标记与样式。宿主改动了设置弹窗结构时，最坏情况只是回退到宿主齿轮，不影响功能。

## 新增一个功能

页面型（点击卡片进入独立页面）：

1. 复制 `src/features/demo/` 为 `src/features/<id>/`
2. 修改 `index.tsx` 里的 `id`，并在 `entry.tsx`、`page.tsx`、`locales.ts` 中写入本功能的内容
3. 在 `src/features/index.ts` 的 `featureList` 里追加该文件夹的默认导出
4. 运行 `npm run build`，刷新 Harness 页面，卡片即出现在网格中

开关型（没有独立页面，网格中直接渲染开关）：

1. 复制 `src/features/expand-process/` 为 `src/features/<id>/`
2. 修改 `index.tsx` 里的 `id`，重写 `toggle.tsx` 与 `locales.ts`
3. 同样在 `featureList` 中登记并构建

两种形态需要宿主侧能力时，都在各自目录内新增 `host.ts`，再到 `src/features/host.ts` 登记。

`feature` 定义的字段契约见 `src/shell/registry.ts`。入口组件拿到 `t` 与 `open`，
可自行设计任意展现形式（卡片、按钮、横幅等），外壳只负责网格布局与打开动作；
开关型 feature 提供 `switch` 组件，外壳把它放进网格并占满整行。

## 「展开过程」开关

`expand-process` 让会话里的「思考」与「运行命令」默认展开。它的实现与普通页面型功能不同：

- 宿主侧 `src/features/expand-process/host.ts` 把一段引导脚本注入 `index.html` 的 `<head>` 最前面，
  在客户端模块系统启动前接管 `window.__ModuleLoader__`，替换两个 UI 包 factory 的源码；
- 开关状态存在 localStorage 的 `dsh-all-in-one:expand-process` 键里，默认关闭；
- 切换开关后页面会自动刷新，让已渲染的会话内容也按新状态展示。

> 不要同时启用独立的 `dsh-plugin-expand-process`：两个插件都会改写同一段 UI 源码，
> 它会把展开状态写死为开启，导致本开关失效。迁移到本插件后请从 profile 中移除它。

## 「技能包」

`power-pack` 让不同任务的对话使用不同的技能、插件与 MCP。它在新建任务界面上
提供两个**相互独立**的下拉：左「模式」（标准、PTC、极简、创造等宿主预设）与
右「技能包」（本插件维护的技能包）。两者不是二选一：模式决定基础工具与提示词，
技能包在模式之上筛选技能与工具、追加 MCP 与系统提示词。

宿主一次只认一个 Agent 预设，因此技能包非空时由宿主侧把「所选模式的行 + 技能包追加行」
合成为一个组合预设（id 形如 `power-pack-<技能包 id>@<模式 id>`）再交给宿主挂载；同一时间
只保留一个组合，换选择时先撤销旧的再注册新的。技能包本身不再单独预注册成预设，
所以宿主原生预设列表里不会出现一堆用不到的技能包条目。

新会话界面的预设位是宿主的 single 插槽，插件用更低的 `priority` 覆盖了宿主
选择器，并复用宿主 `@deepseek-ai/dsh-client-ui-primitives` 的 `Menu` 与图标组件，
按钮沿用宿主预设选择器的类名，外观与原生模式选择器一致。新会话屏幕还没有
会话时，两个维度的选择先暂存，等空白会话出现后再提交。

一个技能包可以维护：

- **技能**：`全部 / 仅引用 / 仅排除` 三种规则。非「全部」时，插件会在
  `$DSH_HOME/all-in-one/power-packs/<技能包 id>/skills/` 下生成只含符号链接的目录，
  组合只扫描该目录，于是未勾选的技能不会出现在会话的技能目录里。模式的技能行
  始终被技能包接管，不会重复挂载。
- **插件与工具**：规则作用于**所选模式实际挂载的工具行**——勾选标准项即把它对应
  的行保留（仅引用）或剔除（仅排除）；模型、Agent 循环等非工具行不受影响。
  profile 中已安装的 `dsh-plugin-*` 也可显式勾选，按「仅引用」追加，但它们可能
  已在全局加载，重复挂载有冲突风险。
- **MCP 服务器**：为技能包定义 stdio 或 HTTP 服务器，每个启用的服务器作为独立的
  `mcp-client` 行挂载，工具名形如 `mcp__<服务器标识>__<工具名>`。
- **系统提示词**：追加到系统提示词末尾（排在部署人设后缀之后），不覆盖宿主人设。

技能包追加的固定两行：`skill-filesystem`（按规则扫描技能根）与 `tool-skill`（提供
技能目录与加载工具）。没有它们，勾选的技能不会进入系统提示词。

技能包配置保存在 `$DSH_HOME/all-in-one/power-packs.json`，不在 profile 的 patch 里，
升级或切换 bundle 不会被覆盖。设置页通过插件注册的 `/dsh-all-in-one/power-packs` 路由
读写配置，写入只接受本机回环请求；选择技能包时客户端还用同一路由请求合成组合预设。
首次读取时若新文件不存在，会依次把 `skill-packs.json`、`chat-styles.json` 迁移过来，已有技能包不丢。

> 组合预设注册在**内存**中，宿主重启后由插件在下次选择时重新合成；删除或修改
> 技能包会让当前组合失效并清理它的技能链接目录。

## 功能之间如何互不干扰

- **语言 key**：每个功能自带 `locales`，外壳注册时统一加 `<id>.` 前缀，
  不同功能写同名 key（如 `title`）不会互相覆盖；页面拿到的 `t` 已绑定本功能前缀。
- **样式**：所有类名共用宿主的 `--dsw-alias-*` 令牌，Tailwind 构建期生成，
  功能内不做全局样式注入，功能间不会互相影响。
- **注册**：非法或缺字段的 feature 会被注册表跳过，单个功能出错不会拖垮整页。

## 公共代码放在哪里

- 被多个 feature 或壳子与 feature 共用的 UI（按钮等）→ `src/components/`
- 被多个 feature 或壳子与 feature 共用的纯逻辑与工具函数 → `src/common/`
- 只被单个 feature 使用的代码 → 留在该 feature 目录内，不提前抽象

新增公共能力时按上述目录落位，文件名遵循 kebab-case（工具）/ PascalCase（组件）。

## 开发与构建

```bash
npm install        # 首次安装构建依赖
npm run typecheck  # 仅执行 TypeScript 类型检查
npm run build      # 类型检查通过后产出 client.js（内含 Tailwind 生成的样式）
```

样式在构建期由 Tailwind 生成，颜色全部映射到宿主的 `--dsw-alias-*` 主题令牌，
因此页面会跟随宿主自动切换明暗主题，不写入字面色值。

项目源码与构建脚本均为 TypeScript，根目录的 `index.js`、`client.js`、`preset-pack.js`
是产物，不要手改；修改 `src/` 或构建脚本后执行 `npm run build` 重新生成。

## 技术栈

- React（由宿主模块表提供，不随插件打包）
- TypeScript（strict 模式，构建前执行 `tsc --noEmit`；构建脚本用 `tsx` 执行）
- Tailwind CSS 3（构建期生成，preflight 关闭以免影响宿主样式）
