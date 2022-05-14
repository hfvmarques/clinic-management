const request = require('supertest');

const app = require('../../src/app');

it('must have status 200', () =>
  request(app)
    .get('/users')
    .then((res) => {
      expect(res.status).toBe(200);
    }));

it('must list one user', () =>
  request(app)
    .get('/users')
    .then((res) => {
      expect(res.body.length).toBeGreaterThan(0);
    }));

it('must list user prop', () =>
  request(app)
    .get('/users')
    .then((res) => {
      expect(res.body[0]).toHaveProperty('name');
      expect(res.body[0]).toHaveProperty('email');
      expect(res.body[0]).toHaveProperty('password');
    }));

it('must create a user', () => {
  const email = `${Date.now()}@email.com`;

  return request(app)
    .post('/users')
    .send({
      name: 'Walter White',
      email,
      password: '123456',
    })
    .then((res) => {
      expect(res.status).toBe(201);
      expect(res.body.name).toBe('Walter White');
    });
});

it('must not create a user without a name', () => {
  const email = `${Date.now()}@email.com`;

  return request(app)
    .post('/users')
    .send({
      email,
      password: '123456',
    })
    .then((res) => {
      expect(res.status).toBe(400);
      expect(res.body.error).toBe('Name is required.');
    });
});

it('must not create a user without an email', async () => {
  const result = await request(app).post('/users').send({
    name: 'Walter White',
    password: '123456',
  });
  expect(result.status).toBe(400);
  expect(result.body.error).toBe('Email is required.');
});

it('must not create a user without a password', (done) => {
  const email = `${Date.now()}@email.com`;

  request(app)
    .post('/users')
    .send({
      name: 'Walter White',
      email,
    })
    .then((res) => {
      expect(res.status).toBe(400);
      expect(res.body.error).toBe('Password is required.');
      done();
    });
});

it('must not create a user with an existing email', () => {
  const email = 'walter@white.com';

  return request(app)
    .post('/users')
    .send({
      name: 'Walter White',
      email,
      password: '123456',
    })
    .then(
      request(app)
        .post('/users')
        .send({
          name: 'Walter White',
          email,
          password: '123456',
        })
        .then((res) => {
          expect(res.status).toBe(400);
          expect(res.body.error).toBe('Email already exists.');
        })
    );
});
