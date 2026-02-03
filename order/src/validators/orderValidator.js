const { object, number } = require('yup');

const orderSchema = object({
    quantity: number().positive().required()
});

module.exports = { orderSchema };