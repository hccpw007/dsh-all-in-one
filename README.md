# dsh-all-in-one

DeepSeek Harness 的 all-in-one 插件：在「设置 → 定制功能」中用一个网格收纳各种独立小工具。
外壳只负责网格布局、功能切换与样式，每个功能的入口外观和页面内容都在自己的文件夹里实现。

## 目录结构

```
├── index.js                 # 宿主侧插件产物，由 build.ts 生成，请勿手改
├── client.js                # 浏览器端产物，由 build.ts 生成，请勿手改
├── cordis.patch.yml         # bundle 声明，安装时插入插件行
├── tsconfig.json            # TypeScript 配置（strict，仅类型检查不产出文件）
├── tailwind.config.ts       # Tailwind 配置，颜色映射宿主主题令牌
├── locale/{zh,en}.json      # 插件标题与描述
├── src/
│   ├── index.ts             # 宿主侧插件源码：向 index.html 注入「展开过程」引导脚本
│   ├── entry.tsx            # 注册 settings.section，合并外壳与各功能语言包
│   ├── styles/input.css     # Tailwind 入口
│   ├── types/               # 宿主 API（客户端与宿主侧）与资源模块的类型声明
│   ├── common/              # 跨功能复用的纯逻辑与工具（kebab-case 文件）
│   ├── components/          # 跨功能复用的 UI 组件（PascalCase 文件）
│   ├── shell/               # 外壳：feature 契约与注册表 + 网格页面
│   └── features/
│       ├── index.ts         # featureList：登记所有功能
│       ├── registry.ts      # 校验后的共享注册表，外壳与入口共用
│       ├── demo/            # 页面型示例功能，可作为模板复制
│       │   ├── index.tsx    # 注册定义：id、入口、页面与文案的装配
│       │   ├── entry.tsx    # 功能在网格中的入口，外观由功能自己设计
│       │   ├── page.tsx     # 功能页面内容与页头标题
│       │   └── locales.ts   # 本功能的中英文文案
│       └── expand-process/  # 开关型示例功能：展开过程
│           ├── index.tsx    # 注册定义：只提供 switch，没有独立页面
│           ├── toggle.tsx   # 网格中的开关入口
│           └── locales.ts   # 本功能的中英文文案
└── build.ts                 # 构建脚本，由 tsx 直接执行
```

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

`feature` 定义的字段契约见 `src/shell/registry.ts`。入口组件拿到 `t` 与 `open`，
可自行设计任意展现形式（卡片、按钮、横幅等），外壳只负责网格布局与打开动作；
开关型 feature 提供 `switch` 组件，外壳把它放进网格并占满整行。

## 「展开过程」开关

`expand-process` 让会话里的「思考」与「运行命令」默认展开。它的实现与普通页面型功能不同：

- 宿主侧 `src/index.ts` 把一段引导脚本注入 `index.html` 的 `<head>` 最前面，
  在客户端模块系统启动前接管 `window.__ModuleLoader__`，替换两个 UI 包 factory 的源码；
- 开关状态存在 localStorage 的 `dsh-all-in-one:expand-process` 键里，默认关闭；
- 切换开关后页面会自动刷新，让已渲染的会话内容也按新状态展示。

> 不要同时启用独立的 `dsh-plugin-expand-process`：两个插件都会改写同一段 UI 源码，
> 它会把展开状态写死为开启，导致本开关失效。迁移到本插件后请从 profile 中移除它。

## 功能之间如何互不干扰

- **语言 key**：每个功能自带 `locales`，外壳注册时统一加 `<id>.` 前缀，
  不同功能写同名 key（如 `title`）不会互相覆盖；页面拿到的 `t` 已绑定本功能前缀。
- **样式**：所有类名共用宿主的 `--dsw-alias-*` 令牌，Tailwind 构建期生成，
  功能内不做全局样式注入，功能间不会互相影响。
- **注册**：非法或缺字段的 feature 会被注册表跳过，单个功能出错不会拖垮整页。

## 公共代码放在哪里

- 被多个功能复用的 UI（按钮、面板等）→ `src/components/`
- 被多个功能复用的纯逻辑与工具函数 → `src/common/`
- 只被单个功能使用的代码 → 留在该功能自己的文件夹内，不提前抽象

新增公共能力时按上述目录落位，文件名遵循 kebab-case（工具）/ PascalCase（组件）。

## 开发与构建

```bash
npm install        # 首次安装构建依赖
npm run typecheck  # 仅执行 TypeScript 类型检查
npm run build      # 类型检查通过后产出 client.js（内含 Tailwind 生成的样式）
```

样式在构建期由 Tailwind 生成，颜色全部映射到宿主的 `--dsw-alias-*` 主题令牌，
因此页面会跟随宿主自动切换明暗主题，不写入字面色值。

项目源码与构建脚本均为 TypeScript，根目录的 `index.js`、`client.js` 是产物，不要手改；
修改 `src/` 或构建脚本后执行 `npm run build` 重新生成。

## 技术栈

- React（由宿主模块表提供，不随插件打包）
- TypeScript（strict 模式，构建前执行 `tsc --noEmit`；构建脚本用 `tsx` 执行）
- Tailwind CSS 3（构建期生成，preflight 关闭以免影响宿主样式）
