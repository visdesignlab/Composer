#!/usr/bin/env bash
set -e

BASE_DIR=`pwd`
BASE_NAME=${BASE_DIR##*/}
PREFIX=${BASE_NAME//_/}

function backup_one {
  docker run -v ${PREFIX}_$1:/data:ro -v `pwd`/_backup:/backup --name data-restore ubuntu \
   /bin/sh -c "cd /data && tar -czf /backup/$1.tar.gz *" && docker rm data-restore
}

function restore_one {
  docker run -v ${PREFIX}_$1:/data -v `pwd`/_backup:/backup --name data-backup ubuntu \
    /bin/sh -c "cd /data rm -rf * && tar xfz /backup/$1.tar.gz" && docker rm data-backup
}

function backup {
  for volume in `docker volume ls -q -f name=${PREFIX}_*`; do
    local name=${volume//${PREFIX}_/}
	echo "backing up ${name}"
	backup_one ${name}
  done
}

function restore {
  for file in _backup/*.tar.gz ; do
	local volume=${file##*/}
    name=${volume%%.*}
	echo "restoring ${name}"
	restore_one ${name}
  done
}

#command switch
case "$1" in
backup)
  shift
  if [ "$#" -ne 1 ]; then
    backup
  else
    backup_one $1
  fi
  ;;
restore)
  shift
  if [ "$#" -ne 1 ]; then
    restore
  else
    restore_one $1
  fi;;
esac

