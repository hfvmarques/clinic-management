module.exports = (app) => {
  app.route('/auth/signin').post(app.routes.auth.signIn);
  app.route('/auth/signup').post(app.routes.auth.signUp);

  app
    .route('/users')
    .all(app.config.passport.authenticate())
    .get(app.routes.users.findAll)
    .post(app.routes.users.create);

  app
    .route('/patients')
    .all(app.config.passport.authenticate())
    .get(app.routes.patients.findAll)
    .post(app.routes.patients.create);

  app
    .route('/patients/:id')
    .all(app.config.passport.authenticate())
    .get(app.routes.patients.findById)
    .put(app.routes.patients.update)
    .delete(app.routes.patients.remove);
};
