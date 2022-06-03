const request = require('supertest');
const jwt = require('jwt-simple');
const app = require('../../src/app');

const MAIN_ROUTE = '/api/patients';

const buildEmail = () => `${Date.now()}@email.com`;
const date = new Date('1999-02-23').toISOString();
const name = 'Bento Gabriel Costa';
const gender = 'M';

const buildCpf = () =>
  Math.floor(Math.random() * (99999999999 - 10000000000 + 1)) + 10000000000;

const buildPhone = () =>
  Math.floor(Math.random() * (99999999999 - 10000000000 + 1)) + 10000000000;

let user;
let patient;
let otherPatient;

beforeAll(async () => {
  const email = buildEmail();
  const userRes = await app.services.user.create({
    name: 'User Account',
    email,
    password: '123456',
  });
  user = { ...userRes[0] };
  user.token = jwt.encode(user, 'Secret!');
  delete user.password;

  const patientRes = await app.services.patient.create({
    cpf: buildCpf(),
    name,
    email: buildEmail(),
    birthDate: date,
    gender,
  });
  patient = { ...patientRes[0] };

  const otherPatientRes = await app.services.patient.create({
    cpf: buildCpf(),
    name,
    email: buildEmail(),
    birthDate: date,
    gender,
  });
  otherPatient = { ...otherPatientRes[0] };
});

it('must list only the patient phones', () =>
  app
    .db('patient_phones')
    .insert([
      {
        patientId: patient.id,
        countryCode: '55',
        phone: buildPhone(),
        primary: true,
      },
      {
        patientId: otherPatient.id,
        countryCode: '55',
        phone: buildPhone(),
        primary: true,
      },
    ])
    .then(() =>
      request(app)
        .get(`${MAIN_ROUTE}/${otherPatient.id}/phones`)
        .set('authorization', `Bearer ${user.token}`)
    )
    .then((res) => {
      expect(res.status).toBe(200);
      expect(res.body.length).toBe(1);
    }));

describe('when creating a patient phone', () => {
  let validPatientPhone;
  beforeAll(() => {
    validPatientPhone = {
      patientId: patient.id,
      countryCode: '55',
      phone: buildPhone(),
      primary: false,
    };
  });

  const validCreationTemplate = (validData, attribute, value) =>
    request(app)
      .post(`${MAIN_ROUTE}/${patient.id}/phones`)
      .send({ ...validPatientPhone, ...validData })
      .set('authorization', `Bearer ${user.token}`)
      .then((res) => {
        expect(res.status).toBe(201);
        expect(res.body[attribute]).toBe(value);
      });

  const invalidCreationTemplate = (invalidData, validationErrorMessage) =>
    request(app)
      .post(`${MAIN_ROUTE}/${patient.id}/phones`)
      .send({ ...validPatientPhone, ...invalidData })
      .set('authorization', `Bearer ${user.token}`)
      .then((res) => {
        expect(res.status).toBe(400);
        expect(res.body.error).toBe(validationErrorMessage);
      });

  it('must create with all attributes', () => validCreationTemplate());

  it('must create without a primary selection', () =>
    validCreationTemplate({ primary: undefined }, 'primary', true));

  it('must create without a country code', () =>
    validCreationTemplate({ countryCode: undefined }, 'countryCode', '55'));

  it('must not create without a phone number', () =>
    invalidCreationTemplate({ phone: undefined }, 'Phone number is required.'));

  it('must not create without a patientId', () =>
    invalidCreationTemplate({ patientId: undefined }, 'Patient is required.'));
});

it('must return a patient phone', () =>
  request(app)
    .get(`${MAIN_ROUTE}/${patient.id}/phones`)
    .set('authorization', `Bearer ${user.token}`)
    .then((res) => {
      expect(res.status).toBe(200);
      expect(res.body.length).toBeGreaterThan(0);
    }));

it('must return a patient phone by id', () =>
  app
    .db('patient_phones')
    .insert(
      {
        patientId: patient.id,
        countryCode: '55',
        phone: buildPhone(),
        primary: true,
      },
      ['id']
    )
    .then((result) =>
      request(app)
        .get(`${MAIN_ROUTE}/${patient.id}/phones/${result[0].id}`)
        .set('authorization', `Bearer ${user.token}`)
        .then((res) => {
          expect(res.status).toBe(200);
          expect(res.body.id).toBe(result[0].id);
        })
    ));

it('must update a patient phone', () =>
  app
    .db('patient_phones')
    .insert(
      {
        patientId: patient.id,
        countryCode: '55',
        phone: buildPhone(),
        primary: false,
      },
      ['id']
    )
    .then((result) =>
      request(app)
        .put(`${MAIN_ROUTE}/${patient.id}/phones/${result[0].id}`)
        .send({ primary: true })
        .set('authorization', `Bearer ${user.token}`)
    )
    .then((res) => {
      expect(res.status).toBe(200);
      expect(res.body.primary).toBe(true);
    }));

it('must delete a patient phone', () =>
  app
    .db('patient_phones')
    .insert(
      {
        patientId: patient.id,
        countryCode: '55',
        phone: buildPhone(),
        primary: false,
      },
      ['id']
    )
    .then((result) =>
      request(app)
        .delete(`${MAIN_ROUTE}/${patient.id}/phones/${result[0].id}`)
        .set('authorization', `Bearer ${user.token}`)
    )
    .then((res) => {
      expect(res.status).toBe(204);
    }));
