const Promise = require('bluebird');
const mongoose = Promise.promisifyAll(require('mongoose'));
const Schema = mongoose.Schema;


// creating a schema which show the validation of userbiodata
// which takes email, password, fullName,imgurl has strings
// phoneNo has a Number
const Userschema = new Schema({
  email: {
    type: String,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  profile: {
    fullName: {
      type: String,
      required: true,
    },
    phoneNo: {
      type: Number,
      required: true,
    },
    userName: {
      type: String,
      unique: true,
      required: true,
    },
    customerId: {
      type: String,
      unique: true,
      required: true,
    },
    isAgent: {
      type: Boolean,
      required: true,
      default: false,
    },
    awaitingAgentAuth: {
      type: Boolean,
      default: false,
    },
    address: {
      street: String,
      town: String,
      state: String,
    },
    imgUrl: String,
    idCardUrl: String,
  },
});

Userschema.set('toObject', { virtuals: true });
// converts the usershema to a user model
const Users = mongoose.model('Users', Userschema);

// exporting the model has Users
module.exports = {
  Users,
};
