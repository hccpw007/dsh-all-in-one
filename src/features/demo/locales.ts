import type { FeatureLocales } from '../../shell/registry'

/** 示例功能的中英文文案；key 由外壳统一加 `demo.` 前缀，功能内无需处理命名空间。 */
export const demoLocales: FeatureLocales = {
  zh: {
    // 网格卡片标题
    title: '示例功能',
    // 网格卡片描述
    description: '演示独立文件夹的结构、注册方式与页面渲染。',
    // 页面区块标题：说明功能页是独立渲染的
    sectionTitle: '独立的功能页面',
    // 页面区块说明：功能只需关心自己的内容
    sectionDescription:
      '每个功能都有自己的文件夹和页面组件。外壳只负责网格、导航和样式，页面只需关心自己的内容。',
    // 计数按钮文案，后接点击次数
    counterLabel: '点击计数',
    // 页面区块标题：新增功能的操作步骤
    stepsTitle: '新增一个功能',
    // 步骤一：复制示例文件夹
    step1: '复制 src/features/demo/ 为 src/features/<id>/',
    // 步骤二：修改功能定义与页面
    step2: '修改 id，并在 entry、page、locales 中写入本功能的内容',
    // 步骤三：在 featureList 中登记
    step3: '在 src/features/index.ts 的 featureList 里追加该文件夹的默认导出',
    // 步骤四：构建并刷新页面
    step4: '运行 npm run build 并刷新页面，卡片自动出现在网格中',
  },
  en: {
    // Grid card title
    title: 'Demo feature',
    // Grid card description
    description: 'Shows the folder structure, registration and page rendering of a feature.',
    // Section heading explaining that the page renders inside the shell
    sectionTitle: 'Standalone feature page',
    // Section text explaining that features only own their content
    sectionDescription:
      'Each feature owns its folder and page component. The shell handles the grid, navigation and styling; the page only cares about its own content.',
    // Counter button label, followed by the click count
    counterLabel: 'Clicks',
    // Section heading listing the steps to add a feature
    stepsTitle: 'Add a new feature',
    // Step one: copy the demo folder
    step1: 'Copy src/features/demo/ to src/features/<id>/',
    // Step two: edit the feature definition and page
    step2: 'Change id, then write the feature content in entry, page and locales',
    // Step three: register in featureList
    step3: 'Append the folder default export to featureList in src/features/index.ts',
    // Step four: build and refresh
    step4: 'Run npm run build and refresh; the card appears in the grid',
  },
}
