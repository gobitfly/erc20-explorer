var express = require('express');
var router = express.Router();

router.post('/', function(req, res, next) {
	var searchString = req.body.search.trim().toLowerCase();
	
  if (searchString.length > 22 && searchString.substr(0,2) != '0x')
    searchString = '0x' + searchString;
    
	if (searchString.length === 2) {
		return next({ message: "Error: Invalid search string!" });
	} else {
		res.redirect('/account/' + searchString);
	}
});

module.exports = router;