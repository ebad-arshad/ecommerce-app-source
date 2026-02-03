/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function (knex) {
    await knex.schema.createTableIfNotExists('users', table => {
        table.increments('id').primary();
        table.string('username', 20);
        table.string('password');
        table.enum('role', ['seller', 'buyer'], { useNative: true, enumName: 'role_type' });
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function (knex) {
    await knex.schema.dropTableIfExists('users');
};
