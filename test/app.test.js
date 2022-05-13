const request = require('supertest');

const app = require('../src/app');

it('must respond in root', () =>
  request(app)
    .get('/')
    .then((res) => {
      expect(res.status).toBe(200);
    }));
