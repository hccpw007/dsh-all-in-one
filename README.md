# dsh-all-in-one

DeepSeek Harness 的 all-in-one 插件：在「设置 → 定制功能」中用一个网格收纳各种独立小工具。
外壳只负责网格、导航与样式，每个功能在自己的文件夹里独立实现。

## 目录结构

```
├── index.js                 # 宿主侧插件（本插件无宿主能力，保持空实现）
├── client.js                # 浏览器端产物，由 build.mjs 生成，请勿手改
├── cordis.patch.yml         # bundle 声明，安装时插入插件行
├── locale/{zh,en}.json      # 插件标题与描述
├── src/
│   ├── entry.jsx            # 注册 settings.section，注入样式与文案
│   ├── styles/input.css     # Tailwind 入口
│   ├── shell/               # 外壳：功能注册表 + 网格页面
│   └── features/
│       ├── index.js         # featureList：登记所有功能
│       └── demo/            # 示例功能，可作为模板复制
└── build.mjs                # 构建脚本
```

## 新增一个功能

1. 复制 `src/features/demo/` 为 `src/features/<id>/`
2. 修改其中的 `id`、`title`、`description`、`page`
3. 在 `src/features/index.js` 的 `featureList` 里追加该文件夹的默认导出
4. 运行 `npm run build`，刷新 Harness 页面，卡片即出现在网格中

`feature` 定义的字段契约见 `src/shell/registry.js`。

## 开发与构建

```bash
npm install      # 首次安装构建依赖
npm run build    # 产出 client.js（内含 Tailwind 生成的样式）
```

样式在构建期由 Tailwind 生成，颜色全部映射到宿主的 `--dsw-alias-*` 主题令牌，
因此页面会跟随宿主自动切换明暗主题，不写入字面色值。

## 技术栈

- React（由宿主模块表提供，不随插件打包）
- Tailwind CSS 3（构建期生成，preflight 关闭以免影响宿主样式）
