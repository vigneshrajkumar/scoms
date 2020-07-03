package main

import (
	"encoding/json"
	"log"
	"os"

	"github.com/streadway/amqp"
)

// Email represents an email to be sent
type Email struct {
	Recepient string
	Message   string
}

func main() {
	log.Println("email worker running")

	connectionString := os.Getenv("RMQ_CXN")
	if connectionString == "" {
		connectionString = "amqp://guest:guest@localhost:5672/"
	}
	log.Println("connecting rabbitmq at", connectionString)

	conn, err := amqp.Dial(connectionString)
	if err != nil {
		log.Fatal(err)
	}
	defer conn.Close()

	ch, err := conn.Channel()
	if err != nil {
		log.Fatal(err)
	}
	defer ch.Close()

	// Durable queue of name email
	queue, err := ch.QueueDeclare("email", true, false, false, false, nil)
	if err != nil {
		log.Fatal(err)
	}

	messages, err := ch.Consume(queue.Name, "", false, false, false, false, nil)
	if err != nil {
		log.Fatal(err)
	}

	forever := make(chan bool)

	go func() {
		for d := range messages {
			var em Email
			if err := json.Unmarshal(d.Body, &em); err != nil {
				log.Println("courrupt mesage:", d.Body)
				continue
			}
			log.Println("emailing '" + em.Recepient + "' with content '" + em.Message + "'")
			if err := d.Ack(false); err != nil {
				log.Fatal(err)
			}
		}
	}()

	log.Println("email worker listening for messages")
	<-forever
}
