FROM node

RUN set -x \
  && echo "Installing system dependencies..." \
  && apt-get update \
  && apt-get install -y netcat

WORKDIR /root
ADD . /root

RUN set -x \
  && echo "Setting up system..." \
  && chmod +x /root/entrypoint.sh \
  && echo "Installing npm dependencies..." \
  && npm install

ENV MONGODB_URI "mongodb://localhost:27017"
ENV RABBITMQ_URI "amqp://guest:guest@localhost:5673"
ENV API_URI "http://localhost:8080"

ENTRYPOINT [ "/root/entrypoint.sh" ]
CMD [ "npm", "start" ]
