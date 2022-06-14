const bcrypt = require('bcrypt');

const ValidationError = require('../errors/ValidationError');

module.exports = (app) => {
  const getPasswordHash = (password) => {
    const salt = bcrypt.genSaltSync(10);

    return bcrypt.hashSync(password, salt);
  };

  const findAll = () => app.db('users').select(['id', 'name', 'email']);

  const find = (filter = {}) => app.db('users').where(filter).first();

  const create = async (user) => {
    const existingUser = await find({ email: user.email });

    if (existingUser) throw new ValidationError('Email already exists.');

    const newUser = { ...user };
    newUser.password = getPasswordHash(user.password);
    return app.db('users').insert(newUser, ['id', 'name', 'email']);
  };

  const validate = async (user) => {
    if (!user.name) throw new ValidationError('Name is required.');
    if (!user.email) throw new ValidationError('Email is required.');
    if (!user.password) throw new ValidationError('Password is required.');
  };

  return {
    findAll,
    find,
    create,
    validate,
  };
};
