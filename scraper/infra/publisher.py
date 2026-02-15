import json
import os

import pika
from dotenv import load_dotenv

load_dotenv()

USER = os.environ["RABBITMQ_USER"]
PASSWORD = os.environ["RABBITMQ_PASS"]
HOST = os.environ.get("RABBITMQ_HOST", "localhost")
PORT = int(os.environ.get("RABBITMQ_PORT", 5672))


def publish_message(queue_name, message_body):
    connection = pika.BlockingConnection(
        pika.ConnectionParameters(
            host=HOST,
            port=PORT,
            credentials=pika.PlainCredentials(USER, PASSWORD),
        )
    )
    channel = connection.channel()

    channel.queue_declare(queue=queue_name, durable=True)
    channel.basic_publish(
        exchange="",
        routing_key=queue_name,
        body=json.dumps(message_body),
        properties=pika.BasicProperties(delivery_mode=2),
    )

    connection.close()
