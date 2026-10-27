/**
 * 构建期由 esbuild 的 text loader 处理 CSS，导入值即样式表原文；
 * 这里为 tsc 声明相同的模块形态。
 */
declare module '*.css' {
  const cssText: string
  export default cssText
}
