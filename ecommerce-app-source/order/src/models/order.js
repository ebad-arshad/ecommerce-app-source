const { Model } = require('./model')

class Order extends Model {
    static get tableName() {
        return 'orders';
    }
}

module.exports = Order;