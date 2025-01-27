#!/bin/sh

set_environment() {
  filename=$1
  # Read env file and add its content to environment
  export $(cat $filename | xargs)

  echo ' ----- ENVIRONMENT ----- '
  cat $filename
  echo -e $"\n ----------------------- "
}

if [ -e ".env" ]; then
  set_environment ".env"  
elif [ -e "docker.env" ]; then
  set_environment "docker.env"  
fi

export DATABASE_URI="postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@${POSTGRES_SERVER}/${POSTGRES_DB}"

alembic upgrade head

cd ./api
fastapi run main.py

