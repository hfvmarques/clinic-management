const request = require('supertest');
const jwt = require('jwt-simple');
const app = require('../../src/app');
// const healthInsurance = require('../../src/services/health_insurance');

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
    .then((insurance) =>
      request(app)
        .get(`${MAIN_ROUTE}/${insurance[0].id}`)
        .set('authorization', `Bearer ${user.token}`)
    )
    .then((res) => {
      expect(res.status).toBe(200);
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
    .then((insurance) =>
      request(app)
        .delete(`${MAIN_ROUTE}/${insurance[0].id}`)
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

  const validCreationTemplate = (validData, attribute, value) =>
    request(app)
      .post(MAIN_ROUTE)
      .send({ ...validHealthInsurance, ...validData })
      .set('authorization', `Bearer ${user.token}`)
      .then((res) => {
        expect(res.status).toBe(201);
        expect(res.body[attribute]).toBe(value);
      });

  const invalidCreationTemplate = (invalidData) =>
    request(app)
      .post(MAIN_ROUTE)
      .send({ ...validHealthInsurance, ...invalidData })
      .set('authorization', `Bearer ${user.token}`);

  it('must create successfully', () =>
    validCreationTemplate(validHealthInsurance));

  it('must not create without a accepted selection', () =>
    invalidCreationTemplate({ accepted: null }).then((res) =>
      expect(res.status).toBe(400)
    ));

  it('must not create without a name', () =>
    invalidCreationTemplate({ name: null }).then((res) =>
      expect(res.status).toBe(400)
    ));

  it('must not create without an ansRecord', () =>
    invalidCreationTemplate({ ansRecord: null }).then((res) =>
      expect(res.status).toBe(400)
    ));

  it('must issue the accepted selection message', () =>
    invalidCreationTemplate({ accepted: null }).then((res) =>
      expect(res.body.error).toBe('Accepted choice is required.')
    ));

  it('must issue the name message', () =>
    invalidCreationTemplate({ name: null }).then((res) =>
      expect(res.body.error).toBe('Name is required.')
    ));

  it('must issue the ansRecord message', () =>
    invalidCreationTemplate({ ansRecord: null }).then((res) =>
      expect(res.body.error).toBe('ANS record is required.')
    ));
});

describe('when updating a health insurance', () => {
  let validHealthInsurance;
  let insurance;

  beforeAll(async () => {
    const insuranceRes = await app.services.health_insurance.create({
      name,
      ansRecord: buildAnsRecord(),
      accepted: true,
    });
    insurance = { ...insuranceRes[0] };

    validHealthInsurance = {
      name,
      ansRecord: buildAnsRecord(),
      accepted: true,
    };
  });

  const validUpdateTemplate = (validData, attribute, value) =>
    request(app)
      .put(`${MAIN_ROUTE}/${insurance.id}`)
      .send({ ...validHealthInsurance, ...validData })
      .set('authorization', `Bearer ${user.token}`)
      .then((res) => {
        expect(res.status).toBe(200);
        expect(res.body[attribute]).toBe(value);
      });

  const invalidUpdateTemplate = (invalidData) =>
    request(app)
      .put(`${MAIN_ROUTE}/${insurance.id}`)
      .send({ ...validHealthInsurance, ...invalidData })
      .set('authorization', `Bearer ${user.token}`);

  it('must update successfully', () =>
    validUpdateTemplate({ name: 'New Name' }, 'name', 'New Name'));

  it('must not update without a accepted selection', () =>
    invalidUpdateTemplate({ accepted: null }).then((res) =>
      expect(res.status).toBe(400)
    ));

  it('must not update without a name', () =>
    invalidUpdateTemplate({ name: null }).then((res) =>
      expect(res.status).toBe(400)
    ));

  it('must not update without an ansRecord', () =>
    invalidUpdateTemplate({ ansRecord: null }).then((res) =>
      expect(res.status).toBe(400)
    ));

  it('must issue the accepted selection message', () =>
    invalidUpdateTemplate({ accepted: null }).then((res) =>
      expect(res.body.error).toBe('Accepted choice is required.')
    ));

  it('must issue the name message', () =>
    invalidUpdateTemplate({ name: null }).then((res) =>
      expect(res.body.error).toBe('Name is required.')
    ));

  it('must issue the ansRecord message', () =>
    invalidUpdateTemplate({ ansRecord: null }).then((res) =>
      expect(res.body.error).toBe('ANS record is required.')
    ));
});

describe('when listing health insurances', () => {
  const getHealthInsurances = () =>
    request(app).get(MAIN_ROUTE).set('authorization', `Bearer ${user.token}`);

  it('must have status 200', () =>
    getHealthInsurances().then((res) => expect(res.status).toBe(200)));

  it('must have at least one result', () =>
    getHealthInsurances().then((res) =>
      expect(res.body.length).toBeGreaterThan(0)
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
