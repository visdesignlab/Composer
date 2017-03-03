@echo off

shift
echo docker-compose run --service-ports api %*
docker-compose run --service-ports api %*
