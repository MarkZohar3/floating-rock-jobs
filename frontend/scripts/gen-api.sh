#!/usr/bin/env bash
set -euo pipefail

LIVE_OPENAPI_URL="${OPENAPI_URL:-http://localhost:3001/api/openapi.json}"
LOCAL_OPENAPI_FILE="./openapi.local.json"

if curl -fsS "$LIVE_OPENAPI_URL" >/dev/null; then
  echo "Using live OpenAPI spec: $LIVE_OPENAPI_URL"
  OPENAPI_URL="$LIVE_OPENAPI_URL" orval --config ./orval.config.ts
else
  echo "Live OpenAPI unavailable at $LIVE_OPENAPI_URL"
  echo "Falling back to local spec: $LOCAL_OPENAPI_FILE"
  OPENAPI_URL="$LOCAL_OPENAPI_FILE" orval --config ./orval.config.ts
fi
