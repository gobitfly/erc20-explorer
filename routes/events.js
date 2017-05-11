var express = require('express');
var router = express.Router();

router.get('/:offset?', function(req, res, next) {
  var db = req.app.get('db');
  
  if (!req.params.offset) {
    req.params.offset = 0;
  } else {
    req.params.offset = parseInt(req.params.offset);
  }

  db.find({ balance: { $exists: false } }).sort({ timestamp: -1 }).skip(req.params.offset).limit(50).exec(function(err, events) {
    res.render('events', {events: events, offset: req.params.offset, stepSize: 50 });
  });

});

module.exports = router;
