const config = require("./src/config");

/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */
module.exports = {
  development: {
    client: 'pg',
    connection: {
      host: config.pgHost,
      user: config.pgUser,
      password: config.pgPassword,
      database: config.pgDatabase,
    },
    pool: {
      max: 10,
      idleTimeoutMillis: 3000,
    },
    migrations: {
      tableName: 'knex_migrations'
    }
  },
};
