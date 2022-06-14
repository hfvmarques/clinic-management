const ValidationError = require('../errors/ValidationError');

module.exports = (app) => {
  const findAll = () => app.db('health_insurances').select();

  const find = (filter = {}) =>
    app.db('health_insurances').where(filter).first();

  const create = async (healthInsurance) => {
    const existingAnsRecord = await find({
      ansRecord: healthInsurance.ansRecord,
    });

    if (existingAnsRecord) {
      throw new ValidationError('ANS record already registered.');
    }

    return app.db('health_insurances').insert(healthInsurance, '*');
  };

  const update = async (id, healthInsurance) =>
    app.db('health_insurances').where({ id }).update(healthInsurance, '*');

  const remove = (id) => app.db('health_insurances').where({ id }).del();

  const validate = async (healthInsurance) => {
    if (!healthInsurance.name) throw new ValidationError('Name is required.');
    if (!healthInsurance.accepted) {
      throw new ValidationError('Accepted choice is required.');
    }
    if (!healthInsurance.ansRecord) {
      throw new ValidationError('ANS record is required.');
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
