#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "$0")/.."

echo "Installing dependencies..."
npm install --workspace=src

echo "Starting dev server..."
npm run dev
