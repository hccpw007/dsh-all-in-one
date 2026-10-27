/**
 * 构建脚本：Tailwind 生成样式，esbuild 打包浏览器端模块，
 * 最后包裹成 Harness Client 的 ModuleLoader 产物 client.js。
 */
import { execFileSync } from 'node:child_process'
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

import { build } from 'esbuild'

/** 工程根目录。 */
const ROOT = dirname(fileURLToPath(import.meta.url))
/** 中间产物目录。 */
const BUILD_DIR = join(ROOT, '.build')
/** Tailwind 输出的样式表，会被当作字符串打进 client.js。 */
const STYLE_FILE = join(BUILD_DIR, 'styles.css')

/**
 * 把多行文本整体缩进，便于嵌入 ModuleLoader 的工厂函数。
 * @param {string} text 原始文本
 * @param {number} spaces 缩进空格数
 * @returns {string} 缩进后的文本
 */
function indent(text, spaces) {
  const pad = ' '.repeat(spaces)
  return text
    .split('\n')
    .map((line) => (line === '' ? line : pad + line))
    .join('\n')
}

/** 步骤一：Tailwind 扫描源码，只生成实际用到的类。 */
function buildStyles() {
  execFileSync(
    process.execPath,
    [
      join(ROOT, 'node_modules/tailwindcss/lib/cli.js'),
      '--config',
      join(ROOT, 'tailwind.config.cjs'),
      '--input',
      join(ROOT, 'src/styles/input.css'),
      '--output',
      STYLE_FILE,
      '--minify',
    ],
    { cwd: ROOT, stdio: 'inherit' },
  )
}

/**
 * 步骤二：打包浏览器端入口。
 * React 保持 external，由 ModuleLoader 工厂的 require 参数提供。
 */
async function buildScript() {
  const result = await build({
    entryPoints: [join(ROOT, 'src/entry.tsx')],
    bundle: true,
    write: false,
    format: 'cjs',
    platform: 'neutral',
    target: ['chrome110'],
    jsx: 'transform',
    external: ['react'],
    loader: { '.css': 'text' },
    legalComments: 'none',
    define: { 'process.env.NODE_ENV': '"production"' },
    logLevel: 'warning',
  })

  return result.outputFiles[0].text
}

/**
 * 步骤三：包裹成 ModuleLoader 产物并写出 client.js。
 * @param {string} bundleCode esbuild 输出的模块代码
 */
function writeClient(bundleCode) {
  const manifest = JSON.parse(readFileSync(join(ROOT, 'package.json'), 'utf8'))
  const output = `/* 本文件由 build.mjs 生成，请勿手工修改。 */
window.__ModuleLoader__.load({
  id: ${JSON.stringify(manifest.name)},
  factory(require) {
    const module = { exports: {} };
    const exports = module.exports;
${indent(bundleCode, 4)}
    return module.exports.default || module.exports;
  },
});
`
  writeFileSync(join(ROOT, 'client.js'), output)
}

/** 串起三个步骤，并在失败时给出可诊断的日志。 */
async function main() {
  try {
    mkdirSync(BUILD_DIR, { recursive: true })
    buildStyles()
    const code = await buildScript()
    writeClient(code)
    console.log('[build] 已生成 client.js')
  } catch (error) { // 构建失败必须以非零码退出，避免带着旧产物继续
    console.error('[build] 构建失败:', error)
    process.exitCode = 1
  }
}

await main()
