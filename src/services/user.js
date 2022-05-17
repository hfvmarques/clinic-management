const ValidationError = require('../errors/ValidationError');

module.exports = (app) => {
  const findAll = () => app.db('users').select();

  const find = (filter = {}) => app.db('users').where(filter).first();

  const create = async (user) => {
    if (!user.name) throw new ValidationError('Name is required.');
    if (!user.email) throw new ValidationError('Email is required.');
    if (!user.password) throw new ValidationError('Password is required.');

    const existingUser = await find({ email: user.email });

    if (existingUser) throw new ValidationError('Email already exists.');

    return app.db('users').insert(user, '*');
  };

  return { findAll, find, create };
};
