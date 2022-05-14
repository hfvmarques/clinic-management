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
