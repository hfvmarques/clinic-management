/* eslint-disable function-paren-newline */
const request = require('supertest');
const app = require('../../src/app');

const MAIN_ROUTE = '/patients';

const buildEmail = () => `${Date.now()}@email.com`;
const date = new Date('1952-01-21').toISOString();
const name = 'Olivia Vera';
const gender = 'F';

const buildCpf = () =>
  Math.floor(Math.random() * (99999999999 - 10000000000 + 1)) + 10000000000;

// eslint-disable-next-line no-unused-vars
let user;

// beforeAll(async () => {
//   const email = `${Date.now()}@email.com`;
//   const res = await app.services.user.create({
//     name: 'User Account',
//     email,
//     password: '123456',
//   });
//   user = { ...res[0] };
// });

it('must create a patient successfully', () =>
  request(app)
    .post(MAIN_ROUTE)
    .send({
      cpf: buildCpf(),
      name,
      email: buildEmail(),
      birthDate: date,
      gender,
    })
    .then((result) => {
      expect(result.status).toBe(201);
      expect(result.body.name).toBe('Olivia Vera');
    }));

it('must list all patients', () =>
  app
    .db('patients')
    .insert({
      cpf: buildCpf(),
      name,
      email: buildEmail(),
      birthDate: date,
      gender,
    })
    .then(() => request(app).get(MAIN_ROUTE))
    .then((res) => {
      expect(res.status).toBe(200);
      expect(res.body.length).toBeGreaterThan(0);
    }));

it('must list a patient per id', () =>
  app
    .db('patients')
    .insert(
      {
        cpf: buildCpf(),
        name,
        email: buildEmail(),
        birthDate: date,
        gender,
      },
      ['id']
    )
    .then((patient) => request(app).get(`${MAIN_ROUTE}/${patient[0].id}`))
    .then((res) => {
      expect(res.status).toBe(200);
    }));

it('must update a patient', () =>
  app
    .db('patients')
    .insert(
      {
        cpf: buildCpf(),
        name: 'Olivia Vera',
        email: buildEmail(),
        birthDate: date,
        gender,
      },
      ['id']
    )
    .then((patient) =>
      request(app)
        .put(`${MAIN_ROUTE}/${patient[0].id}`)
        .send({ name: 'Rafaella Nascimento' })
    )
    .then((res) => {
      expect(res.status).toBe(200);
      expect(res.body.name).toBe('Rafaella Nascimento');
    }));

it('must remove a patient', () =>
  app
    .db('patients')
    .insert(
      {
        cpf: buildCpf(),
        name,
        email: buildEmail(),
        birthDate: date,
        gender,
      },
      ['id']
    )
    .then((patient) => request(app).delete(`${MAIN_ROUTE}/${patient[0].id}`))
    .then((res) => {
      expect(res.status).toBe(204);
    }));
