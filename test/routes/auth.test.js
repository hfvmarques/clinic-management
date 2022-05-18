const request = require('supertest');
const app = require('../../src/app');

const buildEmail = () => `${Date.now()}@email.com`;
const name = 'Walter White';
const email = buildEmail();

it('must return a token at login', () =>
  app.services.user
    .create({
      name,
      email,
      password: '123456',
    })
    .then(() =>
      request(app).post('/auth/signin').send({
        email,
        password: '123456',
      })
    )
    .then((res) => {
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('token');
    }));
