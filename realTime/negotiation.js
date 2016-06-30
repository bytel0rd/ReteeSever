const Chats = require('./../models/mgSchema.js').Chats;
console.log('branching negotation');

module.exports = function negotation(io, socket, Users) {
  // this allows the requesting user alone
  // to recieve the response rather than all
  // the sockets connected.
  socket.on('formerChats', (data, callback) => {
    Chats.find({
      Nego_Id: data.negoId,
    }, (err, chats) => {
      if (err) {
        return callback({
          errMgs: 'error retriving former chat',
        }, undefined);
      }
      return callback(undefined, chats);
    });
  });

  socket.on('sendNegoMgs', (data) => {
    // to disregard empty mgs from the client side
    if (data.Mgs === '') {
      return null;
    }
    const chat = new Chats({
      Nego_Id: data.Nego_Id,
      Mgs: data.Mgs,
      From: data.From,
      To: data.To,
    });
    chat.save((err) => {
      if (err) {
        // TODO: install a logger for logging
        // console.log(err);
        // throw err;
        return null;
      }
      data.To.forEach((id) => {
        const recieverUserId = Users[id];
        const senderUserId = Users[data.From];
        if (!recieverUserId || !senderUserId) {
          return null;
        }
        if (io.sockets.connected[recieverUserId]) {
          return null;
        }
        return io.sockets.connected[recieverUserId].emit('recieveNegoMgs', chat, senderUserId);
      });
      return null;
    });
    return null;
  });
};
