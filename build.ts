/**
 * 构建脚本：Tailwind 生成样式，esbuild 打包宿主侧与浏览器端入口。
 *
 * 宿主按 package.json 的 exports 直接加载根目录的 index.js（必须是 JS），
 * 因此宿主侧源码写在 src/index.ts，由这里产出同名产物，与 client.js 一起入库。
 * 用 tsx 执行本脚本，无需额外的编译步骤。
 */
import { execFileSync } from 'node:child_process'
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

import { build, type BuildResult } from 'esbuild'

/** 工程根目录。 */
const ROOT = dirname(fileURLToPath(import.meta.url))
/** 中间产物目录。 */
const BUILD_DIR = join(ROOT, '.build')
/** Tailwind 输出的样式表，会被当作字符串打进 client.js。 */
const STYLE_FILE = join(BUILD_DIR, 'styles.css')

/**
 * 把多行文本整体缩进，便于嵌入 ModuleLoader 的工厂函数。
 * @param text 原始文本
 * @param spaces 缩进空格数
 * @returns 缩进后的文本
 */
function indent(text: string, spaces: number): string {
  const pad = ' '.repeat(spaces)
  return text
    .split('\n')
    .map((line) => (line === '' ? line : pad + line))
    .join('\n')
}

/**
 * 取出 esbuild 的输出文本。
 * @param result esbuild 构建结果（write: false 时使用其中内存产物）
 * @returns 首个输出文件的文本
 */
function firstOutputText(result: BuildResult): string {
  const output = result.outputFiles?.[0]
  if (!output) throw new Error('esbuild 未返回输出文件')

  return output.text
}

/** 步骤一：Tailwind 扫描源码，只生成实际用到的类。 */
function buildStyles(): void {
  execFileSync(
    process.execPath,
    [
      join(ROOT, 'node_modules/tailwindcss/lib/cli.js'),
      '--config',
      join(ROOT, 'tailwind.config.ts'),
      '--input',
      join(ROOT, 'src/styles/input.css'),
      '--output',
      STYLE_FILE,
      '--minify',
    ],
    { cwd: ROOT, stdio: 'inherit' },
  )
}

/** 步骤二：打包宿主侧入口，产出根目录的 index.js。 */
async function buildHostEntry(): Promise<void> {
  const result = await build({
    entryPoints: [join(ROOT, 'src/index.ts')],
    bundle: true,
    write: false,
    format: 'esm',
    platform: 'node',
    target: ['node20'],
    legalComments: 'none',
    logLevel: 'warning',
  })

  writeFileSync(join(ROOT, 'index.js'), firstOutputText(result))
}

/**
 * 步骤三：打包浏览器端入口。
 * React 保持 external，由 ModuleLoader 工厂的 require 参数提供。
 */
async function buildScript(): Promise<string> {
  const result = await build({
    entryPoints: [join(ROOT, 'src/entry.tsx')],
    bundle: true,
    write: false,
    format: 'cjs',
    platform: 'neutral',
    target: ['chrome110'],
    jsx: 'transform',
    external: ['react'],
    loader: { '.css': 'text', '.svg': 'text' },
    legalComments: 'none',
    define: { 'process.env.NODE_ENV': '"production"' },
    logLevel: 'warning',
  })

  return firstOutputText(result)
}

/**
 * 步骤四：包裹成 ModuleLoader 产物并写出 client.js。
 * @param bundleCode esbuild 输出的模块代码
 */
function writeClient(bundleCode: string): void {
  // package.json 由本仓库维护，name 字段必然存在，这里只需收窄形状
  const manifest = JSON.parse(readFileSync(join(ROOT, 'package.json'), 'utf8')) as { name: string }
  const output = `/* 本文件由 build.ts 生成，请勿手工修改。 */
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

/** 串起四个步骤，并在失败时给出可诊断的日志。 */
async function main(): Promise<void> {
  try {
    mkdirSync(BUILD_DIR, { recursive: true })
    buildStyles()
    await buildHostEntry()
    const code = await buildScript()
    writeClient(code)
    console.log('[build] 已生成 index.js 与 client.js')
  } catch (error) { // 构建失败必须以非零码退出，避免带着旧产物继续
    console.error('[build] 构建失败:', error)
    process.exitCode = 1
  }
}

await main()
