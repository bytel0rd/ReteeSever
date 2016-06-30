const mongoose = require('mongoose');
const schema = mongoose.Schema;
const ObjectId = mongoose.Schema.Types.ObjectId;

const chatSchema = schema({
  Nego_Id: ObjectId,
  From: ObjectId,
  To: [ObjectId],
  Mgs: String,
  dateCreated: {
    type: Date,
    default: Date.now,
  },
});

const Chats = mongoose.model('Chats', chatSchema);

module.exports = {
  Chats,
};
