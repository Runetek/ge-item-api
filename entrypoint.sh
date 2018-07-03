#!/usr/bin/env bash

# Parse uri components (https://gist.github.com/u8sand/7f84e9547d74ff39de128a56a2618ec3)
function parse_uri() {
  URI=$1
  FMT=$2
  echo ${URI} | perl -pe "s#(?<proto>[\w\+-]+)://((?<user>[-\w]+):(?<pass>[-\w]+)@)?((?<host>[-\w]+)(:(?<port>\d+))?)#${FMT}#g"
}

# Wait for a specific host:port to be open
function wait_for() {
  URI=$1
  SERVER=$(parse_uri "${URI}" '$+{host}')
  PORT=$(parse_uri "${URI}" '$+{port}')

  echo "Waiting for ${SERVER}:${PORT}..."
  while ! nc -z ${SERVER} ${PORT}; do
    sleep 1;
  done
}

# Expose crawler as an alias for `npm start crawler`
function crawler() {
  npm run crawler $@
}

# Forward environment variables
export API_URI="${API_URI}"
export RABBITMQ_URI="${RABBITMQ_URI}"
export MONGODB_URI="${MONGODB_URI}"

wait_for "${RABBITMQ_URI}"
wait_for "${MONGODB_URI}"
$@
