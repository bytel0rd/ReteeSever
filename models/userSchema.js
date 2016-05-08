var mongoose = require('mongoose');
var schema = mongoose.Schema;
var ObjectId = mongoose.Schema.Types.ObjectId;


// creating a schema which show the validation of userbiodata
// which takes email, password, fullName,imgurl has strings
// phoneNo has a Number
var Userschema = new schema({
  email: {
    type: String,
    unique: true,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  profile:{
    fullName: {type: String, required: true},
    phoneNo:{ type: Number, required: true},
    customerId:{type: String, unique: true ,required: true},
    imgUrl: String
  }
});


// converts the usershema to a user model
var Users = mongoose.model('Users', Userschema);

// exporting the model has Users
module.exports = {
  Users: Users
};
