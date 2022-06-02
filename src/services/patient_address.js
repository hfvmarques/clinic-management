const ValidationError = require('../errors/ValidationError');

module.exports = (app) => {
  const find = (patientId, filter = {}) =>
    app.db('patient_addresses').where({ patientId }).where(filter).select();

  const create = (patientAddress) =>
    app.db('patient_addresses').insert(patientAddress, '*');

  return { find, create };
};
