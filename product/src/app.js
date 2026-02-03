const express = require("express");
const config = require("./config");
const ProductController = require("./controllers/productController");
const validateMiddleware = require("./middlewares/validateMiddleware");
const { createProductSchema, updateProductSchema } = require("./validators/productValidator");
const getUserMiddleware = require("./middlewares/getUserMiddleware");
const MessageBroker = require("./utils/messageBroker");
const morgan = require('morgan');

class App {
    constructor() {
        this.app = express();
        this.setupMessageBroker();
        this.setMiddlewares();
        this.productController = new ProductController();
        this.setRoutes();
    }

    start() {
        this.server = this.app.listen(config.port, () => console.log(`Product server listening on port ${config.port}`));
    }

    setupMessageBroker() {
        try {
            const messageBroker = new MessageBroker();
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
                service: "product-service"
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
                service: 'product-service',
                uptime: process.uptime(),
                timestamp: Date.now()
            });
        });
        this.app.get("/view", (req, res) => this.productController.getProducts(req, res));
        this.app.get("/view/:id", (req, res) => this.productController.getProduct(req, res));

        this.app.post("/", getUserMiddleware, validateMiddleware(createProductSchema), (req, res) => this.productController.createProduct(req, res));
        this.app.put("/:id", getUserMiddleware, validateMiddleware(updateProductSchema), (req, res) => this.productController.updateProduct(req, res));
        this.app.delete("/:id", getUserMiddleware, (req, res) => this.productController.deleteProduct(req, res));
    }
}

module.exports = App;