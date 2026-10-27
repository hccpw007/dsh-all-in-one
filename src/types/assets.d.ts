/**
 * 构建期由 esbuild 的 text loader 处理 CSS，导入值即样式表原文；
 * 这里为 tsc 声明相同的模块形态。
 */
declare module '*.css' {
  const cssText: string
  export default cssText
}

/** 构建期由 esbuild 的 text loader 处理 SVG，导入值即 SVG 原文。 */
declare module '*.svg' {
  const svgText: string
  export default svgText
}
