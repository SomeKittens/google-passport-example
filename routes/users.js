var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res) {
  if (!req.user) {
    // They aren't authenticated
    return res.redirect('/');
  }
  res.json(req.user);
});

module.exports = router;
