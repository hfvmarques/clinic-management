module.exports = (app) => {
  const create = (req, res) => {
    app.services.patient
      .create(req.body)
      .then((result) => res.status(201).json(result[0]));
  };

  return { create };
};
