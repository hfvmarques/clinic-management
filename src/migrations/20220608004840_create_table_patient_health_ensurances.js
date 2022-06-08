/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = (knex) =>
  knex.schema.createTable('patient_health_insurances', (table) => {
    table.increments('id').primary();
    table
      .integer('patientId')
      .references('id')
      .inTable('patients')
      .notNullable();
    table
      .integer('healthInsuranceId')
      .references('id')
      .inTable('health_insurances')
      .notNullable();
    table.string('cardNumber').notNullable();
    table.boolean('primary').notNullable().defaultTo(true);
    table.timestamps(true, true);
  });

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = (knex) => knex.schema.dropTable('patient_health_insurances');
