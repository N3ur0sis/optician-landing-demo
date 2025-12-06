#!/usr/bin/env bash
set -euo pipefail

COMPOSE_BIN=${COMPOSE_BIN:-"docker compose"}
DEFAULT_IMAGE="registry.example.com/optician-landing:latest"
IMAGE=${IMAGE:-$DEFAULT_IMAGE}
PORT=${PORT:-3000}

usage() {
  cat <<'EOF'
Usage: scripts/manage.sh [command]

Commands:
  up|start     Pull (if available) and start the stack
  down|stop    Stop and remove the stack
  restart      Restart the stack with latest image
  pull         Pull the image without starting
  logs         Follow container logs
  ps|status    Show container status
EOF
}

cmd=${1:-}
case "$cmd" in
  up|start)
    IMAGE="$IMAGE" PORT="$PORT" ${COMPOSE_BIN} up -d --pull always
    ;;
  down|stop)
    ${COMPOSE_BIN} down
    ;;
  restart)
    IMAGE="$IMAGE" PORT="$PORT" ${COMPOSE_BIN} down
    IMAGE="$IMAGE" PORT="$PORT" ${COMPOSE_BIN} up -d --pull always
    ;;
  pull)
    IMAGE="$IMAGE" ${COMPOSE_BIN} pull web
    ;;
  logs)
    ${COMPOSE_BIN} logs -f web
    ;;
  ps|status)
    ${COMPOSE_BIN} ps
    ;;
  *)
    usage
    exit 1
    ;;
esac
