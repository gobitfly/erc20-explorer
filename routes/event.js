var express = require('express');
var router = express.Router();

router.get('/:event', function(req, res, next) {
  var db = req.app.get('db');
  
  db.find({_id: req.params.event}).exec(function (err, event) {
    
    if (err) {
      return next(err);
    }
    
    if (event.length === 0 || !event[0]._id) {
      return next({message: "Event not found!"});
    }

    res.render('event', { event: event[0] });
  });

});

module.exports = router;
