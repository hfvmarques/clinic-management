const jwt = require('jwt-simple');
const request = require('supertest');

const app = require('../../src/app');

const MAIN_ROUTE = '/api/users';

const buildEmail = () => `${Date.now()}@email.com`;
const name = 'Walter White';

let user;

beforeAll(async () => {
  const email = buildEmail();
  const res = await app.services.user.create({
    name: 'User Account',
    email,
    password: '123456',
  });
  user = { ...res[0] };
  user.token = jwt.encode(user, 'Secret!');
});

it('must have status 200', () =>
  request(app)
    .get(MAIN_ROUTE)
    .set('authorization', `Bearer ${user.token}`)
    .then((res) => {
      expect(res.status).toBe(200);
    }));

it('must create a user', () =>
  request(app)
    .post(MAIN_ROUTE)
    .send({
      name,
      email: buildEmail(),
      password: '123456',
    })
    .set('authorization', `Bearer ${user.token}`)
    .then((res) => {
      expect(res.status).toBe(201);
      expect(res.body.name).toBe('Walter White');
    }));

it('must not return user password in body response', () =>
  request(app)
    .post(MAIN_ROUTE)
    .send({
      name,
      email: buildEmail(),
      password: '123456',
    })
    .set('authorization', `Bearer ${user.token}`)
    .then((res) => {
      expect(res.body).not.toHaveProperty('password');
    }));

it('must store crypto password', async () => {
  const res = await request(app)
    .post(MAIN_ROUTE)
    .send({
      name,
      email: buildEmail(),
      password: '123456',
    })
    .set('authorization', `Bearer ${user.token}`);
  expect(res.status).toBe(201);

  const { id } = res.body;

  const userDb = await app.services.user.find({ id });

  expect(userDb.password).not.toBeUndefined();
  expect(userDb.password).not.toBe('123456');
});

it('must list one user', () =>
  request(app)
    .get(MAIN_ROUTE)
    .set('authorization', `Bearer ${user.token}`)
    .then((res) => {
      expect(res.body.length).toBeGreaterThan(0);
    }));

it('must list user prop', () =>
  request(app)
    .get(MAIN_ROUTE)
    .set('authorization', `Bearer ${user.token}`)
    .then((res) => {
      expect(res.body[0]).toHaveProperty('name');
      expect(res.body[0]).toHaveProperty('email');
    }));

describe('when creating a user', () => {
  let validUser;
  beforeAll(() => {
    validUser = {
      name,
      email: buildEmail(),
      password: '123456',
    };
  });

  const invalidCreationTemplate = (invalidData, validationErrorMessage) =>
    request(app)
      .post(MAIN_ROUTE)
      .send({ ...validUser, ...invalidData })
      .set('authorization', `Bearer ${user.token}`)
      .then((res) => {
        expect(res.status).toBe(400);
        expect(res.body.error).toBe(validationErrorMessage);
      });

  it('must not create without a name', () =>
    invalidCreationTemplate({ name: undefined }, 'Name is required.'));

  it('must not create without a email', () =>
    invalidCreationTemplate({ email: undefined }, 'Email is required.'));

  it('must not create without a password', () =>
    invalidCreationTemplate({ password: undefined }, 'Password is required.'));
});

it('must not create a user with an existing email', () => {
  const sameEmail = 'walter@white.com';

  return request(app)
    .post(MAIN_ROUTE)
    .send({
      name,
      email: sameEmail,
      password: '123456',
    })
    .set('authorization', `Bearer ${user.token}`)
    .then(
      request(app)
        .post(MAIN_ROUTE)
        .send({
          name,
          email: sameEmail,
          password: '123456',
        })
        .set('authorization', `Bearer ${user.token}`)
        .then((res) => {
          expect(res.status).toBe(400);
          expect(res.body.error).toBe('Email already exists.');
        })
    );
});
