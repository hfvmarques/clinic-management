const app = require('express')();

app.get('/', (req, res) => {
  res.status(200).send('Hello World!');
});

module.exports = app;
