/**
* User.js
*/

module.exports = {
  tableName: 'users',
  attributes: {
    id: {
      type: 'integer',
      unique: true,
      primaryKey: true
    },
    name: {
      type: 'string'
    },
    password: {
      type: 'string',
      required: true
    },
    email: {
      type: 'email',
      unique: true,
      required: true
    }
  },
  // generateToken: function(user_id, cb){
//     User.find({id: user_id}).exec(function(err, user){
//       if(err) return res.serverError("[p] 123");
//       if(!user) return res.serverError("[p] User not found");
//       var token = user.email + "-" + user.password; // extra smart
//       User.update({id: user_id}, {token: token}, function(err, data){
//         if(err) return res.serverError("[p] 124");
//         cb(token);
//       })
//     });
//   }
};

