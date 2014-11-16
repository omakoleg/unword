/**
 * UserController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
  _config:{
    actions: true,
    rest: false,
    shortcuts: false
  },
  login: function (req, res) {
    var email = req.param('email');
    var password = req.param('password');
    if(email && password){
      User.find({
        email: email,
        password: password
      }).exec(function(err, data){
        if (err) return res.badRequest("[p] 125");
        if(data && data.email == email){
          res.jsonData(data);
        } else {
          res.jsonError("User not found");
        }
      });
    } else {
      res.jsonError("Required params missing: email, password");
    }
  },
  /*
  - email
  - password - already encoded
  */
  register: function (req, res) {
    var email = req.param('email');
    var password = req.param('password');
    
    if(email && password){
      User.find({email: email}).exec(function(err, data){
        if (err) return res.badRequest(err);
        if(data && data.length > 0){
          res.jsonError("User [email] already used");
        } else {
          User.create({
            email: email,
            password: password
          }).exec(function(err,created){
            if (err) return res.badRequest(err);
            res.jsonData(created);
          });
        }
      });
    } else {
      res.jsonError("Required params missing: email, password");
    }
  }  
};

