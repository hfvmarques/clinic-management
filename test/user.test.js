const request = require('supertest');

const app = require('../src/app');

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
      expect(res.body).toHaveLength(1);
    }));

it('must list user prop', () =>
  request(app)
    .get('/users')
    .then((res) => {
      expect(res.body[0]).toHaveProperty('name', 'John Doe');
    }));

it('must create a user', () =>
  request(app)
    .post('/users')
    .send({ name: 'Walter White', email: 'walter@white.com' })
    .then((res) => {
      expect(res.status).toBe(201);
      expect(res.body.name).toBe('Walter White');
    }));
