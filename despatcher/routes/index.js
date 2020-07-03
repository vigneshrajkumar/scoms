const express = require('express');
const router = express.Router();
const amqp = require('amqplib/callback_api')

router.get('/ping', function (req, res, next) {
  res.json({ message: 'pong' });
});

router.post('/email', function (req, res, next) {

  if (!req.body.message || req.body.message.length < 10 || !req.body.recepients || req.body.recepients.length === 0) {
    console.log("rejecting", req.body)
    res.status(400).json({ status: "rejected" })
  }

  amqp.connect(process.env.RMQ_CXN || "amqp://guest:guest@localhost:5672", (err, cxn) => {
    if (err) { next(err) }

    cxn.createChannel((err, ch) => {
      if (err) { next(err) }

      req.body.recepients.map(r => {
        let jr = new Object()
        jr.recepient = r
        jr.message = req.body.message
        let jsonString = JSON.stringify(jr)
        ch.sendToQueue("email", Buffer.from(jsonString))
        console.log("email despatch:", jsonString)
      })
      
      res.json({ status: "queued" })

    })
  })

});

router.get('/doom', function (req, res, next) {
  next(new Error("boom"))
});

module.exports = router;
