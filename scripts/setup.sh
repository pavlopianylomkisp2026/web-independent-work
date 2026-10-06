#!/bin/sh
set -eu
cd "$(dirname "$0")/.."
npm ci --cache /workspace/.npm-cache
sh scripts/init-env.sh
docker compose up -d db wordpress
attempt=0
until curl --fail --silent --output /dev/null http://127.0.0.1:8080/wp-admin/install.php; do
  attempt=$((attempt + 1))
  if [ "$attempt" -ge 60 ]; then
    echo 'WordPress did not become ready; inspect docker compose logs.' >&2
    exit 1
  fi
  sleep 1
done
docker compose run --rm cli
npm run build
npm run typecheck
