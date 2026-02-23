#!/usr/bin/env bash
set -euo pipefail

PORT="${PORT:-3010}"

while [[ $# -gt 0 ]]; do
  case "$1" in
    -p|--port)
      if [[ $# -lt 2 ]]; then
        echo "Missing value for $1"
        exit 1
      fi
      PORT="$2"
      shift 2
      ;;
    *)
      shift
      ;;
  esac
done

# Stop anything currently listening on the target port.
PIDS="$(lsof -tiTCP:"${PORT}" -sTCP:LISTEN || true)"
if [ -n "${PIDS}" ]; then
  echo "Port ${PORT} is in use. Stopping existing process(es): ${PIDS}"
  echo "${PIDS}" | xargs kill -15 2>/dev/null || true
  sleep 1
fi

# If any process ignored SIGTERM, force stop it.
PIDS="$(lsof -tiTCP:"${PORT}" -sTCP:LISTEN || true)"
if [ -n "${PIDS}" ]; then
  echo "Force stopping process(es) on port ${PORT}: ${PIDS}"
  echo "${PIDS}" | xargs kill -9 2>/dev/null || true
  sleep 1
fi

echo "Starting Next.js on http://localhost:${PORT}"
exec next dev -p "${PORT}"
