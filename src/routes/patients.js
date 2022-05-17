module.exports = (app) => {
  const findAll = (req, res) => {
    app.services.patient
      .findAll()
      .then((result) => res.status(200).json(result));
  };

  const create = async (req, res) => {
    const result = await app.services.patient.create(req.body);

    if (result.error) return res.status(400).json(result);

    return res.status(201).json(result[0]);
  };

  const findById = (req, res) => {
    app.services.patient
      .find({ id: req.params.id })
      .then((result) => res.status(200).json(result));
  };

  const update = (req, res) => {
    app.services.patient
      .update(req.params.id, req.body)
      .then((result) => res.status(200).json(result[0]));
  };

  const remove = (req, res) => {
    app.services.patient
      .remove(req.params.id)
      .then(() => res.status(204).send());
  };

  return {
    findAll,
    findById,
    create,
    update,
    remove,
  };
};
