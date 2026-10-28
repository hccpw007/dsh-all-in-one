#!/usr/bin/env bash
# 本地开发入口：一条命令同时起「源码监听构建」与「独立 Web 实例」。
#
# Web 实例退出时（Ctrl+C 或被关闭）一并停掉监听构建，避免残留进程占着端口。
# 额外参数原样传给 dsh，例如 ./dev.sh --no-open 可跳过自动打开浏览器。
set -euo pipefail

ROOT="$(cd "$(dirname "$0")" && pwd)"
PORT="${PORT:-18080}"

cd "$ROOT"

npm run dev &
BUILD_PID=$!
trap 'kill "$BUILD_PID" 2>/dev/null || true' EXIT

# 首次用 token URL 打开后浏览器会持有 30 天有效的 cookie，后续重启直接刷新即可。
dsh --profile dev --port "$PORT" "$@"
