const request = require('supertest');
const jwt = require('jwt-simple');
const app = require('../../src/app');

const MAIN_ROUTE = '/api/physicians';

const buildEmail = () => `${Date.now()}@email.com`;
const date = new Date('1998-01-12').toISOString();
const name = 'Clarice Jaqueline Carvalho';
const gender = 'F';
const state = 'MA';

const buildCpf = () =>
  Math.floor(Math.random() * (99999999999 - 10000000000 + 1)) + 10000000000;

const buildCrm = () => Math.floor(Math.random() * (999999 - 1000 + 1)) + 1000;

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

describe('when creating a physician', () => {
  let validPhysician;

  beforeAll(() => {
    validPhysician = {
      cpf: buildCpf(),
      crm: buildCrm(),
      crmState: state,
      email: buildEmail(),
      name,
      birthDate: date,
      gender,
    };
  });

  const validCreationTemplate = () =>
    request(app)
      .post(MAIN_ROUTE)
      .send(validPhysician)
      .set('authorization', `Bearer ${user.token}`);

  const invalidCreationTemplate = (invalidData) =>
    request(app)
      .post(MAIN_ROUTE)
      .send({ ...validPhysician, ...invalidData })
      .set('authorization', `Bearer ${user.token}`);

  it('must create successfully', () =>
    validCreationTemplate().then((res) => expect(res.status).toBe(201)));

  it('must not create without crm', () =>
    invalidCreationTemplate({ crm: null }).then((res) =>
      expect(res.status).toBe(400)
    ));

  it('must not create without crm state', () =>
    invalidCreationTemplate({ crmState: null }).then((res) =>
      expect(res.status).toBe(400)
    ));

  it('must not create without email', () =>
    invalidCreationTemplate({ email: null }).then((res) =>
      expect(res.status).toBe(400)
    ));

  it('must not create without name', () =>
    invalidCreationTemplate({ name: null }).then((res) =>
      expect(res.status).toBe(400)
    ));

  it('must not create without birthDate', () =>
    invalidCreationTemplate({ birthDate: null }).then((res) =>
      expect(res.status).toBe(400)
    ));

  it('must not create without gender', () =>
    invalidCreationTemplate({ gender: null }).then((res) =>
      expect(res.status).toBe(400)
    ));

  it('must not create with invalid gender', () =>
    invalidCreationTemplate({ gender: 'X' }).then((res) =>
      expect(res.status).toBe(400)
    ));

  it('must issue the crm message', () =>
    invalidCreationTemplate({ crm: null }).then((res) =>
      expect(res.body.error).toBe('CRM is required.')
    ));

  it('must issue the crm state message', () =>
    invalidCreationTemplate({ crmState: null }).then((res) =>
      expect(res.body.error).toBe('CRM State is required.')
    ));

  it('must issue the email message', () =>
    invalidCreationTemplate({ email: null }).then((res) =>
      expect(res.body.error).toBe('Email is required.')
    ));

  it('must issue the name message', () =>
    invalidCreationTemplate({ name: null }).then((res) =>
      expect(res.body.error).toBe('Name is required.')
    ));

  it('must issue the birthDate message', () =>
    invalidCreationTemplate({ birthDate: null }).then((res) =>
      expect(res.body.error).toBe('Birth date is required.')
    ));

  it('must issue the gender message', () =>
    invalidCreationTemplate({ gender: null }).then((res) =>
      expect(res.body.error).toBe('Gender is required.')
    ));

  it('must issue the invalid gender message', () =>
    invalidCreationTemplate({ gender: 'X' }).then((res) =>
      expect(res.body.error).toBe(
        'Gender must be F (female), M (male) or O (other).'
      )
    ));
});

describe('when getting all physicians', () => {
  const getPhysicians = () =>
    request(app).get(MAIN_ROUTE).set('authorization', `Bearer ${user.token}`);

  it('must return successfully', () =>
    getPhysicians().then((res) => expect(res.status).toBe(200)));

  it('must return at least 1 result', () =>
    getPhysicians().then((res) => expect(res.body.length).toBeGreaterThan(0)));
});

