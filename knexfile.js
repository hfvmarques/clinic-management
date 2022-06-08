module.exports = {
  test: {
    client: 'pg',
    version: '9.6',
    connection: {
      host: 'localhost',
      user: 'postgres',
      password: 'postgres',
      database: 'clinic_management',
    },
    migrations: { directory: './src/migrations' },
    seeds: { directory: './src/seeds' },
  },
};
