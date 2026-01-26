#!/bin/bash

# Port cleanup script for ft-quoting
# Usage: ./scripts/kill_port.sh [port]

PORT=${1:-3000}

echo "Ensuring port $PORT is free..."

# Find PIDs using the port
PIDS=$(lsof -ti :$PORT)

if [ -z "$PIDS" ]; then
    echo "Port $PORT is already clear."
else
    echo "Killing processes on port $PORT: $PIDS"
    echo $PIDS | xargs kill -9
    echo "Port $PORT cleared."
fi
