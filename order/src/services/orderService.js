const axios = require('axios');
const OrderRepository = require("../repositories/orderRepository");
const config = require('../config');
const messageBroker = require('../utils/messageBroker');

class OrderService {
  constructor() {
    this.orderRepository = new OrderRepository();
  }

  async getOrders(user) {
    const orders = await this.orderRepository.getAllOrders(user.id);

    return { success: true, orders };
  }

  async getOrder(id, user) {
    const dbOrder = await this.orderRepository.getById(id, user.id);
    if (!dbOrder) {
      return { success: false, message: "Order not found" };
    }

    return { success: true, dbOrder };
  }

  async createOrder(productId, user, order) {
    order = {
      ...order,
      product_id: productId,
      created_by: user.id,
      status: "pending",
    }

    const dbOrder = await this.orderRepository.createOrder(order);

    messageBroker.publishMessage(config.messageBrokerProductQueue, dbOrder);

    return { success: true, dbProduct: dbOrder };
  }

  async getProduct(productId) {
    const response = await axios.request({
      method: 'get',
      url: `${config.productUrl}/view/${productId}`,
    });

    return response.data.product;
  }
}

module.exports = OrderService;