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
  prod: {
    client: 'pg',
    version: '9.6',
    connection: {
      host: 'localhost',
      user: 'postgres',
      password: 'postgres',
      database: 'prod_clinic_management',
    },
    migrations: { directory: './src/migrations' },
  },
  development: {
    client: 'pg',
    version: '9.6',
    connection: {
      host: 'localhost',
      user: 'postgres',
      password: 'postgres',
      database: 'dev_clinic_management',
    },
    migrations: { directory: './src/migrations' },
  },
};
