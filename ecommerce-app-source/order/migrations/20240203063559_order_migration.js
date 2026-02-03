/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function (knex) {
  await knex.schema.createTableIfNotExists('orders', table => {
    table.increments('id').primary();
    table.integer('product_id').notNullable();
    table.bigInteger('quantity').notNullable();
    table.enum('status', ['pending', 'active', 'failed', 'delivered'], { useNative: true, enumName: 'status_type' }).notNullable();
    table.integer('created_by').notNullable();
    table.dateTime('created_at').notNullable().defaultTo(knex.raw('CURRENT_TIMESTAMP'));
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function (knex) {
  await knex.schema.dropTableIfExists('orders');
};
