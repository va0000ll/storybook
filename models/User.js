let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let UserSchema = new Schema({
  googleID: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  firstName: {
    type: String
  },
  lastName: {
    type: String
  },
  image: {
    type: String
  }
});
const User = mongoose.model('users', UserSchema);
module.exports = User;
