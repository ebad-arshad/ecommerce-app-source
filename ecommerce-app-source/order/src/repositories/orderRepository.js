const Order = require("../models/order");

class OrderRepository {
  async getAllOrders(userId) {
    return await Order.query()
      .where('created_by', '=', userId);
  }

  async getById(id, userId) {
    return await Order.query()
      .findById(id)
      .where('created_by', '=', userId);
  }

  async createOrder(order) {
    return await Order.query()
      .insertAndFetch(order);
  }

  async updateOrderStatus(id, status) {
    return await Order.query()
      .patchAndFetchById(id, { status });
  }
}

module.exports = OrderRepository;