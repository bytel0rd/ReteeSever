const mongoose = require('mongoose');
const schema = mongoose.Schema;
const ObjectId = mongoose.Schema.Types.ObjectId;

const orderSchema = schema({
  owner_Id: ObjectId,
  owner_userName: String,
  reciever_UserName: String,
  reciever_Id: ObjectId,
  agent_Id: ObjectId,
  agent_userName: String,
  hint: String,
  details: String,
  userSetCode: ObjectId,
  deliveryCodeId: String,
  awaiting: {
    type: Boolean,
    default: false,
  },
  delivered: {
    type: Boolean,
    default: false,
  },
  agentDelivered: {
    type: Boolean,
    default: false,
  },
  visible: {
    type: Boolean,
    default: true,
  },
  deliveryTime: String,
  dateCreated: {
    type: Date,
    default: Date.now,
  },
  canceled: {
    type: Boolean,
    default: false,
  },
  canceledBy: ObjectId,
});

const Orders = mongoose.model('Orders', orderSchema);

module.exports = {
  Orders,
};
