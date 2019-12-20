var express = require('express');
var router = express.Router();
let exec = require('child_process').exec;
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/test', function(req, res, next) {
  let number = req.query.number;
  let description = req.query.description;

  res.send(number + ' '+ description);

  console.log(number);

  exec(number, function(err, stdout, stderr){
    console.log(stdout);
    console.log(stderr);
  })

  console.log(number + ' '+ description)
});

module.exports = router;
