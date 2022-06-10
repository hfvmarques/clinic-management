/* eslint-disable function-paren-newline */
const request = require('supertest');
const jwt = require('jwt-simple');
const app = require('../../src/app');

const MAIN_ROUTE = '/api/patients';

const buildEmail = () => `${Date.now()}@email.com`;
const date = new Date('1952-01-21').toISOString();
const name = 'Olivia Vera';
const gender = 'F';

const buildCpf = () =>
  Math.floor(Math.random() * (99999999999 - 10000000000 + 1)) + 10000000000;

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
  delete user.password;
});

it('must create a patient successfully', () =>
  request(app)
    .post(MAIN_ROUTE)
    .send({
      cpf: buildCpf(),
      name,
      email: buildEmail(),
      birthDate: date,
      gender,
    })
    .set('authorization', `Bearer ${user.token}`)
    .then((result) => {
      expect(result.status).toBe(201);
      expect(result.body.name).toBe('Olivia Vera');
    }));

it('must list all patients', () =>
  app
    .db('patients')
    .insert({
      cpf: buildCpf(),
      name,
      email: buildEmail(),
      birthDate: date,
      gender,
    })
    .then(() =>
      request(app).get(MAIN_ROUTE).set('authorization', `Bearer ${user.token}`)
    )
    .then((res) => {
      expect(res.status).toBe(200);
      expect(res.body.length).toBeGreaterThan(0);
    }));

it('must list a patient per id', () =>
  app
    .db('patients')
    .insert(
      {
        cpf: buildCpf(),
        name,
        email: buildEmail(),
        birthDate: date,
        gender,
      },
      ['id']
    )
    .then((patient) =>
      request(app)
        .get(`${MAIN_ROUTE}/${patient[0].id}`)
        .set('authorization', `Bearer ${user.token}`)
    )
    .then((res) => {
      expect(res.status).toBe(200);
    }));

it('must remove a patient', () =>
  app
    .db('patients')
    .insert(
      {
        cpf: buildCpf(),
        name,
        email: buildEmail(),
        birthDate: date,
        gender,
      },
      ['id']
    )
    .then((patient) =>
      request(app)
        .delete(`${MAIN_ROUTE}/${patient[0].id}`)
        .set('authorization', `Bearer ${user.token}`)
    )
    .then((res) => {
      expect(res.status).toBe(204);
    }));

describe('when creating a patient', () => {
  let validPatient;
  beforeAll(() => {
    validPatient = {
      cpf: buildCpf(),
      name,
      email: buildEmail(),
      birthDate: date,
      gender,
    };
  });

  const invalidCreationTemplate = (invalidData, validationErrorMessage) =>
    request(app)
      .post(MAIN_ROUTE)
      .send({ ...validPatient, ...invalidData })
      .set('authorization', `Bearer ${user.token}`)
      .then((res) => {
        expect(res.status).toBe(400);
        expect(res.body.error).toBe(validationErrorMessage);
      });

  it('must not create without a name', () =>
    invalidCreationTemplate({ name: null }, 'Name is required.'));

  it('must not create without a cpf', () =>
    invalidCreationTemplate({ cpf: null }, 'CPF is required.'));

  it('must not create without an email', () =>
    invalidCreationTemplate({ email: null }, 'Email is required.'));

  it('must not create without a gender', () =>
    invalidCreationTemplate({ gender: null }, 'Gender is required.'));

  it('must not create with an invalid gender', () =>
    invalidCreationTemplate(
      { gender: 'X' },
      'Gender must be F (female), M (male) or O (other)'
    ));

  it('must not create without a birthDate', () =>
    invalidCreationTemplate({ birthDate: null }, 'Birth date is required.'));
});

describe('when updating a patient', () => {
  let validPatient;
  let patient;

  beforeAll(async () => {
    const patientRes = await app.services.patient.create({
      cpf: buildCpf(),
      name,
      email: buildEmail(),
      birthDate: date,
      gender,
    });
    patient = patientRes[0];

    validPatient = {
      cpf: buildCpf(),
      name,
      email: buildEmail(),
      birthDate: date,
      gender,
    };
  });

  const invalidCreationTemplate = (invalidData, validationErrorMessage) =>
    request(app)
      .put(`${MAIN_ROUTE}/${patient.id}`)
      .send({ ...validPatient, ...invalidData })
      .set('authorization', `Bearer ${user.token}`)
      .then((res) => {
        expect(res.status).toBe(400);
        expect(res.body.error).toBe(validationErrorMessage);
      });

  it('must not update without a name', () =>
    invalidCreationTemplate({ name: null }, 'Name is required.'));

  it('must not update without a cpf', () =>
    invalidCreationTemplate({ cpf: null }, 'CPF is required.'));

  it('must not update without an email', () =>
    invalidCreationTemplate({ email: null }, 'Email is required.'));

  it('must not update without a gender', () =>
    invalidCreationTemplate({ gender: null }, 'Gender is required.'));

  it('must not update with an invalid gender', () =>
    invalidCreationTemplate(
      { gender: 'X' },
      'Gender must be F (female), M (male) or O (other)'
    ));

  it('must not update without a birthDate', () =>
    invalidCreationTemplate({ birthDate: null }, 'Birth date is required.'));
});

it('must not create a patient with duplicated cpf', () => {
  const duplicatedCpf = '12345678910';

  return request(app)
    .post(MAIN_ROUTE)
    .send({
      cpf: duplicatedCpf,
      name,
      email: buildEmail(),
      birthDate: date,
      gender,
    })
    .set('authorization', `Bearer ${user.token}`)
    .then(
      request(app)
        .post(MAIN_ROUTE)
        .send({
          cpf: duplicatedCpf,
          name,
          email: buildEmail(),
          birthDate: date,
          gender,
        })
        .set('authorization', `Bearer ${user.token}`)
        .then((result) => {
          expect(result.status).toBe(400);
          expect(result.body.error).toBe('CPF already registered.');
        })
    );
});

it('must not create a patient with duplicated email', () => {
  const duplicatedEmail = 'email@email.com';

  return request(app)
    .post(MAIN_ROUTE)
    .send({
      cpf: buildCpf(),
      name,
      email: duplicatedEmail,
      birthDate: date,
      gender,
    })
    .set('authorization', `Bearer ${user.token}`)
    .then(
      request(app)
        .post(MAIN_ROUTE)
        .send({
          cpf: buildCpf(),
          name,
          email: duplicatedEmail,
          birthDate: date,
          gender,
        })
        .set('authorization', `Bearer ${user.token}`)
        .then((result) => {
          expect(result.status).toBe(400);
          expect(result.body.error).toBe('Email already registered.');
        })
    );
});
