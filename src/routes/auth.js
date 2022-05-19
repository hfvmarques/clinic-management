const express = require('express');
const jwt = require('jwt-simple');
const bcrypt = require('bcrypt');
const ValidationError = require('../errors/ValidationError');

const secret = 'Secret!';

module.exports = (app) => {
  const router = express.Router();

  router.post('/signin', (req, res, next) => {
    app.services.user
      .find({ email: req.body.email })
      .then((user) => {
        if (!user) {
          throw new ValidationError('Invalid email or password.');
        } else if (bcrypt.compareSync(req.body.password, user.password)) {
          const payload = {
            id: user.id,
            name: user.name,
            email: user.email,
          };
          const token = jwt.encode(payload, secret);

          res.status(200).json({ token });
        } else {
          throw new ValidationError('Invalid email or password.');
        }
      })
      .catch((err) => next(err));
  });

  router.post('/signup', (req, res, next) => {
    app.services.user
      .create(req.body)
      .then((result) => res.status(201).json(result[0]))
      .catch((err) => next(err));
  });

  return router;
};
