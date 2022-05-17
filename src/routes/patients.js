module.exports = (app) => {
  const findAll = (req, res) => {
    app.services.patient
      .findAll()
      .then((result) => res.status(200).json(result));
  };

  const create = (req, res, next) => {
    app.services.patient
      .create(req.body)
      .then((result) => res.status(201).json(result[0]))
      .catch((err) => next(err));
  };

  const findById = (req, res, next) => {
    app.services.patient
      .find({ id: req.params.id })
      .then((result) => res.status(200).json(result))
      .catch((err) => next(err));
  };

  const update = (req, res, next) => {
    app.services.patient
      .update(req.params.id, req.body)
      .then((result) => res.status(200).json(result[0]))
      .catch((err) => next(err));
  };

  const remove = (req, res, next) => {
    app.services.patient
      .remove(req.params.id)
      .then(() => res.status(204).send())
      .catch((err) => next(err));
  };

  return {
    findAll,
    findById,
    create,
    update,
    remove,
  };
};
