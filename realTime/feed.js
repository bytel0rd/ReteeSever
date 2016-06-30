const Orders = require('./../models/orderShema.js').Orders;
const Users = require('./../models/userSchema.js').Users;
// {
//   sort: {
//     dateCreated: -1,
//   },
//   limit: 15,
// }


module.exports = function realtimeFeed(io) {
  console.log('branching io');
  const currentUserIds = {};

  io.on('connection', (socket) => {
    // creating an object to store all currently socket
    // objects connected to the server setting and creating
    // socketObj for private Object.
    socket.on('addUser', (data) => {
      // names the connected user socket to the userId
      // and stores it in the global object.
      // if (currentUserIds[data.userId]) {
      //   return null;
      // }
      // socket.nickName = data.userId;
      // socket.id = data.userId;
      currentUserIds[data.userId] = socket.id;
      return null;
    });
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
      // checks if the username exists in the database

      Users.findOne({
        'profile.userName': data.reciever_UserName,
      }, (userErr, user) => {
        // console.log(user);
        if (!user || userErr) {
          return callback({
            errMgs: 'Reciever doesn\'t exit',
          }, undefined);
        }
        data.reciever_Id = user._id;
        const saveData = new Orders(data);
        saveData.save((err) => {
          if (err) {
            return callback({
              errMgs: 'invalid dataProvided',
            }, undefined);
          }
          return null;
        });
        // TODO: notify the Creator of the error
        // sends back the order to the generic
        //  feed after succesfull validation
        io.sockets.emit('clientReceiveNewOrder', saveData);
        return callback(undefined, saveData);
      });
    });

    // importing the private chats an negotiations
    require('./negotiation.js')(io, socket, currentUserIds);
  });
};
