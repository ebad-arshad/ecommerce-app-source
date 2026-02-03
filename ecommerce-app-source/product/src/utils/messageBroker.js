const amqp = require("amqplib");
const config = require("../config");
const Product = require('../models/product');
const ProductRepository = require("../repositories/productRepository");

class MessageBroker {
  constructor() {
    this.channel = null;
    this.productRepository = new ProductRepository();
  }

  async connect() {
    console.log("Connecting to RabbitMQ...");

    try {
      const connection = await amqp.connect(config.messageBrokerUrl);
      this.channel = await connection.createChannel();
      await this.channel.assertQueue(config.messageBrokerProductQueue);
      await this.channel.assertQueue(config.messageBrokerOrderQueue);
      console.log("RabbitMQ connected");

      await this.consumeMessage(config.messageBrokerProductQueue, async (order) => {
        const trx = await Product.startTransaction();
        try {
          const dbProduct = await this.productRepository.getById(order.product_id);
          if (!dbProduct || dbProduct.stock < order.quantity) {
            this.publishMessage(config.messageBrokerOrderQueue, { productId: order.product_id, success: false });
            return;
          }

          await this.productRepository.updateProduct(order.product_id, {
            stock: dbProduct.stock - order.quantity
          });

          await trx.commit();

          this.publishMessage(config.messageBrokerOrderQueue, { orderId: order.id, success: true });
        }
        catch (err) {
          await trx.rollback();
          throw err;
        }
      })

    } catch (err) {
      console.error("Failed to connect to RabbitMQ:", err.message);
    }
  }

  publishMessage(queue, message) {
    if (!this.channel) {
      console.error("No RabbitMQ channel available.");
      return;
    } ``

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