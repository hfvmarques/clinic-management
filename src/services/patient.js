module.exports = (app) => {
  const create = (patient) => app.db('patients').insert(patient, '*');
  return { create };
};
