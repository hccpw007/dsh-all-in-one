# Agent.md

本文件是 AI 在本仓库中新增、修改功能或重构时的规则。规则只约束本项目的工程行为；
通用编码规范以 `project-coding-standards` skill 为准，两者冲突时以该 skill 的通用规范为准。

## 一、核心架构规则：入口由 feature 自己设计

外壳（`src/shell/`）只负责三件事：网格布局、功能切换、返回导航。
**每个 feature 自己设计自己在「定制功能」网格中的入口展现形式**，外壳通过 `entry` 组件
把入口原样渲染进网格，不规定卡片结构、图标、标题排版或点击区域。

- 禁止在外壳中为入口新增统一的卡片模板、默认图标或字段（如 `titleKey`、`descriptionKey`、`icon`）。
- 入口的点击区域、可访问性（`button` / 焦点样式）由 feature 自行实现，外壳只传入 `open`。
- 功能页头部标题也由 feature 页面自行渲染，外壳只保留返回按钮。

## 二、feature 契约

定义位置：`src/shell/registry.ts` 的 `FeatureDefinition`，模板见 `src/features/demo/`。

| 字段 | 类型 | 说明 |
|------|------|------|
| `id` | `string` | 唯一标识，同时作为语言 key 前缀与渲染 key，重复时只保留第一个 |
| `entry` | `ComponentType<FeatureEntryProps>` | 网格入口组件，外观完全由 feature 决定 |
| `page` | `ComponentType<FeaturePageProps>` | 功能页面组件，在外壳内渲染，自带标题 |
| `order` | `number` 可选 | 网格排序权重，越小越靠前，默认 100，相同权重保持注册顺序 |
| `locales` | `LocaleDictionaries` | 本功能中英文文案，外壳统一加 `<id>.` 前缀后注册 |

组件 props：

- `FeatureEntryProps { t, open }`：`t` 已绑定本 feature 的前缀，`open()` 打开功能页面。
- `FeaturePageProps { t }`：`t` 已绑定本 feature 的前缀，页面直接用短 key（如 `title`）。

契约校验：缺少 `id` / `entry` / `page` / `locales` 或 id 重复的定义会被注册表跳过，
单个 feature 出错不得影响整页渲染。新增必需字段时必须同步更新 `isFeatureDefinition`。

## 三、新增 feature 的标准步骤

1. 复制 `src/features/demo/` 为 `src/features/<id>/`。
2. 修改 `index.tsx` 的 `id`（与文件夹名一致），并按需重写 `entry.tsx`、`page.tsx`、`locales.ts`。
3. 在 `src/features/index.ts` 的 `featureList` 中追加该文件夹的默认导出。
4. 执行 `npm run build`，刷新 Harness 页面确认入口与页面正常。

不得为接入新功能修改外壳的网格渲染逻辑、`CustomFeaturesPage.tsx` 或 `entry.tsx` 以外的公共层；
确需新增公共能力时，先按第四节落位。

## 四、目录与分层

| 目录 | 职责 |
|------|------|
| `src/shell/` | 外壳：feature 契约、注册表、网格页面 |
| `src/features/<id>/` | 单个功能：`index.tsx` 装配、`entry.tsx` 入口、`page.tsx` 页面、`locales.ts` 文案 |
| `src/components/` | 被多个 feature 复用的 UI 组件（PascalCase 文件名） |
| `src/common/` | 被多个 feature 复用的纯逻辑与工具（kebab-case 文件名） |
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

## 六、命名与代码规范

- 组件/页面文件用 PascalCase（`entry.tsx` 中的组件名如 `DemoEntry`），目录与工具文件用 kebab-case。
- 变量/函数 camelCase，类型/接口 PascalCase，常量 UPPER_SNAKE_CASE。
- 注释解释「为什么」，i18n key 所在元素上方必须注释业务含义；功能变更同步更新注释。
- 每个 `try` 必须有 `catch` 并输出日志，禁止空 catch 与吞错误。
- 修改文件前评估有效代码行：组件软阈值 400 / 硬阈值 600，公共工具 150 / 250。
  超阈值须按规范做拆分评估，结论必须给出「物理行数 / 有效代码行」两个数字。
- 死代码零残留：任务结束前清除未使用的变量、函数、导入与注释掉的旧代码。

## 七、构建与验证

- 源码与构建脚本均为 TypeScript；`npm run typecheck` 执行 `tsc --noEmit`（strict）。
- `npm run build` 先类型检查，再由 `build.ts` 生成 Tailwind 样式并产出根目录的 `index.js`、`client.js`。
- `index.js`、`client.js`、`.build/` 是产物，禁止手改；改 `src/` 或构建脚本后必须重新构建。
- React 由宿主模块表提供，不随插件打包；新增运行时依赖前先确认宿主是否已提供。
- 任何代码改动完成后：先构建通过，再按项目约定确认验证方式，最后提交。

## 八、文档同步

以下内容变化时，必须在同一次修改中同步更新文档：

| 变化 | 需更新 |
|------|--------|
| feature 契约字段、注册流程 | `README.md`、本文件 |
| 目录结构、公共层落位 | `README.md`、本文件 |
| 构建命令、产物 | `README.md`、本文件 |
| 插件标题/描述 | `locale/zh.json`、`locale/en.json` |
