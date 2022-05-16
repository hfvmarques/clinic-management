/* eslint-disable function-paren-newline */
const request = require('supertest');
const app = require('../../src/app');

const MAIN_ROUTE = '/patients';

function createRandomCpf() {
  return (
    Math.floor(Math.random() * (99999999999 - 10000000000 + 1)) + 10000000000
  ).toString();
}

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

it('must create a patient successfully', () => {
  const email = `${Date.now()}@email.com`;
  const date = new Date('1952-01-21').toISOString();

  return request(app)
    .post(MAIN_ROUTE)
    .send({
      cpf: createRandomCpf(),
      name: 'Olivia Vera Renata Nascimento',
      email,
      birthDate: date,
      gender: 'F',
    })
    .then((result) => {
      expect(result.status).toBe(201);
      expect(result.body.name).toBe('Olivia Vera Renata Nascimento');
    });
});

it('must list all patients', () => {
  const email = `${Date.now()}@email.com`;
  const date = new Date('1952-01-21').toISOString();

  return app
    .db('patients')
    .insert({
      cpf: createRandomCpf(),
      name: 'Olivia Vera Renata Nascimento',
      email,
      birthDate: date,
      gender: 'F',
    })
    .then(() => request(app).get(MAIN_ROUTE))
    .then((res) => {
      expect(res.status).toBe(200);
      expect(res.body.length).toBeGreaterThan(0);
    });
});

it('must list a patient per id', () => {
  const email = `${Date.now()}@email.com`;
  const date = new Date('1952-01-21').toISOString();

  return app
    .db('patients')
    .insert(
      {
        cpf: createRandomCpf(),
        name: 'Olivia Vera Renata Nascimento',
        email,
        birthDate: date,
        gender: 'F',
      },
      ['id']
    )
    .then((patient) => request(app).get(`${MAIN_ROUTE}/${patient[0].id}`))
    .then((res) => {
      expect(res.status).toBe(200);
    });
});

it('must update a patient', () => {
  const email = `${Date.now()}@email.com`;
  const date = new Date('1952-01-21').toISOString();

  return app
    .db('patients')
    .insert(
      {
        cpf: createRandomCpf(),
        name: 'Olivia Vera',
        email,
        birthDate: date,
        gender: 'F',
      },
      ['id']
    )
    .then((patient) =>
      request(app)
        .put(`${MAIN_ROUTE}/${patient[0].id}`)
        .send({ name: 'Renata Nascimento' })
    )
    .then((res) => {
      expect(res.status).toBe(200);
      expect(res.body.name).toBe('Renata Nascimento');
    });
});

it('must remove a patient', () => {
  const email = `${Date.now()}@email.com`;
  const date = new Date('1952-01-21').toISOString();

  return app
    .db('patients')
    .insert(
      {
        cpf: createRandomCpf(),
        name: 'Olivia Vera',
        email,
        birthDate: date,
        gender: 'F',
      },
      ['id']
    )
    .then((patient) => request(app).delete(`${MAIN_ROUTE}/${patient[0].id}`))
    .then((res) => {
      expect(res.status).toBe(204);
    });
});
