FROM ubuntu:16.04

STOPSIGNAL SIGINT

WORKDIR /fibos
COPY package.json package.json

RUN apt-get update -y \
  && apt-get install -y curl \
  && apt-get install -y sudo \
  && apt-get install -y openssl \
  && curl -s https://fibos.io/download/installer.sh | sh \
  && fibos --install fibos.js

CMD ["fibos", "/fibos/start.js"]

EXPOSE 9870 8870
