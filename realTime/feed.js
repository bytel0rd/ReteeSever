const Orders = require('./../models/orderShema.js').Orders;

function getCurrentFeedList() {
  return 'connetcd mr abey';
}
// {
//   sort: {
//     dateCreated: -1,
//   },
//   limit: 15,
// }
//

module.exports = function realtimeFeed(io) {
  console.log('branching io');
  io.on('connection', (socket) => {
    // on connection the server sends a
    // limited feedList of already created
    //  orders to the feed

    Orders.find({
      awaiting: false,
      delivered: false,
    }, '_id hint details owner_userName agent_userName deliveryTime', {
      sort: {
        dateCreated: -1,
      },
      limit: 5,
    }, (err, order) => {
      if (!err) {
        socket.emit('clientReceiveOrders', order);
      }
    });

    // if the sever recieves an Order, the server
    //  first validate the new Order if it's
    //  valid then saves it else should send
    //  a report to the order owner the pending
    //   error during validation.
    //   a callback is made in which returns
    //   the data or error for the client
    socket.on('serverReceiveOrder', (data, callback) => {
      const saveData = new Orders(data);
      saveData.save((err) => {
        if (err) {
          callback({
            err,
          }, undefined);
          // TODO: notify the Creator of the error
        } else {
          callback(undefined, {
            saveData,
          });
          // sends back the order to the generic
          //  feed after succesfull validation
          io.sockets.emit('clientReceiveNewOrder', saveData);
        }
      });
    });
  });
};
