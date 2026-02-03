const amqp = require("amqplib");
const config = require("../config");
const OrderRepository = require("../repositories/orderRepository");

class MessageBroker {
  constructor() {
    this.channel = null;
    this.orderRepository = new OrderRepository();
  }

  async connect() {
    console.log("Connecting to RabbitMQ...");

    try {
      const connection = await amqp.connect(config.messageBrokerUrl);
      this.channel = await connection.createChannel();
      await this.channel.assertQueue(config.messageBrokerOrderQueue);
      await this.channel.assertQueue(config.messageBrokerProductQueue);
      console.log("RabbitMQ connected");

      await this.consumeMessage(config.messageBrokerOrderQueue, async (order) => {
        const status = order.success ? "active" : "failed";
        await this.orderRepository.updateOrderStatus(order.orderId, status);
      })
    } catch (err) {
      console.error("Failed to connect to RabbitMQ:", err.message);
    }
  }

  publishMessage(queue, message) {
    if (!this.channel) {
      console.error("No RabbitMQ channel available.");
      return;
    }

    try {
      this.channel.sendToQueue(
        queue,
        Buffer.from(JSON.stringify(message))
      );
    } catch (err) {
      console.log(err);
    }
  }

  async consumeMessage(queue, callback) {
    if (!this.channel) {
      console.error("No RabbitMQ channel available.");
      return;
    }

    try {
      await this.channel.consume(queue, (message) => {
        const content = message.content.toString();
        const parsedContent = JSON.parse(content);
        callback(parsedContent);
        this.channel.ack(message);
      });
    } catch (err) {
      console.log(err);
    }
  }
}

module.exports = MessageBroker;