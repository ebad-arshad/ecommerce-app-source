const { Model } = require('./model')

class Product extends Model {
    static get tableName() {
        return 'products';
    }
}

module.exports = Product;