const express = require('express');

module.exports = (app) => {
  const router = express.Router();

  const validate = (req, res, next) => {
    app.services.user
      .validate(req.body)
      .then(() => next())
      .catch((err) => next(err));
  };

  router.get('/', (req, res, next) =>
    app.services.user
      .findAll()
      .then((result) => res.status(200).json(result))
      .catch((err) => next(err))
  );

  router.post('/', validate, async (req, res, next) => {
    try {
      const result = await app.services.user.create(req.body);

      return res.status(201).json(result[0]);
    } catch (err) {
      return next(err);
    }
  });

  return router;
};
