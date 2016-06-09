const mongoose = require('mongoose');
const schema = mongoose.Schema;
const ObjectId = mongoose.Schema.Types.ObjectId;

const orderSchema = schema({
  owner_Id: ObjectId,
  owner_userName: String,
  agent_Id: ObjectId,
  agent_userName: String,
  hint: String,
  details: String,
  awaiting: {
    type: Boolean,
    default: false,
  },
  delivered: {
    type: Boolean,
    default: false,
  },
  deliveryTime: String,
  dateCreated: {
    type: Date,
    default: Date.now,
  },
});

const Orders = mongoose.model('Orders', orderSchema);

module.exports = {
  Orders,
};
