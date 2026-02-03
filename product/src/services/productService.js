const ProductRepository = require("../repositories/productRepository");

class ProductService {
    constructor() {
        this.productRepository = new ProductRepository();
    }

    async getProducts() {
        const products = await this.productRepository.getAllProducts();

        return { success: true, products };
    }

    async getProduct(id) {
        const dbProduct = await this.productRepository.getById(id);
        if (!dbProduct) {
            return { success: false, message: "Product not found" };
        }

        return { success: true, product: dbProduct };
    }

    async createProduct(user, product) {
        product.created_by = user.id;
        const dbProduct = await this.productRepository.createProduct(product);

        return { success: true, dbProduct };
    }

    async updateProduct(id, user, product) {
        const dbProduct = await this.productRepository.getById(id);
        if (!dbProduct || dbProduct.created_by !== user.id) {
            return { success: false, message: "Product not found" };
        }

        const updatedProduct = await this.productRepository.updateProduct(id, product);
        return { success: true, updatedProduct };
    }

    async deleteProduct(id, user) {
        const dbProduct = await this.productRepository.getById(id);
        if (!dbProduct || dbProduct.created_by !== user.id) {
            return { success: false, message: "Product not found" };
        }

        await this.productRepository.deleteProduct(id);
        return { success: true };
    }
}

module.exports = ProductService;