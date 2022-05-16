module.exports = (app) => {
  const findAll = () => app.db('patients').select();

  const create = (patient) => app.db('patients').insert(patient, '*');

  return { findAll, create };
};
