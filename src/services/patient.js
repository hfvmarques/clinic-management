module.exports = (app) => {
  const findAll = () => app.db('patients').select();

  const find = (filter = {}) => app.db('patients').where(filter).first();

  const create = async (patient) => {
    if (!patient.name) return { error: 'Name is required.' };
    if (!patient.cpf) return { error: 'CPF is required.' };
    if (!patient.email) return { error: 'Email is required.' };
    if (!patient.birthDate) return { error: 'Birth date is required.' };
    if (!patient.gender) return { error: 'Gender is required.' };

    const existingCpf = await find({ cpf: patient.cpf });
    const existingEmail = await find({ email: patient.email });

    if (existingCpf) return { error: 'CPF already registered.' };
    if (existingEmail) return { error: 'Email already registered.' };

    return app.db('patients').insert(patient, '*');
  };

  const update = (id, patient) =>
    app.db('patients').where({ id }).update(patient, '*');

  const remove = (id) => app.db('patients').where({ id }).del();

  return {
    findAll,
    find,
    create,
    update,
    remove,
  };
};
