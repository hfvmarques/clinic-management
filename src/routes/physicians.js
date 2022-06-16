const express = require('express');

module.exports = (app) => {
  const router = express.Router();

  const validatePhysician = (req, res, next) =>
    app.services.physician
      .validate(req.body)
      .then(() => next())
      .catch((err) => next(err));

  router.get('/', (req, res) =>
    app.services.physician
      .findAll()
      .then((result) => res.status(200).json(result))
  );

  router.get('/:id', (req, res) =>
    app.services.physician
      .find({ id: req.params.id })
      .then((result) => res.status(200).json(result[0]))
      .catch((err) => res.status(404).json(err))
  );

  router.post('/', validatePhysician, (req, res, next) =>
    app.services.physician
      .create(req.body)
      .then((result) => res.status(201).json(result[0]))
      .catch((err) => next(err))
  );

  router.put('/:id', validatePhysician, (req, res, next) =>
    app.services.physician
      .update(req.params.id, req.body)
      .then((result) => res.status(200).json(result[0]))
      .catch((err) => next(err))
  );

  router.delete('/:id', (req, res, next) =>
    app.services.physician
      .remove(req.params.id)
      .then(() => res.status(204).send())
      .catch((err) => next(err))
  );

  return router;
};
