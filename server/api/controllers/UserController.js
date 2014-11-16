/**
 * UserController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
  blueprints:{
    actions: true,
    rest: false,
    shortcuts: false
  },
  login: function (req, res) {
    return res.send("Hi there!");
  }
};

