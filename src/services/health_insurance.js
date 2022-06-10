const ValidationError = require('../errors/ValidationError');

module.exports = (app) => {
  const findAll = () => app.db('health_insurances').select();

  const find = (filter = {}) =>
    app.db('health_insurances').where(filter).first();

  const create = async (health_insurance) => {
    const existingAnsRecord = await find({
      ansRecord: health_insurance.ansRecord,
    });

    if (existingAnsRecord)
      throw new ValidationError('ANS record already registered.');

    return app.db('health_insurances').insert(health_insurance, '*');
  };

  const update = async (id, health_insurance) =>
    app.db('health_insurances').where({ id }).update(health_insurance, '*');

  const remove = (id) => app.db('health_insurances').where({ id }).del();

  const validate = async (health_insurance) => {
    if (!health_insurance.name) throw new ValidationError('Name is required.');
    if (!health_insurance.accepted)
      throw new ValidationError('Accepted choice is required.');
    if (!health_insurance.ansRecord)
      throw new ValidationError('ANS record is required.');
  };

  return { findAll, find, create, update, remove, validate };
};
