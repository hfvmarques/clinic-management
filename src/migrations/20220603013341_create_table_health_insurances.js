/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = (knex) =>
  knex.schema.createTable('health_insurances', (table) => {
    table.increments('id').primary();
    table.string('name').notNullable();
    table.integer('ansRecord').notNullable().unique();
    table.boolean('accepted').notNullable().defaultTo(true);
    table.timestamps(true, true);
  });

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = (knex) => knex.schema.dropTable('health_insurances');
