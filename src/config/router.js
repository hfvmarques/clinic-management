const express = require('express');

module.exports = (app) => {
  app.use('/auth', app.routes.auth);

  const protectedRouter = express.Router();

  protectedRouter.use('/users', app.routes.users);
  protectedRouter.use('/patients', app.routes.patients);

  app.use('/api', app.config.passport.authenticate(), protectedRouter);
};
