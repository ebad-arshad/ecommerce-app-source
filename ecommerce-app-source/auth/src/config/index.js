require("dotenv").config();

module.exports = {
    pgHost: process.env.POSTGRES_HOST,
    pgUser: process.env.POSTGRES_USER,
    pgPassword: process.env.POSTGRES_PASSWORD,
    pgDatabase: process.env.POSTGRES_DB,
    jwtSecret: process.env.JWT_SECRET || "secret",
    port: process.env.PORT || 5001
};