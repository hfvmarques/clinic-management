module.exports = (app) => {
  const find = (patientId, filter = {}) =>
    app
      .db('patient_phones')
      .join('patients', 'patients.id', 'patient_phones.patientId')
      .where({ patientId })
      .where(filter)
      .select();

  const findById = (patientId, phoneId) =>
    app.db('patient_phones').where({ patientId, id: phoneId }).first();

  const create = async (patientPhone) =>
    app.db('patient_phones').insert(patientPhone, '*');

  return { find, findById, create };
};
