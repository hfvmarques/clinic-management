const app = require('express')();

app.get('/', (req, res) => {
  res.status(200).send('Hello World!');
});

app.get('/users', (req, res) => {
  const users = [{ name: 'John Doe', email: 'john@doe.com' }];
  res.status(200).json(users);
});

module.exports = app;
