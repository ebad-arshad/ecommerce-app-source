const Product = require("../models/product");

class ProductRepository {
    async getAllProducts() {
        return await Product.query();
    }

    async getById(id) {
        return await Product.query()
            .forUpdate()
            .findById(id);
    }

    async createProduct(product) {
        return await Product.query()
            .insert(product)
            .returning('*');
    }

    async updateProduct(id, product) {
        return await Product.query()
            .patchAndFetchById(id, product);
    }

    async deleteProduct(id) {
        await Product.query()
            .deleteById(id);
    }
}

module.exports = ProductRepository;