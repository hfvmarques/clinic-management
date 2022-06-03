const ValidationError = require('../errors/ValidationError');

module.exports = (app) => {
  const findAll = () => app.db('health_insurances').select();

  const find = (filter = {}) =>
    app.db('health_insurances').where(filter).first();

  const create = async (health_insurance) => {
    if (!health_insurance.name) throw new ValidationError('Name is required.');

    if (!health_insurance.ansRecord)
      throw new ValidationError('ANS record is required.');

    const existingAnsRecord = await find({
      ansRecord: health_insurance.ansRecord,
    });

    if (existingAnsRecord)
      throw new ValidationError('ANS record already registered.');

    return app.db('health_insurances').insert(health_insurance, '*');
  };

  const update = (id, health_insurance) =>
    app.db('health_insurances').where({ id }).update(health_insurance, '*');

  const remove = (id) => app.db('health_insurances').where({ id }).del();

  return { findAll, find, create, update, remove };
};
