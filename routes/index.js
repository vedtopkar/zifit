var express = require('express');
var router = express.Router();
var util = require('util');
var spawn = require('child_process').spawn;

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
    console.log('boop');
    var command = spawn('./cas-offinder', ['input.txt', 'G', 'out.txt'], { cwd: './analysis/cas-offinder-master'});

    command.stdout.on('data', function(data){
        res.write(data);
    });

    command.stderr.on('data', function(data){
        console.log('stderr: ' + data);
    });

    command.on('exit', function(code){
        if(code !== 0)
            res.write('child process exited with code: ' + code);
        res.end();
    });


});

module.exports = router;
