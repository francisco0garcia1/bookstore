FROM python:3.11.6-slim

WORKDIR /code

COPY . /code

COPY ./requirements.txt /code/requirements.txt

RUN pip install --no-cache-dir --upgrade -r /code/requirements.txt

RUN alembic upgrade head

CMD ["fastapi", "run", "api/main.py", "--port", "8000"]










