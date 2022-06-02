/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = (knex) =>
  knex.schema.createTable('patient_addresses', (table) => {
    table.increments('id').primary();
    table
      .integer('patientId')
      .references('id')
      .inTable('patients')
      .notNullable();
    table.string('street').notNullable();
    table.string('number').notNullable();
    table.string('complement');
    table.string('district').notNullable();
    table.integer('zipCode').notNullable();
    table.string('city').notNullable();
    table.string('state').notNullable();
    table.boolean('primary').notNullable().defaultTo(true);
    table.timestamps(true, true);
  });

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = (knex) => knex.schema.dropTable('patient_addresses');
