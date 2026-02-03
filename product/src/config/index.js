require("dotenv").config();

module.exports = {
    pgHost: process.env.POSTGRES_HOST,
    pgUser: process.env.POSTGRES_USER,
    pgPassword: process.env.POSTGRES_PASSWORD,
    pgDatabase: process.env.POSTGRES_DB,
    messageBrokerUrl: process.env.RABBITMQ_URL,
    messageBrokerProductQueue: process.env.RABBITMQ_PRODUCT_QUEUE,
    messageBrokerOrderQueue: process.env.RABBITMQ_ORDER_QUEUE,
    port: process.env.PORT || 5002
};