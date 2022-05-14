const app = require('express')();
const consign = require('consign');
const knex = require('knex');
const knexfile = require('../knexfile');

app.db = knex(knexfile.test);

consign({ cwd: 'src', verbose: false })
  .include('./config/middleware.js')
  .then('./routes')
  .then('./config/routes.js')
  .into(app);

app.get('/', (req, res) => {
  res.status(200).send('Hello World!');
});

// app.db.on('query', (query) => {
//   console.log({
//     sql: query.sql,
//     bindings: query.bindings ? query.bindings : '',
//   });
// });

module.exports = app;
