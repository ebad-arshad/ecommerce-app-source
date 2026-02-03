const ProductService = require("../services/productService");

class ProductController {
    constructor() {
        this.productService = new ProductService();
    }

    async getProducts(_req, res) {
        try {
            const result = await this.productService.getProducts();

            return res.json({ products: result.products });
        }
        catch (err) {
            return res.status(500).json({ message: "Internal Server error" });
        }
    }

    async getProduct(req, res) {
        try {
            const id = req.params.id;
            const result = await this.productService.getProduct(id);

            if (!result.success) {
                return res.status(404).json({ message: "Not found" });
            }

            return res.json({ product: result.product });
        }
        catch (err) {
            return res.status(500).json({ message: "Internal Server error" });
        }
    }

    async createProduct(req, res) {
        try {
            const result = await this.productService.createProduct(req.user, req.body);

            return res.status(201).json({ product: result.dbProduct });
        }
        catch (err) {
            return res.status(500).json({ message: "Internal Server error" });
        }
    }

    async updateProduct(req, res) {
        try {
            const id = req.params.id;
            const result = await this.productService.updateProduct(id, req.user, req.body);

            if (!result.success) {
                return res.status(404).json({ message: "Not Found" });
            }

            return res.json({ product: result.updatedProduct });
        }
        catch (err) {
            return res.status(500).json({ message: "Internal Server error" });
        }
    }

    async deleteProduct(req, res) {
        try {
            const id = req.params.id;
            const result = await this.productService.deleteProduct(id, req.user);

            if (!result.success) {
                return res.status(404).json({ message: "Not Found" });
            }

            return res.status(204).json({ message: "Ok" });
        }
        catch (err) {
            return res.status(500).json({ message: "Internal Server error" });
        }
    }
}

module.exports = ProductController;