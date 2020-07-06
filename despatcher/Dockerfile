FROM node:14.5.0

# directory setup
RUN mkdir -p /fpi/despatcher
COPY . /fpi/despatcher

# UI setup
WORKDIR /fpi/despatcher/client
RUN npm install && npm run build

# server setup
WORKDIR /fpi/despatcher
RUN npm install

ENV PORT=80
ENV RMQ_CXN=amqp://guest:guest@192.168.99.100:5672
ENV MDB_CXN=mongodb://scomsmongo:0000

EXPOSE 80

CMD [ "npm", "start" ]
