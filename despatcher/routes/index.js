var express = require('express');
var router = express.Router();

router.get('/ping', function (req, res, next) {
  res.json({ message: 'pong' });
});

router.get('/doom', function (req, res, next) {
  next(new Error("boom"))
});

module.exports = router;
