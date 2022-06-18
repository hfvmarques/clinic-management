const request = require('supertest');
const app = require('../../src/app');

const MAIN_ROUTE = '/auth';
const SIGNIN_ROUTE = `${MAIN_ROUTE}/signin`;
const SIGNUP_ROUTE = `${MAIN_ROUTE}/signup`;

const buildEmail = () => `${Date.now()}@email.com`;
const name = 'Walter White';

describe('when creating a user via signUp', () => {
  const createUser = () =>
    request(app).post(SIGNUP_ROUTE).send({
      name,
      email: buildEmail(),
      password: '123456',
    });

  it('must have status 201', () =>
    createUser().then((res) => expect(res.status).toBe(201)));

  it('must have specific name', () =>
    createUser().then((res) => expect(res.body.name).toBe('Walter White')));

  it('must have email property', () =>
    createUser().then((res) => expect(res.body).toHaveProperty('email')));

  it('must not have password property', () =>
    createUser().then((res) =>
      expect(res.body).not.toHaveProperty('password')
    ));
});

it('must return a token at login', () => {
  const email = buildEmail();

  return app.services.user
    .create({
      name,
      email,
      password: '123456',
    })
    .then(() =>
      request(app).post(SIGNIN_ROUTE).send({
        email,
        password: '123456',
      })
    )
    .then((res) => {
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('token');
    });
});

it('must not return a token with wrong password', () => {
  const email = buildEmail();

  return app.services.user
    .create({
      name,
      email,
      password: '123456',
    })
    .then(() =>
      request(app).post(SIGNIN_ROUTE).send({
        email,
        password: '654321',
      })
    )
    .then((res) => {
      expect(res.status).toBe(400);
      expect(res.body.error).toBe('Invalid email or password.');
    });
});

it('must not return a token with wrong password', () =>
  request(app)
    .post(SIGNIN_ROUTE)
    .send({
      email: 'invalid@email.com',
      password: '123456',
    })
    .then((res) => {
      expect(res.status).toBe(400);
      expect(res.body.error).toBe('Invalid email or password.');
    }));

it('must not access protected route without a token', () =>
  request(app)
    .get('/api/users')
    .then((res) => {
      expect(res.status).toBe(401);
    }));
