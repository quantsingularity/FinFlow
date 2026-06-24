#!/bin/bash

# Stop the FinFlow backend stack started by start_services.sh.

set -u

echo "Stopping FinFlow Backend Services..."

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
LOG_DIR="$ROOT_DIR/logs"
RUN_DIR="$ROOT_DIR/run"

stop_service() {
    local name=$1
    local pid_file="$RUN_DIR/${name}.pid"

    if [ ! -f "$pid_file" ]; then
        echo -e "${YELLOW}No PID file for $name${NC}"
        return
    fi
    local pid
    pid="$(cat "$pid_file" 2>/dev/null)"
    if [ -n "$pid" ] && kill -0 "$pid" 2>/dev/null; then
        echo -e "${YELLOW}Stopping $name (PID: $pid)...${NC}"
        kill "$pid" 2>/dev/null || true
        local attempts=0
        while kill -0 "$pid" 2>/dev/null && [ "$attempts" -lt 10 ]; do
            sleep 1
            attempts=$((attempts + 1))
        done
        if kill -0 "$pid" 2>/dev/null; then
            echo -e "${RED}Force killing $name...${NC}"
            kill -9 "$pid" 2>/dev/null || true
        fi
        echo -e "${GREEN}$name stopped${NC}"
    else
        echo -e "${YELLOW}$name was not running${NC}"
    fi
    rm -f "$pid_file"
}

# Stop every service this stack can start (gateway first), so nothing is left
# behind. The original NexaFi stop script omitted several started services and
# relied on a pkill pattern that did not match the actual process names; this
# list is complete and the cleanup pattern below matches the real commands.
declare -a STOP_ORDER=(
    "api-gateway"
    "compliance-service"
    "ai-features-service"
    "transaction-service"
    "credit-engine"
    "analytics-service"
    "accounting-service"
    "payments-service"
    "auth-service"
)

for name in "${STOP_ORDER[@]}"; do
    stop_service "$name"
done

# Best-effort sweep for any stragglers matching how the services are launched.
echo "Checking for any remaining FinFlow processes..."
pkill -f "uvicorn src.main:app" 2>/dev/null || true
pkill -f "ts-node-dev.*src/server.ts" 2>/dev/null || true

echo -e "${GREEN}All FinFlow services stopped${NC}"

if [ "${1:-}" = "--clean-logs" ]; then
    echo "Cleaning up logs and run files..."
    rm -f "$LOG_DIR"/*.log "$RUN_DIR"/*.pid "$RUN_DIR"/nginx.local.conf 2>/dev/null || true
    echo -e "${GREEN}Logs cleaned${NC}"
fi
