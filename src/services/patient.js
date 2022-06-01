const ValidationError = require('../errors/ValidationError');

module.exports = (app) => {
  const findAll = () => app.db('patients').select();

  const find = (filter = {}) => app.db('patients').where(filter).first();

  const create = async (patient) => {
    if (!patient.name) throw new ValidationError('Name is required.');
    if (!patient.cpf) throw new ValidationError('CPF is required.');
    if (!patient.email) throw new ValidationError('Email is required.');
    if (!patient.gender) throw new ValidationError('Gender is required.');
    if (!patient.birthDate) {
      throw new ValidationError('Birth date is required.');
    }

    if (
      patient.gender !== 'F' &&
      patient.gender !== 'M' &&
      patient.gender !== 'O'
    ) {
      throw new ValidationError(
        'Gender must be F (female), M (male) or O (other)'
      );
    }

    const existingCpf = await find({ cpf: patient.cpf });
    const existingEmail = await find({ email: patient.email });

    if (existingCpf) throw new ValidationError('CPF already registered.');
    if (existingEmail) throw new ValidationError('Email already registered.');

    return app.db('patients').insert(patient, '*');
  };

  const update = (id, patient) =>
    app.db('patients').where({ id }).update(patient, '*');

  const remove = (id) => app.db('patients').where({ id }).del();

  return {
    findAll,
    find,
    create,
    update,
    remove,
  };
};
