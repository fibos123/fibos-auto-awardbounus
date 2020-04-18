FROM mingfunwong/fibos:v1.7.1.11

STOPSIGNAL SIGINT

WORKDIR /fibos
COPY package.json package.json

CMD ["fibos", "/fibos/start.js"]

EXPOSE 9870 8870
