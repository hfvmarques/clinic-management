const request = require('supertest');
const jwt = require('jwt-simple');
const app = require('../../src/app');

const MAIN_ROUTE = '/api/patients';

const buildEmail = () => `${Date.now()}@email.com`;
const date = new Date('1973-06-01').toISOString();
const name = 'Manuela Mariane Assunção';
const gender = 'F';

const buildCpf = () =>
  Math.floor(Math.random() * (99999999999 - 10000000000 + 1)) + 10000000000;

let user;
let patient;
let otherPatient;
let address;

beforeAll(async () => {
  const email = buildEmail();
  const res = await app.services.user.create({
    name: 'User Account',
    email,
    password: '123456',
  });
  user = { ...res[0] };
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

it('must create a patient address successfully', () =>
  request(app)
    .post(`${MAIN_ROUTE}/${patient.id}/addresses`)
    .send({
      patientId: patient.id,
      street: 'Alameda Sergio Manesque',
      number: '891',
      complement: 'Apto 13',
      district: 'Jaderlândia',
      zipCode: '68746427',
      city: 'Castanhal',
      state: 'PA',
      primary: true,
    })
    .set('authorization', `Bearer ${user.token}`)
    .then((res) => {
      expect(res.status).toBe(201);
      expect(res.body.street).toBe('Alameda Sergio Manesque');
    }));

it('must return a patient address', () =>
  request(app)
    .get(`${MAIN_ROUTE}/${patient.id}/addresses`)
    .set('authorization', `Bearer ${user.token}`)
    .then((res) => {
      expect(res.status).toBe(200);
      expect(res.body.length).toBeGreaterThan(0);
    }));
