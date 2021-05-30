const users = require('./users/users.service.js');
const products = require('./products/products.service.js');
const lists = require('./lists/lists.service.js');
const ritos = require('./ritos/ritos.service.js');
const cart = require('./cart/cart.service.js');
// eslint-disable-next-line no-unused-vars
module.exports = function (app) {
  app.configure(users);
  app.configure(products);
  app.configure(lists);
  app.configure(ritos);
  app.configure(cart);
};
