/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = (knex) =>
  knex.schema.createTable('patient_phones', (table) => {
    table.increments('id').primary();
    table
      .integer('patientId')
      .references('id')
      .inTable('patients')
      .notNullable();
    table.string('countryCode').notNullable().defaultTo('55');
    table.string('phone').notNullable();
    table.boolean('primary').notNullable().defaultTo(false);
    table.timestamps(true, true);
  });

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = (knex) => knex.schema.dropTable('patient_phones');
