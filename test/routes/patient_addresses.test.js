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
});

it('must list only the patient addresses', () =>
  app
    .db('patient_addresses')
    .insert([
      {
        patientId: patient.id,
        street: 'Alameda Sergio Manesque',
        number: '891',
        complement: 'Apto 13',
        district: 'Jaderlândia',
        zipCode: '68746427',
        city: 'Castanhal',
        state: 'PA',
        primary: true,
      },
      {
        patientId: otherPatient.id,
        street: 'Alameda Sergio Manesque',
        number: '891',
        complement: 'Apto 13',
        district: 'Jaderlândia',
        zipCode: '68746427',
        city: 'Castanhal',
        state: 'PA',
        primary: true,
      },
    ])
    .then(() =>
      request(app)
        .get(`${MAIN_ROUTE}/${otherPatient.id}/addresses`)
        .set('authorization', `Bearer ${user.token}`)
    )
    .then((res) => {
      expect(res.status).toBe(200);
      expect(res.body.length).toBe(1);
    }));

describe('when creating a patient address', () => {
  let validPatientAddress;
  beforeAll(() => {
    validPatientAddress = {
      patientId: patient.id,
      street: 'Alameda Sergio Manesque',
      number: '891',
      complement: 'Apto 13',
      district: 'Jaderlândia',
      zipCode: '68746427',
      city: 'Castanhal',
      state: 'PA',
      primary: true,
    };
  });

  const validCreationTemplate = (validData, attribute, value) =>
    request(app)
      .post(`${MAIN_ROUTE}/${patient.id}/addresses`)
      .send({ ...validPatientAddress, ...validData })
      .set('authorization', `Bearer ${user.token}`)
      .then((res) => {
        expect(res.status).toBe(201);
        expect(res.body[attribute]).toBe(value);
      });

  const invalidCreationTemplate = (invalidData, validationErrorMessage) =>
    request(app)
      .post(`${MAIN_ROUTE}/${patient.id}/addresses`)
      .send({ ...validPatientAddress, ...invalidData })
      .set('authorization', `Bearer ${user.token}`)
      .then((res) => {
        expect(res.status).toBe(400);
        expect(res.body.error).toBe(validationErrorMessage);
      });

  it('must create with all attributes', () => validCreationTemplate());

  it('must create without complement', () =>
    validCreationTemplate({ complement: null }, 'complement', null));

  it('must not create without primary selection', () =>
    invalidCreationTemplate({ primary: null }, 'Primary choice is required.'));

  it('must not create without a patientId', () =>
    invalidCreationTemplate({ patientId: null }, 'Patient is required.'));

  it('must not create without a street', () =>
    invalidCreationTemplate({ street: null }, 'Street is required.'));

  it('must not create without a number', () =>
    invalidCreationTemplate({ number: null }, 'Number is required.'));

  it('must not create without a district', () =>
    invalidCreationTemplate({ district: null }, 'District is required.'));

  it('must not create without a zip code', () =>
    invalidCreationTemplate({ zipCode: null }, 'Zip code is required.'));

  it('must not create without a city', () =>
    invalidCreationTemplate({ city: null }, 'City is required.'));

  it('must not create without a state', () =>
    invalidCreationTemplate({ state: null }, 'State is required.'));
});

describe('when updating a patient address', () => {
  let validPatientAddress;
  let address;

  beforeAll(async () => {
    const addressRes = await app.services.patient_address.create({
      patientId: patient.id,
      street: 'Alameda Sergio Manesque',
      number: '891',
      complement: 'Apto 13',
      district: 'Jaderlândia',
      zipCode: '68746427',
      city: 'Castanhal',
      state: 'PA',
      primary: true,
    });
    address = { ...addressRes[0] };

    validPatientAddress = {
      patientId: patient.id,
      street: 'Alameda Sergio Manesque',
      number: '891',
      complement: 'Apto 13',
      district: 'Jaderlândia',
      zipCode: '68746427',
      city: 'Castanhal',
      state: 'PA',
      primary: true,
    };
  });

  const validCreationTemplate = (validData, attribute, value) =>
    request(app)
      .put(`${MAIN_ROUTE}/${patient.id}/addresses/${address.id}`)
      .send({ ...validPatientAddress, ...validData })
      .set('authorization', `Bearer ${user.token}`)
      .then((res) => {
        expect(res.status).toBe(200);
        expect(res.body[attribute]).toBe(value);
      });

  const invalidCreationTemplate = (invalidData, validationErrorMessage) =>
    request(app)
      .put(`${MAIN_ROUTE}/${patient.id}/addresses/${address.id}`)
      .send({ ...validPatientAddress, ...invalidData })
      .set('authorization', `Bearer ${user.token}`)
      .then((res) => {
        expect(res.status).toBe(400);
        expect(res.body.error).toBe(validationErrorMessage);
      });

  it('must update with all attributes', () =>
    validCreationTemplate({ street: 'New Street' }, 'street', 'New Street'));

  it('must update without complement', () =>
    validCreationTemplate({ complement: null }, 'complement', null));

  it('must not update without primary selection', () =>
    invalidCreationTemplate({ primary: null }, 'Primary choice is required.'));

  it('must not update without a patientId', () =>
    invalidCreationTemplate({ patientId: null }, 'Patient is required.'));

  it('must not update without a street', () =>
    invalidCreationTemplate({ street: null }, 'Street is required.'));

  it('must not update without a number', () =>
    invalidCreationTemplate({ number: null }, 'Number is required.'));

  it('must not update without a district', () =>
    invalidCreationTemplate({ district: null }, 'District is required.'));

  it('must not update without a zip code', () =>
    invalidCreationTemplate({ zipCode: null }, 'Zip code is required.'));

  it('must not update without a city', () =>
    invalidCreationTemplate({ city: null }, 'City is required.'));

  it('must not update without a state', () =>
    invalidCreationTemplate({ state: null }, 'State is required.'));
});

it('must return a patient address', () =>
  request(app)
    .get(`${MAIN_ROUTE}/${patient.id}/addresses`)
    .set('authorization', `Bearer ${user.token}`)
    .then((res) => {
      expect(res.status).toBe(200);
      expect(res.body.length).toBeGreaterThan(0);
    }));

it('must return a patient address by id', () =>
  app
    .db('patient_addresses')
    .insert(
      {
        patientId: patient.id,
        street: 'Alameda Sergio Manesque',
        number: '891',
        complement: 'Apto 13',
        district: 'Jaderlândia',
        zipCode: '68746427',
        city: 'Castanhal',
        state: 'PA',
        primary: true,
      },
      ['id']
    )
    .then((result) =>
      request(app)
        .get(`${MAIN_ROUTE}/${patient.id}/addresses/${result[0].id}`)
        .set('authorization', `Bearer ${user.token}`)
        .then((res) => {
          expect(res.status).toBe(200);
          expect(res.body.id).toBe(result[0].id);
        })
    ));

it('must delete a patient address', () =>
  app
    .db('patient_addresses')
    .insert(
      {
        patientId: patient.id,
        street: 'Alameda Sergio Manesque',
        number: '891',
        complement: 'Apto 13',
        district: 'Jaderlândia',
        zipCode: '68746427',
        city: 'Castanhal',
        state: 'PA',
        primary: true,
      },
      ['id']
    )
    .then((result) =>
      request(app)
        .delete(`${MAIN_ROUTE}/${patient.id}/addresses/${result[0].id}`)
        .set('authorization', `Bearer ${user.token}`)
    )
    .then((res) => {
      expect(res.status).toBe(204);
    }));
