#!/bin/bash
# Unset system env vars that conflict with .env
unset DB_HOST DB_USER DB_PASSWORD DB_NAME PORT STORAGE_TYPE

# Start PM2
cd "$(dirname "$0")"
pm2 "$@"
