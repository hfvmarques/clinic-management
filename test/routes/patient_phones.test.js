const request = require('supertest');
const jwt = require('jwt-simple');
const app = require('../../src/app');

const MAIN_ROUTE = '/api/patients';

const buildEmail = () => `${Date.now()}@email.com`;
const date = new Date('1999-02-23').toISOString();
const name = 'Bento Gabriel Costa';
const password = '$2b$10$PcM8ybKXPN1RnivB8rxuQ.GmbF1xA7/CDPSl1gkUNKPsyVVMVwapW';
const gender = 'M';

const buildCpf = () =>
  Math.floor(Math.random() * (99999999999 - 10000000000 + 1)) + 10000000000;

const buildPhone = () =>
  Math.floor(Math.random() * (99999999999 - 10000000000 + 1)) + 10000000000;

let user;
let patient;
let otherPatient;

beforeAll(async () => {
  await app.db('patient_phones').del();
  await app.db('patients').del();
  await app.db('users').del();

  const createdUser = await app.db('users').insert(
    {
      name: 'User Account',
      email: buildEmail(),
      password,
    },
    '*'
  );

  [user] = createdUser;
  delete user.password;
  user.token = jwt.encode(user, 'Secret!');

  const patients = await app.db('patients').insert(
    [
      {
        cpf: buildCpf(),
        name,
        email: 'patientEmail@email.com',
        birthDate: date,
        gender,
      },
      {
        cpf: buildCpf(),
        name,
        email: 'otherPatientEmail@email.com',
        birthDate: date,
        gender,
      },
    ],
    '*'
  );

  [patient, otherPatient] = patients;
});

it('must list only the patient phones', () =>
  app
    .db('patient_phones')
    .insert([
      {
        patientId: patient.id,
        countryCode: '55',
        phone: buildPhone(),
        primary: true,
      },
      {
        patientId: otherPatient.id,
        countryCode: '55',
        phone: buildPhone(),
        primary: true,
      },
    ])
    .then(() =>
      request(app)
        .get(`${MAIN_ROUTE}/${patient.id}/phones`)
        .set('authorization', `Bearer ${user.token}`)
    )
    .then((res) => {
      expect(res.status).toBe(200);
      expect(res.body.length).toBe(1);
    }));
