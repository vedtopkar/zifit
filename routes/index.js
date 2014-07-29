var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Zifit' });
});

/* GET intro page. */
router.get('/introduction', function(req, res){
    res.render('introduction', {});
});

/* GET docs page. */
router.get('/docs', function(req, res){
    res.render('docs', {});
});

/* GET funding page. */
router.get('/funding', function(req, res){
    res.render('funding', {});
});



/* GET nuclease tool page. */
router.get('/nuclease', function(req, res){
    res.render('nuclease', {});
});

/* POST nuclease tool page. */
router.post('/nuclease', function(req, res){
    console.log('test');
    console.log(req.body);
    res.send('Successfully POSTed');
});

module.exports = router;
