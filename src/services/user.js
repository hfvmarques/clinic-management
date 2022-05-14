module.exports = (app) => {
  const findAll = () => app.db('users').select();
  const create = (user) => app.db('users').insert(user, '*');

  return { findAll, create };
};
