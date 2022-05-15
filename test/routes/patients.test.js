const request = require('supertest');
const app = require('../../src/app');

const MAIN_ROUTE = '/patients';

// eslint-disable-next-line no-unused-vars
let user;

beforeAll(async () => {
  const res = await app.services.user.create({
    name: 'User Account',
    email: `${Date.now()}@email.com`,
    password: '123456',
  });
  user = { ...res[0] };
});

it('must create a patient successfully', () =>
  request(app)
    .post(MAIN_ROUTE)
    .send({
      cpf: '44076206410',
      name: 'Olivia Vera Renata Nascimento',
      email: 'olivia.vera.nascimento@facilitycom.com.br',
      birthDate: new Date('1952-01-21').toISOString(),
      gender: 'F',
    })
    .then((result) => {
      expect(result.status).toBe(201);
      expect(result.body.name).toBe('Olivia Vera Renata Nascimento');
    }));
