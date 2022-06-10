const ValidationError = require('../errors/ValidationError');

module.exports = (app) => {
  const find = (patientId, filter = {}) =>
    app.db('patient_addresses').where({ patientId }).where(filter).select();

  const findById = (patientId, addressId) =>
    app.db('patient_addresses').where({ patientId, id: addressId }).first();

  const create = async (patientAddress) => {
    await validate(patientAddress);

    return app.db('patient_addresses').insert(patientAddress, '*');
  };

  const update = async (patientId, addressId, data) => {
    await validate(data);

    return app
      .db('patient_addresses')
      .where({ patientId, id: addressId })
      .update(data, '*');
  };

  const remove = (patientId, addressId) =>
    app.db('patient_addresses').where({ patientId, id: addressId }).del();

  const validate = async (patientAddress) => {
    if (!patientAddress.patientId)
      throw new ValidationError('Patient is required.');
    if (!patientAddress.street)
      throw new ValidationError('Street is required.');
    if (!patientAddress.number)
      throw new ValidationError('Number is required.');
    if (!patientAddress.district)
      throw new ValidationError('District is required.');
    if (!patientAddress.zipCode)
      throw new ValidationError('Zip code is required.');
    if (!patientAddress.state) throw new ValidationError('State is required.');
    if (!patientAddress.city) throw new ValidationError('City is required.');
    if (!patientAddress.primary)
      throw new ValidationError('Primary choice is required.');
  };

  return { find, findById, create, update, remove };
};
