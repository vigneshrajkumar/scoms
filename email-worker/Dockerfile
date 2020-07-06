FROM golang:1.14.4-alpine3.12

# directory setup
RUN mkdir -p /fpi/email-worker
COPY . /fpi/email-worker

# app build
WORKDIR /fpi/email-worker
RUN go build -v ./...

ENV RMQ_CXN=amqp://guest:guest@192.168.99.100:5672

CMD [ "./email-worker"]