#!/bin/bash

# Start the FinFlow backend stack locally: the Node (TypeScript) microservices,
# the Python (FastAPI) ML services, and the nginx API gateway.
#
# Run this from the backend root (code/backend), which is where it lives.
# Node services are siblings here; the Python ML services live in ../ml-services.

set -u

echo "Starting FinFlow Backend Services ..."

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ML_DIR="$(cd "$ROOT_DIR/../ml-services" 2>/dev/null && pwd || echo "")"
LOG_DIR="$ROOT_DIR/logs"
RUN_DIR="$ROOT_DIR/run"
mkdir -p "$LOG_DIR" "$RUN_DIR"

# --- Local port map -----------------------------------------------------------
# The nginx gateway owns 8000 because that is what the web and mobile clients
# target (VITE_API_BASE_URL=http://localhost:8000/api). In Docker the gateway
# listens on 80 and credit-engine listens on 8000, but locally they would
# collide, so credit-engine is moved to CREDIT_ENGINE_PORT (8009) and the
# rendered gateway config points at that port. Everything else uses the same
# ports the services and the gateway already agree on.
GATEWAY_PORT="${GATEWAY_PORT:-8000}"
CREDIT_ENGINE_PORT="${CREDIT_ENGINE_PORT:-8009}"

# Service table: "name|runtime|port|dir". Order matters; the gateway starts last.
declare -a SERVICES=(
    "auth-service|node|4000|$ROOT_DIR/auth-service"
    "payments-service|node|4002|$ROOT_DIR/payments-service"
    "accounting-service|node|4003|$ROOT_DIR/accounting-service"
    "analytics-service|node|4004|$ROOT_DIR/analytics-service"
    "credit-engine|python|$CREDIT_ENGINE_PORT|$ML_DIR/credit-engine"
    "transaction-service|python|8001|$ML_DIR/transaction-service"
    "ai-features-service|python|8002|$ML_DIR/ai-features-service"
    "compliance-service|python|8003|$ML_DIR/compliance-service"
)

# --- Shared environment defaults ---------------------------------------------
# Provided so the stack runs without a .env; anything already exported wins.
export NODE_ENV="${NODE_ENV:-development}"
export JWT_SECRET="${JWT_SECRET:-finflow-local-dev-secret-change-me}"
export JWT_REFRESH_SECRET="${JWT_REFRESH_SECRET:-finflow-local-dev-refresh-change-me}"
mkdir -p /tmp/finflow-data
export DATABASE_URL="${DATABASE_URL:-sqlite:////tmp/finflow-data/finflow.db}"
export PYTHONUNBUFFERED=1

check_port() {
    local port=$1
    if command -v lsof >/dev/null 2>&1; then
        if lsof -Pi ":$port" -sTCP:LISTEN -t >/dev/null 2>&1; then
            echo -e "${RED}Port $port is already in use${NC}"
            return 1
        fi
    fi
    return 0
}

# Launch one service. Node services run via ts-node-dev (no build step); Python
# services run via uvicorn. Each runs in a subshell so the caller's working
# directory is never changed (a bare "cd" in the original NexaFi script caused
# every later directory check to run from the wrong place). The PID is written
# to a file because $! from a subshell is not visible to the parent.
start_service() {
    local name=$1 runtime=$2 port=$3 dir=$4
    echo -e "${YELLOW}Starting $name ($runtime) on port $port...${NC}"

    if ! check_port "$port"; then
        echo -e "${RED}Cannot start $name - port $port is in use${NC}"
        return 1
    fi

    (
        cd "$dir" || exit 1
        export PORT="$port" SERVICE_NAME="$name" SERVICE_PORT="$port"
        if [ "$runtime" = "node" ]; then
            if [ ! -d node_modules ]; then
                echo "node_modules missing in $dir - run: npm install" >&2
            fi
            if [ -f dist/server.js ]; then
                nohup node dist/server.js > "$LOG_DIR/${name}.log" 2>&1 &
            else
                nohup npm run start:dev > "$LOG_DIR/${name}.log" 2>&1 &
            fi
        else
            # Resolve the ML services' shared imports.
            export PYTHONPATH="${PYTHONPATH:-}:$dir"
            nohup python3 -m uvicorn src.main:app --host 0.0.0.0 --port "$port" \
                > "$LOG_DIR/${name}.log" 2>&1 &
        fi
        echo $! > "$RUN_DIR/${name}.pid"
    )

    sleep 2
    local pid
    pid="$(cat "$RUN_DIR/${name}.pid" 2>/dev/null)"
    if [ -n "$pid" ] && kill -0 "$pid" 2>/dev/null; then
        echo -e "${GREEN}$name started (PID: $pid)${NC}"
        return 0
    fi
    echo -e "${RED}Failed to start $name${NC}"
    echo -e "${RED}--- last lines of logs/${name}.log ---${NC}"
    tail -n 15 "$LOG_DIR/${name}.log" 2>/dev/null
    return 1
}

