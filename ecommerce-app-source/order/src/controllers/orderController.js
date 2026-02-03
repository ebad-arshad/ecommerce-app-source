const OrderService = require("../services/orderService");

class OrderController {
  constructor() {
    this.orderService = new OrderService();
  }

  async getOrders(req, res) {
    try {
      const result = await this.orderService.getOrders(req.user);

      return res.json({ orders: result.orders });
    }
    catch (err) {
      return res.status(500).json({ message: "Internal Server error" });
    }
  }

  async getOrder(req, res) {
    try {
      const id = req.params.id;
      const result = await this.orderService.getOrder(id, req.user);

      if (!result.success) {
        return res.status(404).json({ message: "Not found" });
      }

      return res.json({ product: result.product });
    }
    catch (err) {
      return res.status(500).json({ message: "Internal Server error" });
    }
  }

  async createOrder(req, res) {
    try {
      const productId = req.params.productId;
      const product = await this.orderService.getProduct(productId);
      if (product.stock < req.body.quantity) {
        return res.status(400).json({ message: "Out of stock" });
      }

      const result = await this.orderService.createOrder(productId, req.user, req.body);

      return res.status(201).json({ product: result.dbProduct });
    }
    catch (err) {
      if (err?.response?.status === 404) {
        return res.status(404).json({ message: "Product Not Found" });
      }
      return res.status(500).json({ message: "Internal Server error" });
    }
  }
}

module.exports = OrderController;