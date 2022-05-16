module.exports = (app) => {
  const create = (req, res) => {
    app.services.patient
      .create(req.body)
      .then((result) => res.status(201).json(result[0]));
  };

  const findAll = (req, res) => {
    app.services.patient
      .findAll()
      .then((result) => res.status(200).json(result));
  };

  const findById = (req, res) => {
    app.services.patient
      .find({ id: req.params.id })
      .then((result) => res.status(200).json(result));
  };

  return { findAll, findById, create };
};
