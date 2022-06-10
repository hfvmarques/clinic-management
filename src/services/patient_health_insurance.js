const ValidationError = require('../errors/ValidationError');

module.exports = (app) => {
  const find = (patientId, filter = {}) =>
    app
      .db('patient_health_insurances')
      .where({ patientId })
      .where(filter)
      .select();

  const findById = (patientId, healthInsuranceId) =>
    app
      .db('patient_health_insurances')
      .where({ patientId, id: healthInsuranceId })
      .first();

  const create = async (patientHealthInsurance) => {
    await validate(patientHealthInsurance);

    return app
      .db('patient_health_insurances')
      .insert(patientHealthInsurance, '*');
  };

  const update = async (patientId, healthInsuranceId, data) => {
    await validate(data);

    return app
      .db('patient_health_insurances')
      .where({ patientId, id: healthInsuranceId })
      .update(data, '*');
  };

  const remove = (patientId, healthInsuranceId) =>
    app
      .db('patient_addresses')
      .where({ patientId, id: healthInsuranceId })
      .del();

  const validate = async (patientHealthInsurance) => {
    if (!patientHealthInsurance.patientId)
      throw new ValidationError('Patient is required.');
    if (!patientHealthInsurance.healthInsuranceId)
      throw new ValidationError('Health Insurance is required.');
    if (!patientHealthInsurance.cardNumber)
      throw new ValidationError('Card number is required.');
    if (!patientHealthInsurance.primary)
      throw new ValidationError('Primary choice is required.');
  };

  return { find, findById, create, update, remove };
};
