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

describe('when getting all patients', () => {
  const getPatients = () =>
    request(app).get(MAIN_ROUTE).set('authorization', `Bearer ${user.token}`);

  it('must return status 200', () =>
    getPatients().then((res) => expect(res.status).toBe(200)));

  it('must return at least one result', () =>
    getPatients().then((res) => expect(res.body.length).toBeGreaterThan(0)));
});

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

  const invalidCreationTemplate = (invalidData) =>
    request(app)
      .post(MAIN_ROUTE)
      .send({ ...validPatient, ...invalidData })
      .set('authorization', `Bearer ${user.token}`);

  it('must not create without a name', () =>
    invalidCreationTemplate({ name: null }).then((res) =>
      expect(res.status).toBe(400)
    ));

  it('must not create without a cpf', () =>
    invalidCreationTemplate({ cpf: null }).then((res) =>
      expect(res.status).toBe(400)
    ));

  it('must not create without an email', () =>
    invalidCreationTemplate({ email: null }).then((res) =>
      expect(res.status).toBe(400)
    ));

  it('must not create without a gender', () =>
    invalidCreationTemplate({ gender: null }).then((res) =>
      expect(res.status).toBe(400)
    ));

  it('must not create with an invalid gender', () =>
    invalidCreationTemplate({ gender: 'X' }).then((res) =>
      expect(res.status).toBe(400)
    ));

  it('must not create without a birthDate', () =>
    invalidCreationTemplate({ birthDate: null }).then((res) =>
      expect(res.status).toBe(400)
    ));

  it('must not create without a name', () =>
    invalidCreationTemplate({ name: null }).then((res) =>
      expect(res.body.error).toBe('Name is required.')
    ));

  it('must not create without a cpf', () =>
    invalidCreationTemplate({ cpf: null }).then((res) =>
      expect(res.body.error).toBe('CPF is required.')
    ));

  it('must not create without an email', () =>
    invalidCreationTemplate({ email: null }).then((res) =>
      expect(res.body.error).toBe('Email is required.')
    ));

  it('must not create without a gender', () =>
    invalidCreationTemplate({ gender: null }).then((res) =>
      expect(res.body.error).toBe('Gender is required.')
    ));

  it('must not create with an invalid gender', () =>
    invalidCreationTemplate({ gender: 'X' }).then((res) =>
      expect(res.body.error).toBe(
        'Gender must be F (female), M (male) or O (other)'
      )
    ));

  it('must not create without a birthDate', () =>
    invalidCreationTemplate({ birthDate: null }).then((res) =>
      expect(res.body.error).toBe('Birth date is required.')
    ));
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
    patient = { ...patientRes[0] };

    validPatient = {
      cpf: buildCpf(),
      name,
      email: buildEmail(),
      birthDate: date,
      gender,
    };
  });

  const invalidUpdateTemplate = (invalidData) =>
    request(app)
      .put(`${MAIN_ROUTE}/${patient.id}`)
      .send({ ...validPatient, ...invalidData })
      .set('authorization', `Bearer ${user.token}`);

  it('must not update without a name', () =>
    invalidUpdateTemplate({ name: null }).then((res) =>
      expect(res.status).toBe(400)
    ));

  it('must not update without a cpf', () =>
    invalidUpdateTemplate({ cpf: null }).then((res) =>
      expect(res.status).toBe(400)
    ));

  it('must not update without an email', () =>
    invalidUpdateTemplate({ email: null }).then((res) =>
      expect(res.status).toBe(400)
    ));

  it('must not update without a gender', () =>
    invalidUpdateTemplate({ gender: null }).then((res) =>
      expect(res.status).toBe(400)
    ));

  it('must not update with an invalid gender', () =>
    invalidUpdateTemplate({ gender: 'X' }).then((res) =>
      expect(res.status).toBe(400)
    ));

  it('must not update without a birthDate', () =>
    invalidUpdateTemplate({ birthDate: null }).then((res) =>
      expect(res.status).toBe(400)
    ));

  it('must not update without a name', () =>
    invalidUpdateTemplate({ name: null }).then((res) =>
      expect(res.body.error).toBe('Name is required.')
    ));

  it('must not update without a cpf', () =>
    invalidUpdateTemplate({ cpf: null }).then((res) =>
      expect(res.body.error).toBe('CPF is required.')
    ));

  it('must not update without an email', () =>
    invalidUpdateTemplate({ email: null }).then((res) =>
      expect(res.body.error).toBe('Email is required.')
    ));

  it('must not update without a gender', () =>
    invalidUpdateTemplate({ gender: null }).then((res) =>
      expect(res.body.error).toBe('Gender is required.')
    ));

  it('must not update with an invalid gender', () =>
    invalidUpdateTemplate({ gender: 'X' }).then((res) =>
      expect(res.body.error).toBe(
        'Gender must be F (female), M (male) or O (other)'
      )
    ));

  it('must not update without a birthDate', () =>
    invalidUpdateTemplate({ birthDate: null }).then((res) =>
      expect(res.body.error).toBe('Birth date is required.')
    ));
});

it('must update a patient successfully', () =>
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
        .put(`${MAIN_ROUTE}/${patient[0].id}`)
        .send({
          cpf: buildCpf(),
          name: 'New Name',
          email: buildEmail(),
          birthDate: date,
          gender,
        })
        .set('authorization', `Bearer ${user.token}`)
    )
    .then((res) => {
      expect(res.status).toBe(200);
      expect(res.body.name).toBe('New Name');
    }));

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
