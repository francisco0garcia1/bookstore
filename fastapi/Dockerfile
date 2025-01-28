FROM python:3.11.6

WORKDIR /code

COPY ./requirements.txt /code/requirements.txt

RUN pip install --no-cache-dir --upgrade -r /code/requirements.txt

COPY . /code

RUN chmod +x entrypoint.sh

ENTRYPOINT ["/code/entrypoint.sh"]









