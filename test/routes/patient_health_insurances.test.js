const request = require('supertest');
const jwt = require('jwt-simple');
const app = require('../../src/app');

const MAIN_ROUTE = '/api/patients';
const buildEmail = () => `${Date.now()}@email.com`;
const date = new Date('1973-06-01').toISOString();
const name = 'Manuela Mariane Assunção';
const gender = 'F';

const buildCpf = () =>
  Math.floor(Math.random() * (99999999999 - 10000000000 + 1)) + 10000000000;

let user;
let patient;
let otherPatient;
let healthInsurance;

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

  const healthInsuranceRes = await app.services.health_insurance.create({
    name: 'Health Insurance',
    ansRecord: Math.floor(Math.random() * (999999 - 100000 + 1)) + 100000,
    accepted: true,
  });
  healthInsurance = { ...healthInsuranceRes[0] };
});

describe('when creating a patient health insurance', () => {
  let validPatientHealthInsurance;
  beforeAll(() => {
    validPatientHealthInsurance = {
      patientId: patient.id,
      healthInsuranceId: healthInsurance.id,
      cardNumber: '123456789',
      primary: true,
    };
  });

  const validCreationTemplate = (validData, attribute, value) =>
    request(app)
      .post(`${MAIN_ROUTE}/${patient.id}/insurances`)
      .send({ ...validPatientHealthInsurance, ...validData })
      .set('authorization', `bearer ${user.token}`)
      .then((res) => {
        expect(res.status).toBe(201);
        expect(res.body[attribute]).toBe(value);
      });

  const invalidCreationTemplate = (invalidData, validationErrorMessage) =>
    request(app)
      .post(`${MAIN_ROUTE}/${patient.id}/insurances`)
      .send({ ...validPatientHealthInsurance, ...invalidData })
      .set('authorization', `bearer ${user.token}`)
      .then((res) => {
        expect(res.status).toBe(400);
        expect(res.body.error).toBe(validationErrorMessage);
      });

  it('must create with all attributes successfully', () =>
    validCreationTemplate());

  it('must create without primary selection', () =>
    validCreationTemplate({ primary: undefined }, 'primary', true));

  it('must not create without a patientId', () =>
    invalidCreationTemplate({ patientId: undefined }, 'Patient is required.'));

  it('must not create without a healthInsuranceId', () =>
    invalidCreationTemplate(
      { healthInsuranceId: undefined },
      'Health Insurance is required.'
    ));

  it('must not create without a card number', () =>
    invalidCreationTemplate(
      { cardNumber: undefined },
      'Card number is required.'
    ));
});

it('must list only the patient health insurances', () =>
  app
    .db('patient_health_insurances')
    .insert({
      patientId: otherPatient.id,
      healthInsuranceId: healthInsurance.id,
      cardNumber: '123456789',
      primary: true,
    })
    .then(() =>
      request(app)
        .get(`${MAIN_ROUTE}/${otherPatient.id}/insurances`)
        .set('authorization', `Bearer ${user.token}`)
        .then((res) => {
          expect(res.status).toBe(200);
          expect(res.body).toHaveLength(1);
        })
    ));

it('must return the patient health insurances', () =>
  request(app)
    .get(`${MAIN_ROUTE}/${patient.id}/insurances`)
    .set('authorization', `Bearer ${user.token}`)
    .then((res) => {
      expect(res.status).toBe(200);
      expect(res.body.length).toBeGreaterThan(0);
    }));

it('must return a patient health insurance by id', () =>
  app
    .db('patient_health_insurances')
    .insert(
      {
        patientId: patient.id,
        healthInsuranceId: healthInsurance.id,
        cardNumber: '123456789',
        primary: true,
      },
      ['id']
    )
    .then((result) =>
      request(app)
        .get(`${MAIN_ROUTE}/${patient.id}/insurances/${result[0].id}`)
        .set('authorization', `Bearer ${user.token}`)
        .then((res) => {
          expect(res.status).toBe(200);
          expect(res.body.id).toBe(result[0].id);
        })
    ));

it('must update a patient health insurance', () =>
  app
    .db('patient_health_insurances')
    .insert(
      {
        patientId: patient.id,
        healthInsuranceId: healthInsurance.id,
        cardNumber: '123456789',
        primary: true,
      },
      ['id']
    )
    .then((result) =>
      request(app)
        .put(`${MAIN_ROUTE}/${patient.id}/insurances/${result[0].id}`)
        .send({ primary: false })
        .set('authorization', `Bearer ${user.token}`)
    )
    .then((res) => {
      expect(res.status).toBe(200);
      expect(res.body.primary).toBe(false);
    }));

it('must delete a patient health insurance', () =>
  app
    .db('patient_health_insurances')
    .insert(
      {
        patientId: patient.id,
        healthInsuranceId: healthInsurance.id,
        cardNumber: '123456789',
        primary: true,
      },
      ['id']
    )
    .then((result) =>
      request(app)
        .delete(`${MAIN_ROUTE}/${patient.id}/insurances/${result[0].id}`)
        .set('authorization', `Bearer ${user.token}`)
    )
    .then((res) => {
      expect(res.status).toBe(204);
    }));
