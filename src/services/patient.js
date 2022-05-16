module.exports = (app) => {
  const findAll = () => app.db('patients').select();

  const find = (filter = {}) => app.db('patients').where(filter).first();

  const create = (patient) => app.db('patients').insert(patient, '*');

  const update = (id, patient) =>
    app.db('patients').where({ id }).update(patient, '*');

  const remove = (id) => app.db('patients').where({ id }).del();

  return {
    findAll,
    find,
    create,
    update,
    remove,
  };
};