# Poll the service's /health endpoint until it responds.
wait_for_service() {
    local name=$1 port=$2 max=30 attempt=1
    echo "Waiting for $name to be ready..."
    while [ "$attempt" -le "$max" ]; do
        if curl -s "http://localhost:$port/health" >/dev/null 2>&1; then
            echo -e "${GREEN}$name is ready${NC}"
            return 0
        fi
        echo "Attempt $attempt/$max - waiting for $name..."
        sleep 2
        attempt=$((attempt + 1))
    done
    echo -e "${RED}$name failed to become ready${NC}"
    echo -e "${RED}--- last lines of logs/${name}.log ---${NC}"
    tail -n 20 "$LOG_DIR/${name}.log" 2>/dev/null
    return 1
}

# Render a localhost gateway config from nginx.conf. The committed config uses
# Docker service hostnames (e.g. auth-service:4000) that do not resolve on the
# host, so every "server <name>:<port>" upstream is rewritten to 127.0.0.1, the
# credit upstream is pointed at CREDIT_ENGINE_PORT, and "listen" is set to
# GATEWAY_PORT.
render_gateway_config() {
    local src="$ROOT_DIR/nginx.conf" out="$RUN_DIR/nginx.local.conf"
    [ -f "$src" ] || { echo -e "${YELLOW}nginx.conf not found, skipping gateway render${NC}"; return 1; }
    sed -E \
        -e 's/server[[:space:]]+credit-engine:[0-9]+;/server 127.0.0.1:'"$CREDIT_ENGINE_PORT"';/' \
        -e 's/server[[:space:]]+([a-z0-9-]+):([0-9]+);/server 127.0.0.1:\2;/' \
        -e 's/listen[[:space:]]+[0-9]+;/listen '"$GATEWAY_PORT"';/' \
        "$src" > "$out"
    echo "$out"
}

# --- Start the microservices --------------------------------------------------
failed_services=()
for entry in "${SERVICES[@]}"; do
    IFS='|' read -r name runtime port dir <<< "$entry"
    if [ -z "$dir" ] || [ ! -d "$dir" ]; then
        echo -e "${YELLOW}Warning: directory for $name not found, skipping${NC}"
        continue
    fi
    if start_service "$name" "$runtime" "$port" "$dir"; then
        if ! wait_for_service "$name" "$port"; then
            failed_services+=("$name")
        fi
    else
        failed_services+=("$name")
    fi
done

# --- Start the nginx API gateway (optional) ----------------------------------
if command -v nginx >/dev/null 2>&1; then
    conf="$(render_gateway_config)"
    if [ -n "$conf" ] && ! check_port "$GATEWAY_PORT"; then
        echo -e "${RED}Cannot start gateway - port $GATEWAY_PORT is in use${NC}"
        failed_services+=("api-gateway")
    elif [ -n "$conf" ]; then
        echo -e "${YELLOW}Starting nginx gateway on port $GATEWAY_PORT...${NC}"
        nohup nginx -c "$conf" -g "daemon off; pid $RUN_DIR/nginx.pid;" \
            > "$LOG_DIR/api-gateway.log" 2>&1 &
        echo $! > "$RUN_DIR/api-gateway.pid"
        if ! wait_for_service "api-gateway" "$GATEWAY_PORT"; then
            failed_services+=("api-gateway")
        fi
    fi
else
    echo -e "${YELLOW}Warning: nginx not found. The microservices are up on their"
    echo -e "individual ports, but the unified gateway on $GATEWAY_PORT is not running."
    echo -e "Install nginx, or run the gateway via docker compose, to use /api routing.${NC}"
fi

# --- Summary ------------------------------------------------------------------
echo ""
echo "=== FinFlow Backend Startup Summary ==="
if [ ${#failed_services[@]} -eq 0 ]; then
    echo -e "${GREEN}All services started successfully!${NC}"
    echo ""
    echo "Gateway (clients target this): http://localhost:$GATEWAY_PORT"
    echo "  /api/auth   -> auth-service        :4000"
    echo "  /api/payments -> payments-service  :4002"
    echo "  /api/accounting -> accounting-svc  :4003"
    echo "  /api/analytics -> analytics-service:4004"
    echo "  /api/credit -> credit-engine       :$CREDIT_ENGINE_PORT"
    echo "  /api/transactions -> transaction   :8001"
    echo "  /api/ai     -> ai-features-service :8002"
    echo "  /api/compliance -> compliance      :8003"
    echo ""
    echo "Health: curl http://localhost:$GATEWAY_PORT/health"
    echo "Logs:   $LOG_DIR/"
    echo "Stop:   ./stop_services.sh"
else
    echo -e "${RED}Some services failed to start or become ready:${NC}"
    for s in "${failed_services[@]}"; do echo -e "  ${RED}- $s${NC}"; done
    echo ""
    echo "Check the logs in $LOG_DIR/ for details."
    exit 1
fi
