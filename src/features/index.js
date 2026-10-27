import demo from './demo/index.jsx'

/**
 * 所有已注册的 feature。
 *
 * 新增功能：
 *   1. 复制 src/features/demo/ 为 src/features/<id>/
 *   2. 改其中的 id、title、description 与页面内容
 *   3. 在下面的数组里追加该文件夹的默认导出
 *   4. 运行 npm run build 并刷新页面，卡片即出现在「定制功能」网格中
 */
export const featureList = [demo]