describe('when updating a physician', () => {
  let physician;
  let validPhysician;

  beforeAll(async () => {
    const res = await app.services.physician.create({
      cpf: buildCpf(),
      crm: buildCrm(),
      crmState: state,
      email: buildEmail(),
      name,
      birthDate: date,
      gender,
    });
    physician = { ...res[0] };
  });

  validPhysician = {
    cpf: buildCpf(),
    crm: buildCrm(),
    crmState: state,
    email: buildEmail(),
    name,
    birthDate: date,
    gender,
  };

  const validUpdateTemplate = (validData) =>
    request(app)
      .put(`${MAIN_ROUTE}/${physician.id}`)
      .send({ ...validPhysician, ...validData })
      .set('authorization', `Bearer ${user.token}`);

  const invalidUpdateTemplate = (invalidData) =>
    request(app)
      .put(`${MAIN_ROUTE}/${physician.id}`)
      .send({ ...validPhysician, ...invalidData })
      .set('authorization', `Bearer ${user.token}`);

  it('must update successfully', () =>
    validUpdateTemplate({ name: 'New Name' }).then((res) =>
      expect(res.status).toBe(200)
    ));

  it('must update and return the new data', () =>
    validUpdateTemplate({ name: 'Another Name' }).then((res) =>
      expect(res.body.name).toBe('Another Name')
    ));

  it('must not update without cpf', () =>
    invalidUpdateTemplate({ cpf: null }).then((res) =>
      expect(res.status).toBe(400)
    ));

  it('must not update without crm', () =>
    invalidUpdateTemplate({ crm: null }).then((res) =>
      expect(res.status).toBe(400)
    ));

  it('must not update without crmState', () =>
    invalidUpdateTemplate({ crmState: null }).then((res) =>
      expect(res.status).toBe(400)
    ));

  it('must not update without email', () =>
    invalidUpdateTemplate({ email: null }).then((res) =>
      expect(res.status).toBe(400)
    ));

  it('must not update without name', () =>
    invalidUpdateTemplate({ name: null }).then((res) =>
      expect(res.status).toBe(400)
    ));

  it('must not update without birthDate', () =>
    invalidUpdateTemplate({ birthDate: null }).then((res) =>
      expect(res.status).toBe(400)
    ));

  it('must not update without gender', () =>
    invalidUpdateTemplate({ gender: null }).then((res) =>
      expect(res.status).toBe(400)
    ));

  it('must not update with invalid gender', () =>
    invalidUpdateTemplate({ gender: 'X' }).then((res) =>
      expect(res.status).toBe(400)
    ));

  it('must issue the cpf message', () =>
    invalidUpdateTemplate({ cpf: null }).then((res) =>
      expect(res.body.error).toBe('CPF is required.')
    ));

  it('must issue the crm message', () =>
    invalidUpdateTemplate({ crm: null }).then((res) =>
      expect(res.body.error).toBe('CRM is required.')
    ));

  it('must issue the crmState message', () =>
    invalidUpdateTemplate({ crmState: null }).then((res) =>
      expect(res.body.error).toBe('CRM State is required.')
    ));

  it('must issue the email message', () =>
    invalidUpdateTemplate({ email: null }).then((res) =>
      expect(res.body.error).toBe('Email is required.')
    ));

  it('must issue the name message', () =>
    invalidUpdateTemplate({ name: null }).then((res) =>
      expect(res.body.error).toBe('Name is required.')
    ));

  it('must issue the birthDate message', () =>
    invalidUpdateTemplate({ birthDate: null }).then((res) =>
      expect(res.body.error).toBe('Birth date is required.')
    ));

  it('must issue the gender message', () =>
    invalidUpdateTemplate({ gender: null }).then((res) =>
      expect(res.body.error).toBe('Gender is required.')
    ));

  it('must issue the invalid gender message', () =>
    invalidUpdateTemplate({ gender: 'X' }).then((res) =>
      expect(res.body.error).toBe(
        'Gender must be F (female), M (male) or O (other).'
      )
    ));
});

describe('when deleting a physician', () => {
  let physician;

  beforeAll(async () => {
    const res = await app.services.physician.create({
      cpf: buildCpf(),
      crm: buildCrm(),
      crmState: state,
      email: buildEmail(),
      name,
      birthDate: date,
      gender,
    });
    physician = { ...res[0] };
  });

  const deletePhysician = () =>
    request(app)
      .delete(`${MAIN_ROUTE}/${physician.id}`)
      .set('authorization', `Bearer ${user.token}`);

  it('must delete successfully', () =>
    deletePhysician().then((res) => expect(res.status).toBe(204)));
});

describe('when getting a physician by id', () => {
  let physician;

  beforeAll(async () => {
    const res = await app.services.physician.create({
      cpf: buildCpf(),
      crm: buildCrm(),
      crmState: state,
      email: buildEmail(),
      name,
      birthDate: date,
      gender,
    });
    physician = { ...res[0] };
  });

  it('must return successfully', () =>
    request(app)
      .get(`${MAIN_ROUTE}/${physician.id}`)
      .set('authorization', `Bearer ${user.token}`)
      .then((res) => expect(res.status).toBe(200)));
});

describe('when creating a physician with duplicated data', () => {
  let physician;

  beforeAll(async () => {
    const res = await app.services.physician.create({
      cpf: buildCpf(),
      crm: buildCrm(),
      crmState: state,
      email: buildEmail(),
      name,
      birthDate: date,
      gender,
    });
    physician = { ...res[0] };
  });

  const duplicatedPhysician = {
    cpf: buildCpf(),
    crm: buildCrm(),
    crmState: state,
    email: buildEmail(),
    name,
    birthDate: date,
    gender,
  };

  const creationTemplate = (duplicatedData) =>
    request(app)
      .post(`${MAIN_ROUTE}`)
      .send({ ...duplicatedPhysician, ...duplicatedData })
      .set('authorization', `Bearer ${user.token}`);

  it('must not create with duplicated cpf', () =>
    creationTemplate({ cpf: physician.cpf }).then((res) =>
      expect(res.status).toBe(400)
    ));

  it('must issue the duplicated cpf message', () =>
    creationTemplate({ cpf: physician.cpf }).then((res) =>
      expect(res.body.error).toBe('CPF already registered.')
    ));

  it('must not create with duplicated crm', () =>
    creationTemplate({ crm: physician.crm }).then((res) =>
      expect(res.status).toBe(400)
    ));

  it('must issue the duplicated crm message', () =>
    creationTemplate({ crm: physician.crm }).then((res) =>
      expect(res.body.error).toBe('CRM already registered.')
    ));

  it('must not create with duplicated email', () =>
    creationTemplate({ email: physician.email }).then((res) =>
      expect(res.status).toBe(400)
    ));

  it('must issue the duplicated email message', () =>
    creationTemplate({ email: physician.email }).then((res) =>
      expect(res.body.error).toBe('Email already registered.')
    ));
});
