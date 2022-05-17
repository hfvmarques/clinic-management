module.exports = (app) => {
  const findAll = () => app.db('users').select();

  const find = (filter = {}) => app.db('users').where(filter).first();

  const create = async (user) => {
    if (!user.name) return { error: 'Name is required.' };
    if (!user.email) return { error: 'Email is required.' };
    if (!user.password) return { error: 'Password is required.' };

    const existingUser = await find({ email: user.email });

    if (existingUser) return { error: 'Email already exists.' };

    return app.db('users').insert(user, '*');
  };

  return { findAll, find, create };
};
