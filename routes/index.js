var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  var db = req.app.get('db');
  
  db.find({}).sort({ timestamp: -1 }).limit(10).exec(function (err, events) {    
    res.render('index', { events: events });
  });

});

module.exports = router;
