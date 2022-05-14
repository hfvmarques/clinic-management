module.exports = (app) => {
  const findAll = (filter = {}) => app.db('users').where(filter).select();

  const create = async (user) => {
    if (!user.name) return { error: 'Name is required.' };
    if (!user.email) return { error: 'Email is required.' };
    if (!user.password) return { error: 'Password is required.' };

    const existingUser = await findAll({ email: user.email });

    if (existingUser && existingUser.length > 0) {
      return { error: 'Email already exists.' };
    }

    return app.db('users').insert(user, '*');
  };

  return { findAll, create };
};
