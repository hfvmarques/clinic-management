module.exports = (app) => {
  const find = (patientId, filter = {}) =>
    app
      .db('patient_phones')
      .join('patients', 'patients.id', 'patient_phones.patientId')
      .where({ patientId })
      .where(filter)
      .select();

  return { find };
};
