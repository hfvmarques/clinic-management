const ValidationError = require('../errors/ValidationError');

module.exports = (app) => {
  const find = (patientId, filter = {}) =>
    app.db('patient_phones').where({ patientId }).where(filter).select();

  const findById = (patientId, phoneId) =>
    app.db('patient_phones').where({ patientId, id: phoneId }).first();

  const create = async (patientPhone) =>
    app.db('patient_phones').insert(patientPhone, '*');

  const update = async (patientId, phoneId, data) =>
    app
      .db('patient_phones')
      .where({ patientId, id: phoneId })
      .update(data, '*');

  const remove = (patientId, phoneId) =>
    app.db('patient_phones').where({ patientId, id: phoneId }).del();

  const validate = async (patientPhone) => {
    if (!patientPhone.phone) {
      throw new ValidationError('Phone number is required.');
    }
    if (!patientPhone.countryCode) {
      throw new ValidationError('Country code is required.');
    }
    if (!patientPhone.patientId) {
      throw new ValidationError('Patient is required.');
    }
    if (!patientPhone.primary) {
      throw new ValidationError('Primary choice is required.');
    }
  };

  return {
    find,
    findById,
    create,
    update,
    remove,
    validate,
  };
};
