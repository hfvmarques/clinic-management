const request = require('supertest');
const jwt = require('jwt-simple');
const app = require('../../src/app');

const MAIN_ROUTE = '/api/patients';

const buildEmail = () => `${Date.now()}@email.com`;
const date = new Date('1999-02-23').toISOString();
const name = 'Bento Gabriel Costa';
const gender = 'M';

const buildCpf = () =>
  Math.floor(Math.random() * (99999999999 - 10000000000 + 1)) + 10000000000;

const buildPhone = () =>
  Math.floor(Math.random() * (99999999999 - 10000000000 + 1)) + 10000000000;

let user;
let patient;
let otherPatient;

beforeAll(async () => {
  const email = buildEmail();
  const userRes = await app.services.user.create({
    name: 'User Account',
    email,
    password: '123456',
  });
  user = { ...userRes[0] };
  user.token = jwt.encode(user, 'Secret!');
  delete user.password;

  const patientRes = await app.services.patient.create({
    cpf: buildCpf(),
    name,
    email: buildEmail(),
    birthDate: date,
    gender,
  });
  patient = { ...patientRes[0] };

  const otherPatientRes = await app.services.patient.create({
    cpf: buildCpf(),
    name,
    email: buildEmail(),
    birthDate: date,
    gender,
  });
  otherPatient = { ...otherPatientRes[0] };
});

it('must create a patient phone successfully', () =>
  request(app)
    .post(`${MAIN_ROUTE}/${patient.id}/phones`)
    .send({
      patientId: patient.id,
      countryCode: '55',
      phone: buildPhone(),
      primary: false,
    })
    .set('authorization', `Bearer ${user.token}`)
    .then((result) => {
      expect(result.status).toBe(201);
      expect(result.body.patientId).toBe(patient.id);
    }));

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
        .get(`${MAIN_ROUTE}/${otherPatient.id}/phones`)
        .set('authorization', `Bearer ${user.token}`)
    )
    .then((res) => {
      expect(res.status).toBe(200);
      expect(res.body.length).toBe(1);
    }));
