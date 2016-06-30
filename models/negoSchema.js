const mongoose = require('mongoose');
const schema = mongoose.Schema;
const ObjectId = mongoose.Schema.Types.ObjectId;

const negoSchema = schema({
  Order_Id: ObjectId,
  owner_Id: ObjectId,
  owner_userName: String,
  reciever_Id: ObjectId,
  reciever_userName: String,
  agent_Id: ObjectId,
  agent_userName: String,
  dateCreated: {
    type: Date,
    default: Date.now,
  },
});

const Negos = mongoose.model('Negos', negoSchema);

module.exports = {
  Negos,
};
