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
  }
};

