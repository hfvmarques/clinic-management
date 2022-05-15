/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = (knex) =>
  knex.schema.createTable('patients', (table) => {
    table.increments('id').primary();
    table.string('cpf').notNullable().unique();
    table.string('name').notNullable();
    table.string('email').notNullable().unique();
    table.date('birthDate').notNullable();
    table.string('gender').notNullable();
    table.timestamps(true, true);
  });

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = (knex) => knex.schema.dropTable('patients');
