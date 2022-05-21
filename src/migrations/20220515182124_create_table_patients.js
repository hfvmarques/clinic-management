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
    table.dateTime('birthDate').notNullable();
    table.enum('gender', ['F', 'M', 'O']);
    table.timestamps(true, true);
  });

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = (knex) => knex.schema.dropTable('patients');
