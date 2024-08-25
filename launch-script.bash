!/bin/bash

docker kill lift-archives
docker image rm -f ghcr.io/juliencm-dev/lift-archives:latest
docker system prune -f
docker compose up -d 