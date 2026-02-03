/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function (knex) {
  return knex.schema.alterTable('orders', function (table) {
    table.index('created_by', 'idx_created_by');
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function (knex) {
  return knex.schema.alterTable('orders', function (table) {
    table.dropIndex('created_by', 'idx_created_by');
  });
};
