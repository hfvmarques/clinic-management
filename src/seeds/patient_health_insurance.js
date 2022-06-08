/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = (knex) => {
  // Deletes ALL existing entries
  return knex('patient_health_insurances')
    .del()
    .then(() => knex('health_insurances').del())
    .then(() => knex('patient_addresses').del())
    .then(() => knex('patient_phones').del())
    .then(() => knex('patients').del())
    .then(() => knex('users').del())
    .then(() =>
      knex('users').insert([
        {
          id: -1,
          name: 'User Account',
          email: 'user_account@email.com',
          password:
            '$2b$10$3ml18pHVQtxGAhHkwUUroORcsyGc3cYAQ3D0qOO2aY47T/pzMSrga',
        },
      ])
    )
    .then(() =>
      knex('patients').insert([
        {
          id: -1,
          cpf: '12345678910',
          name: 'Patient 1',
          email: 'patient1@email.com',
          birthDate: new Date('1952-01-21').toISOString(),
          gender: 'M',
        },
        {
          id: -2,
          cpf: '12345678911',
          name: 'Patient 2',
          email: 'patient2@email.com',
          birthDate: new Date('1952-01-21').toISOString(),
          gender: 'F',
        },
      ])
    )
    .then(() =>
      knex('patient_phones').insert([
        {
          id: -1,
          patientId: -1,
          countryCode: '55',
          phone: '10987654321',
          primary: true,
        },
        {
          id: -2,
          patientId: -2,
          countryCode: '55',
          phone: '10987654321',
          primary: true,
        },
      ])
    )
    .then(() =>
      knex('patient_addresses').insert([
        {
          id: -1,
          patientId: -1,
          street: 'Alameda Sergio Manesque',
          number: '891',
          complement: 'Apto 13',
          district: 'Jaderlândia',
          zipCode: '68746427',
          city: 'Castanhal',
          state: 'PA',
          primary: true,
        },
        {
          id: -2,
          patientId: -2,
          street: 'Alameda Sergio Manesque',
          number: '891',
          complement: 'Apto 13',
          district: 'Jaderlândia',
          zipCode: '68746427',
          city: 'Castanhal',
          state: 'PA',
          primary: true,
        },
      ])
    )
    .then(() =>
      knex('health_insurances').insert([
        {
          id: -1,
          name: 'Health Insurance',
          ansRecord: 123456,
          accepted: true,
        },
      ])
    )
    .then(() =>
      knex('patient_health_insurances').insert([
        {
          id: -1,
          patientId: -1,
          healthInsuranceId: -1,
          cardNumber: '654321',
          primary: true,
        },
        {
          id: -2,
          patientId: -2,
          healthInsuranceId: -1,
          cardNumber: '123456',
          primary: true,
        },
      ])
    );
};
