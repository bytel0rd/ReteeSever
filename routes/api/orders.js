const express = require('express');
// a sub-authetication router is created
const router = new express.Router();

const Orders = require('./../../models/orderShema.js').Orders;
// models\orderShema.js
// "/orders" route allows only a GET request,
// which returns a json object which returns the array
//  of orders for the sending individual
router
  .route('/orders')
  .get((req, res) => {
    // console.log(req.session.passport.user);
    Orders.find({
      owner_Id: req.session.passport.user,
      delivered: false,
      awaiting: true,
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
    Orders.find({
      owner_Id: req.session.passport.user,
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
    console.log(req.body);
    if (req.body.isAgent) {
      Orders.findOneAndUpdate({
        _id: req.body.orderId,
      }, {
        $set: {
          delivered: true,
          agentID: req.session.passport.user,
        },
      }, (err, Order) => {
        if (err) {
          res.status(304).json({
            err: 'DbErr1',
            mgs: 'orderAcceptanced Failed',
          }, err);
        }
        res.status(200).json({
          mgs: 'Order Accepted',
        }, Order);

        console.log(err, Order);
      });
    } else {
      console.log('user not Auth');
      res.status(407).json({
        err: 'Auth2',
        mgs: 'invalid authorization request to be an agent',
      });
    }
  });

module.exports = router;
