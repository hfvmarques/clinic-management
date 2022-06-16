const ValidationError = require('../errors/ValidationError');

module.exports = (app) => {
  const findAll = () => app.db('physicians').select();
  const find = (filter = {}) => app.db('physicians').where(filter).first();

  const create = async (physician) => {
    const existingCpf = await find({ cpf: physician.cpf });
    const existingCrm = await find({ crm: physician.crm });
    const existingEmail = await find({ email: physician.email });

    if (existingCpf) throw new ValidationError('CPF already registered.');
    if (existingCrm) throw new ValidationError('CRM already registered.');
    if (existingEmail) throw new ValidationError('Email already registered.');

    return app.db('physicians').insert(physician, '*');
  };

  const update = (id, physician) =>
    app.db('physicians').update(physician, '*').where({ id });

  const remove = (id) => app.db('physicians').delete().where({ id });

  const validate = async (physician) => {
    if (!physician) throw new ValidationError('Physician not found.');
    if (!physician.name) throw new ValidationError('Name is required.');
    if (!physician.cpf) throw new ValidationError('CPF is required.');
    if (!physician.crm) throw new ValidationError('CRM is required.');
    if (!physician.crmState) {
      throw new ValidationError('CRM State is required.');
    }
    if (!physician.email) throw new ValidationError('Email is required.');
    if (!physician.gender) throw new ValidationError('Gender is required.');
    if (!physician.birthDate) {
      throw new ValidationError('Birth date is required.');
    }

    if (
      physician.gender !== 'F' &&
      physician.gender !== 'M' &&
      physician.gender !== 'O'
    ) {
      throw new ValidationError(
        'Gender must be F (female), M (male) or O (other).'
      );
    }
  };

  return {
    findAll,
    find,
    create,
    update,
    remove,
    validate,
  };
};
