var express = require('express');
var router = express.Router();
var util = require('util');
var spawn = require('child_process').spawn;
var fs = require('fs');

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
    var seq = req.body.seq.replace(/(\r\n|\n|\r)/gm,"").toUpperCase();
    var results = JSON.stringify(findCandiateSequences(seq, req.body.length, req.body.PAM.toUpperCase()));
    res.send(results);

    // OFF-SITE CODE DOWN BELOW
    // var command = spawn('./cas-offinder', ['input.txt', 'G', 'out.txt'], { cwd: './analysis/cas-offinder-master'});

    // command.stdout.on('data', function(data){
    //     res.write(data);
    // });

    // command.stderr.on('data', function(data){
    //     console.log('stderr: ' + data);
    // });

    // command.on('exit', function(code){
    //     if(code !== 0)
    //         res.write('child process exited with code: ' + code);
    //     res.end();
    // });


});


// Takes a sequence, the desired length of the candidates,
// and the PAM sequence, and returns an array of start indices.
function findCandiateSequences(seq, length, PAM){
    var regex = new RegExp(PAM, "g");
    var match;
    var results = [];
    var currentStrand = '+';

    while((match = regex.exec(seq))){
        if(match.index > (length - PAM.length)){
            results.push({index: match.index, seq: seq.substring(match.index - length + PAM.length, match.index + PAM.length), strand: currentStrand});
        }
    }

    console.log(seq);
    seq = reverseComplement(seq);
    currentStrand = '-';
    console.log(seq);

    while((match = regex.exec(seq))){
        if(match.index > (length - PAM.length)){
            results.push({index: match.index, seq: seq.substring(match.index - length + PAM.length, match.index + PAM.length), strand: currentStrand});
        }
    }

    return results;
}

var reverseComplementReference = {'A': 'T', 'T': 'A', 'G': 'C', 'C': 'G'};

function reverseComplement(seq){
    var result = '';
    var length = seq.length;
    for(var i = length; i > 0; i--){
        result += reverseComplementReference[seq[i]];
    }
    return result;
}

// function generateInFile(postData){
//     var seq = postData.seq;
//     var genomePath = './analysis/data/genomes/' + postData.genome;
//     var PAM = postData.PAM;
//     var jobID = 1;
//     var fileContent = genomePath + '\n' + 

//     fs.writeFileSync('./analysis/data/jobs/' + jobID + '_in.txt' + '\n'
//                    + )

//     return true;
// }

module.exports = router;
