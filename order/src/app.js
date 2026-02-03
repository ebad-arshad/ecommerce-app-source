const express = require("express");
const config = require("./config");
const validateMiddleware = require("./middlewares/validateMiddleware");
const getUserMiddleware = require("./middlewares/getUserMiddleware");
const OrderController = require("./controllers/orderController");
const { orderSchema } = require("./validators/orderValidator");
const MessageBroker = require("./utils/messageBroker");
const morgan = require('morgan');
const { knex } = require('./models/model');

class App {
    constructor() {
        this.app = express();
        this.setupMessageBroker();
        this.setMiddlewares();
        this.orderController = new OrderController();
        this.setRoutes();
    }

    async start() {
        try {
            console.log("Checking database and running migrations...");
            
            // Run the migrations programmatically
            await knex.migrate.latest();
            
            console.log("Database is up to date ✅");

            // Start listening ONLY after migration succeeds
            this.server = this.app.listen(config.port, () => {
                console.log(`Order server listening on port ${config.port} 🚀`);
            });
        } catch (error) {
            console.error("FATAL: Database migration failed ❌");
            console.error(error);
            process.exit(1);
        }
    }

    setupMessageBroker() {
        try {
            const messageBroker = new MessageBroker();
            // Wrap this so if RabbitMQ is missing, the server still lives
            messageBroker.connect().catch(err => {
                console.error("⚠️ Message Broker failed to connect, but keeping server alive.");
            });
        } catch (error) {
            console.error("Message Broker setup error:", error);
        }
    }

    setMiddlewares() {
        this.app.use(express.json());
        this.app.use(morgan((tokens, req, res) => {
            return JSON.stringify({
                method: tokens.method(req, res),
                url: tokens.url(req, res),
                status: tokens.status(req, res),
                responseTime: tokens.res(req, res, 'content-length'),
                time: tokens['response-time'](req, res) + 'ms',
                service: "order-service"
            });
        }));
    }

    setRoutes() {
        const APP_VERSION = process.env.APP_VERSION || "v1.0.0";
        this.app.get("/healthz", (req, res) => {
            res.status(200).send({
                version: APP_VERSION,
                podName: process.env.HOSTNAME,
                status: 'OK',
                service: 'order-service',
                uptime: process.uptime(),
                timestamp: Date.now()
            });
        });
        
        this.app.use(getUserMiddleware);
        
        this.app.get("/", (req, res) => this.orderController.getOrders(req, res));
        this.app.get("/:id", (req, res) => this.orderController.getOrder(req, res));
        this.app.post("/:productId", validateMiddleware(orderSchema), (req, res) => this.orderController.createOrder(req, res));
    }
}

module.exports = App;