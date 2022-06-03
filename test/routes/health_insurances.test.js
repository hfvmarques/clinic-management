const request = require('supertest');
const jwt = require('jwt-simple');
const app = require('../../src/app');
const health_insurance = require('../../src/services/health_insurance');

const MAIN_ROUTE = '/api/health_insurances';
const name = 'Health Insurance';

const buildAnsRecord = () =>
  Math.floor(Math.random() * (999999 - 100000 + 1)) + 100000;

let user;

beforeAll(async () => {
  const res = await app.services.user.create({
    name: 'User Account',
    email: `${Date.now()}@email.com`,
    password: '123456',
  });
  user = { ...res[0] };
  user.token = jwt.encode(user, 'Secret!');
  delete user.password;
});

it('must create a health insurance successfully', () =>
  request(app)
    .post(MAIN_ROUTE)
    .send({
      name,
      ansRecord: buildAnsRecord(),
      accepted: true,
    })
    .set('authorization', `Bearer ${user.token}`)
    .then((res) => {
      expect(res.status).toBe(201);
      expect(res.body.name).toBe('Health Insurance');
    }));

it('must create a health insurance without accepted selection', () =>
  request(app)
    .post(MAIN_ROUTE)
    .send({
      name,
      ansRecord: buildAnsRecord(),
    })
    .set('authorization', `Bearer ${user.token}`)
    .then((res) => {
      expect(res.status).toBe(201);
      expect(res.body.accepted).toBe(true);
    }));

it('must list all health_insurances', () =>
  request(app)
    .get(MAIN_ROUTE)
    .set('authorization', `Bearer ${user.token}`)
    .then((res) => {
      expect(res.status).toBe(200);
      expect(res.body.length).toBeGreaterThan(0);
    }));

it('must list a health insurance per id', () =>
  app
    .db('health_insurances')
    .insert(
      {
        name,
        ansRecord: buildAnsRecord(),
        accepted: true,
      },
      ['id']
    )
    .then((health_insurance) =>
      request(app)
        .get(`${MAIN_ROUTE}/${health_insurance[0].id}`)
        .set('authorization', `Bearer ${user.token}`)
    )
    .then((res) => {
      expect(res.status).toBe(200);
    }));

it('must update a health_insurance', () =>
  app
    .db('health_insurances')
    .insert(
      {
        name,
        ansRecord: buildAnsRecord(),
        accepted: true,
      },
      ['id']
    )
    .then((health_insurance) =>
      request(app)
        .put(`${MAIN_ROUTE}/${health_insurance[0].id}`)
        .send({ name: 'Updated Name' })
        .set('authorization', `Bearer ${user.token}`)
    )
    .then((res) => {
      expect(res.status).toBe(200);
      expect(res.body.name).toBe('Updated Name');
    }));

it('must remove a health_insurance', () =>
  app
    .db('health_insurances')
    .insert(
      {
        name,
        ansRecord: buildAnsRecord(),
        accepted: true,
      },
      ['id']
    )
    .then((health_insurance) =>
      request(app)
        .delete(`${MAIN_ROUTE}/${health_insurance[0].id}`)
        .set('authorization', `Bearer ${user.token}`)
    )
    .then((res) => {
      expect(res.status).toBe(204);
    }));

describe('when creating a health insurance', () => {
  let validHealthInsurance;

  beforeAll(() => {
    validHealthInsurance = {
      name,
      ansRecord: buildAnsRecord(),
      accepted: true,
    };
  });

  const invalidCreationTemplate = (invalidData, validationErrorMessage) =>
    request(app)
      .post(MAIN_ROUTE)
      .send({ ...validHealthInsurance, ...invalidData })
      .set('authorization', `Bearer ${user.token}`)
      .then((res) => {
        expect(res.status).toBe(400);
        expect(res.body.error).toBe(validationErrorMessage);
      });

  it('must not create without a name', () =>
    invalidCreationTemplate({ name: undefined }, 'Name is required.'));

  it('must not create without an ansRecord', () =>
    invalidCreationTemplate(
      { ansRecord: undefined },
      'ANS record is required.'
    ));
});

it('must not create a health insurance with duplicated ANS record', () => {
  const duplicatedAnsRecord = '123456';

  return request(app)
    .post(MAIN_ROUTE)
    .send({
      name,
      ansRecord: duplicatedAnsRecord,
      accepted: true,
    })
    .set('authorization', `Bearer ${user.token}`)
    .then(
      request(app)
        .post(MAIN_ROUTE)
        .send({
          name,
          ansRecord: duplicatedAnsRecord,
          accepted: true,
        })
        .set('authorization', `Bearer ${user.token}`)
        .then((res) => {
          expect(res.status).toBe(400);
          expect(res.body.error).toBe('ANS record already registered.');
        })
    );
});
