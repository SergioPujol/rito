// Initializes the `ritos` service on path `/ritos`
const { Ritos } = require('./ritos.class');
const createModel = require('../../models/ritos.model');
const hooks = require('./ritos.hooks');

module.exports = function (app) {
  const options = {
    Model: createModel(app),
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/ritos', new Ritos(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('ritos');

  service.hooks(hooks);
};
