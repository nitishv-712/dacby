#!/bin/bash

trap 'kill 0' EXIT

echo "Starting backend..."
cd "$(dirname "$0")/server" && npm run dev &

echo "Starting frontend..."
cd "$(dirname "$0")" && npm run dev &

wait
