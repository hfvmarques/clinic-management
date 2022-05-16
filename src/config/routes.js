module.exports = (app) => {
  app
    .route('/users')
    .get(app.routes.users.findAll)
    .post(app.routes.users.create);

  app
    .route('/patients')
    .get(app.routes.patients.findAll)
    .post(app.routes.patients.create);

  app
    .route('/patients/:id')
    .get(app.routes.patients.findById)
    .put(app.routes.patients.update);
};
