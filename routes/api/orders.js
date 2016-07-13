const express = require('express');
// a sub-authetication router is created
const router = new express.Router();

// importinng the converted UserModel from the schema
const Users = require('./../../models/userSchema.js').Users;
const Orders = require('./../../models/orderShema.js').Orders;
const Negos = require('./../../models/negoSchema.js').Negos;

// models\orderShema.js
// "/orders" route allows only a GET request,
// which returns a json object which returns the array
//  of orders for the sending individual
//        awaiting: true,

router
  .route('/orders')
  .get((req, res) => {
    const currentUserId = req.session.passport.user;
    Orders.find({
      $or: [{
        owner_Id: currentUserId,
      }, {
        reciever_Id: currentUserId,
      }, {
        agent_Id: currentUserId,
      }],
      // visible: true,
      canceled: false,
      delivered: false,
    }, (err, order) => {
      if (order) {
        return res.status(200).json(order);
      }
      return res.status(204).json(err);
    });
  });

// "/orders/:id" @{:id} is used as an url
// identifier to locate  a particular order
// that has been created but not delivered
// to the user who created it.
// a json response is sent with the order  for
//  the GET request and a PUT request  responds
//   with the newly updated order
router
  .route('/orders/:id')
  .get((req, res) => {
    Orders.findOne({
      _id: req.params.id,
      delivered: false,
    }, (err, order) => {
      if (order) {
        return res.status(200).json(order);
      }
      return res.status(204).json(err);
    });
  })
  .put((req, res) => {
    Orders.findOneAndUpdate({
      _id: req.params.id,
      delivered: false,
    }, {
      $set: req.body,
    }, (err, order) => {
      if (order) {
        return res.status(200).json(order);
      }
      return res.status(204).json(err);
    });
  });


// "/deliveries" route allows only a GET request,
// which returns a json object which returns the array
//  of orders for the sending individual order
//  or deliveries made by the individual
router
  .route('/deliveries')
  .get((req, res) => {
    const currentUserId = req.session.passport.user;
    Orders.find({
      $or: [{
        owner_Id: currentUserId,
      }, {
        reciever_Id: currentUserId,
      }, {
        agent_Id: currentUserId,
      }],
      delivered: true,
    }, (err, order) => {
      if (order) {
        return res.status(200).json(order);
      }
      return res.status(204).json(err);
    });
  });

// "/deliveries/:id" @{:id} is used as an url
// identifier to locate  a particular order
// that has been created and delivered
// to the user who created it.
// a json response is sent with the order  for
//  the GET request and a PUT request  responds
//   with the newly updated order
router
  .route('/deliveries/:id')
  .get((req, res) => {
    Orders.findOne({
      _id: req.params.id,
      delivered: true,
    }, (err, order) => {
      if (order) {
        return res.status(200).json(order);
      }
      return res.status(204).json(err);
    });
  })
  .put((req, res) => {
    Orders.findOneAndUpdate({
      _id: req.params.id,
      delivered: true,
    }, {
      $set: req.body,
    }, (err, order) => {
      if (order) {
        return res.status(200).json(order);
      }
      return res.status(204).json(err);
    });
  });

// a get request is made from the client for
// an order in the delivery feed and the the
// feed is sent back for the request made
router.get('/itemDetail/:id', (req, res) => {
  Orders.findOne({
    _id: req.params.id,
  }, (err, order) => {
    if (err) {
      res.status(204).json(err);
    }
    res.status(200).json(order);
  });
});

// a post request is made to confirm an order as an agent.
// by updateing the Orders and inputing the agentID from the session
router
  .route('/acceptOrder')
  .post((req, res) => {
    Users.findOne({
      _id: req.session.passport.user,
    }, (err, user) => {
      if (err) {
        return res.status(204).json({
          errMgs: 'user  not found',
        });
      }
      return checkAgentStatus(user);
    });


    function checkAgentStatus(user) {
      if (!user) {
        return res.status(204).json({
          errMgs: 'user  not found',
        });
      }
      if (!user.profile.isAgent) {
        return res.status(204).json({
          errMgs: 'user  not found',
        });
      }
      return authorizeOrder(user);
    }

    function authorizeOrder(user) {
      Orders.findOneAndUpdate({
        _id: req.body.orderId,
      }, {
        $set: {
          awaiting: true,
          agent_Id: req.session.passport.user,
          agent_userName: user.profile.userName,
        },
      }, {
        new: true,
        sort: {
          dateCreated: -1,
        },
      }, (err, Order) => {
        if (err) {
          res.status(304).json({
            errCode: 'DbErr1',
            mgs: 'orderAcceptanced Failed',
            err,
          });
        }
        return createNego(Order);
      });
    }

    // creates a Negotiaiton between the Order's
    // owner and the agent responding.
    function createNego(Order) {
      const nego = new Negos({
        Order_Id: Order._id,
        owner_Id: Order.owner_Id,
        owner_userName: Order.owner_userName,
        agent_Id: Order.agent_Id,
        agent_userName: Order.agent_userName,
        reciever_Id: Order.reciever_Id,
        reciever_userName: Order.reciever_userName,
      });
      nego.save((err) => {
        if (err) {
          return res.status(304).json({
            errCode: 'DbErr1',
            mgs: 'orderAcceptanced Failed',
            err,
          });
        }
        return res.status(200).json({
          mgs: 'Order Accepted',
          Order,
        });
      });
    }
  });

// returns every negotation's in which
// the currently login in user is engaged
// in currently.
router.get('/negotiations', (req, res) => {
  const currentUserId = req.session.passport.user; //  new ObjectId();
  Negos.find({
    $or: [{
      owner_Id: currentUserId,
    }, {
      reciever_Id: currentUserId,
    }, {
      agent_Id: currentUserId,
    }],
  }, (err, nego) => {
    if (err) {
      return res.status(200).json({
        mgs: 'error from database',
      });
    }
    return res.status(200).json(nego);
  });
});

router.get('/negotiations/:id', (req, res) => {
  Negos.findOne({
    _id: req.params.id,
  }, (err, nego) => {
    if (err) {
      return res.status(304).json(err);
    }
    return res.status(200).json(nego);
  });
});

router.post('/cancelOrder', (req, res) => {
  Orders.findOneAndUpdate({
    _id: req.body.orderId,
    delivered: false,
  }, {
    $set: {
      canceledBy: req.session.passport.user,
      canceled: true,
      visible: false,
    },
  }, {
    new: true,
  }, (err, order) => {
    if (order) {
      return res.status(200).json(order);
    }
    return res.status(204).json(err);
  });
});

router.post('/confirmOrder', (req, res) => {
  Orders.findOneAndUpdate({
    _id: req.body.orderId,
  }, {
    $set: {
      delivered: true,
      agentDelivered: true,
      userSetCode: req.session.passport.user,
      deliveryTime: Date.now(),
    },
  }, {
    new: true,
  }, (err, order) => {
    if (err) {
      res.status(401).json({
        errMgs: 'err from database',
      });
    }
    res.status(200).json(order);
  });
});

module.exports = router;
