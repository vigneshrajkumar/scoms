package main

import (
	"encoding/json"
	"log"
	"os"
	"time"

	"github.com/streadway/amqp"
	"gopkg.in/matryer/try.v1"
)

// Email represents an email to be sent
type Email struct {
	Recepient string
	Message   string
}

func main() {
	log.SetPrefix("email-wkr ")
	log.SetFlags(log.Lshortfile | log.LstdFlags)
	log.Println("email worker running")

	connectionString := os.Getenv("RMQ_CXN")
	if connectionString == "" {
		log.Println("RMQ Connection unset. Stopping worker now..")
		os.Exit(1)
	}
	log.Println("connecting rabbitmq at", connectionString)

	var ampqConnection *amqp.Connection
	var err error
	err = try.Do(func(attempt int) (bool, error) {
		ampqConnection, err = amqp.Dial(connectionString)
		if err != nil {
			log.Println(err)
			log.Println("could not connect to rmq @ " + connectionString + " retrying...")
			time.Sleep(5 * time.Second)
		}
		return attempt < 5, err
	})
	if err != nil {
		log.Fatalln("unable to connect to RMQ in multiple retries:", err)
	}

	// conn, err := amqp.Dial(connectionString)
	// if err != nil {
	// 	log.Fatal(err)
	// }
	// defer conn.Close()
	defer ampqConnection.Close()

	ch, err := ampqConnection.Channel()
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
