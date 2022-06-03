const express = require('express');

module.exports = (app) => {
  const router = express.Router();

  router.get('/', (req, res) => {
    app.services.patient
      .findAll()
      .then((result) => res.status(200).json(result));
  });

  router.post('/', (req, res, next) => {
    app.services.patient
      .create(req.body)
      .then((result) => res.status(201).json(result[0]))
      .catch((err) => next(err));
  });

  router.get('/:id', (req, res, next) => {
    app.services.patient
      .find({ id: req.params.id })
      .then((result) => res.status(200).json(result))
      .catch((err) => next(err));
  });

  router.put('/:id', (req, res, next) => {
    app.services.patient
      .update(req.params.id, req.body)
      .then((result) => res.status(200).json(result[0]))
      .catch((err) => next(err));
  });

  router.delete('/:id', (req, res, next) => {
    app.services.patient
      .remove(req.params.id)
      .then(() => res.status(204).send())
      .catch((err) => next(err));
  });

  router.get('/:id/phones', (req, res, next) => {
    app.services.patient_phone
      .find(req.params.id)
      .then((result) => res.status(200).json(result))
      .catch((err) => next(err));
  });

  router.post('/:id/phones', (req, res, next) => {
    app.services.patient_phone
      .create(req.body)
      .then((result) => res.status(201).json(result[0]))
      .catch((err) => next(err));
  });

  router.get('/:id/phones/:phoneId', (req, res, next) => {
    app.services.patient_phone
      .findById(req.params.id, req.params.phoneId)
      .then((result) => res.status(200).json(result))
      .catch((err) => next(err));
  });

  router.put('/:id/phones/:phoneId', (req, res, next) => {
    app.services.patient_phone
      .update(req.params.id, req.params.phoneId, req.body)
      .then((result) => res.status(200).json(result[0]))
      .catch((err) => next(err));
  });

  router.delete('/:id/phones/:phoneId', (req, res, next) => {
    app.services.patient_phone
      .remove(req.params.id, req.params.phoneId)
      .then(() => res.status(204).send())
      .catch((err) => next(err));
  });

  router.get('/:id/addresses', (req, res, next) => {
    app.services.patient_address
      .find(req.params.id)
      .then((result) => res.status(200).json(result))
      .catch((err) => next(err));
  });

  router.post('/:id/addresses', (req, res, next) => {
    app.services.patient_address
      .create(req.body)
      .then((result) => res.status(201).json(result[0]))
      .catch((err) => next(err));
  });

  router.get('/:id/addresses/:addressId', (req, res, next) => {
    app.services.patient_address
      .findById(req.params.id, req.params.addressId)
      .then((result) => res.status(200).json(result))
      .catch((err) => next(err));
  });

  router.put('/:id/addresses/:addressId', (req, res, next) => {
    app.services.patient_address
      .update(req.params.id, req.params.addressId, req.body)
      .then((result) => res.status(200).json(result[0]))
      .catch((err) => next(err));
  });

  router.delete('/:id/addresses/:addressId', (req, res, next) => {
    app.services.patient_address
      .remove(req.params.id, req.params.addressId)
      .then(() => res.status(204).send())
      .catch((err) => next(err));
  });

  return router;
};
