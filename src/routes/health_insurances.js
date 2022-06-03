const express = require('express');

module.exports = (app) => {
  const router = express.Router();

  router.get('/', (req, res) => {
    app.services.health_insurance
      .findAll()
      .then((result) => res.status(200).json(result));
  });

  router.get('/:id', (req, res, next) => {
    app.services.health_insurance
      .find({ id: req.params.id })
      .then((result) => res.status(200).json(result))
      .catch((err) => next(err));
  });

  router.post('/', (req, res, next) => {
    app.services.health_insurance
      .create(req.body)
      .then((result) => res.status(201).json(result[0]))
      .catch((err) => next(err));
  });

  router.put('/:id', (req, res, next) => {
    app.services.health_insurance
      .update(req.params.id, req.body)
      .then((result) => res.status(200).json(result[0]))
      .catch((err) => next(err));
  });

  router.delete('/:id', (req, res, next) => {
    app.services.health_insurance
      .remove(req.params.id)
      .then(() => res.status(204).send())
      .catch((err) => next(err));
  });

  return router;
};
