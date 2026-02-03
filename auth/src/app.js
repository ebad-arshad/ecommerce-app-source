const express = require("express");
const config = require("./config");
const morgan = require('morgan');
const AuthController = require("./controllers/authController");

class App {
    constructor() {
        this.app = express();
        this.setMiddlewares();
        this.authController = new AuthController();
        this.setRoutes();
    }

    start() {
        this.server = this.app.listen(config.port, () => console.log(`Auth server listening on port ${config.port}`));
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
                service: "auth-service"
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
                service: 'auth-service',
                uptime: process.uptime(),
                timestamp: Date.now()
            });
        });
        this.app.post("/login", (req, res) => this.authController.login(req, res));
        this.app.post("/register", (req, res) => this.authController.register(req, res));
    }
}

module.exports = App;