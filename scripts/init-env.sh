#!/bin/sh
set -eu
cd "$(dirname "$0")/.."
if [ ! -f .env ]; then
  umask 077
  node --input-type=module -e 'import {randomBytes} from "node:crypto"; import {writeFileSync} from "node:fs"; const secret=()=>randomBytes(24).toString("hex"); writeFileSync(".env",`DB_PASSWORD=${secret()}\nDB_ROOT_PASSWORD=${secret()}\nWP_ADMIN_PASSWORD=${secret()}\nWORDPRESS_API_URL=http://127.0.0.1:8080/wp-json/wp/v2\n`,{flag:"wx",mode:0o600});'
fi
