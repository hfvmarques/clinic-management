module.exports = (app) => {
  app
    .route('/users')
    .get(app.routes.users.findAll)
    .post(app.routes.users.create);

  app.route('/patients').post(app.routes.patients.create);
};
