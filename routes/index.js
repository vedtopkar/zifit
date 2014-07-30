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
    console.log(req.body);
    var options = req.body.options;
    var seq = req.body.target_sequence;
    var PAM_sequence = req.body.PAM_sequence;
    var gRNA_length = req.body.gRNA_length;

    seq = seq.replace(/(\r\n|\n|\r)/gm,"").toUpperCase();

    console.log(seq, gRNA_length, PAM_sequence);

    if(!seqIsValidSeq(seq)){
        res.send({error: true, message: 'Invalid sequence. :('});
    }
    var results = JSON.stringify(findCandiateSequences(seq, gRNA_length, PAM_sequence));
    results.error = false;
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
    var regex = generateMixedBaseRegex(PAM);
    var match;
    var results = [];
    var currentStrand = '+';

    while((match = regex.exec(seq))){
        var matchSeq = seq.substring(match.index - length + PAM.length, match.index + PAM.length);
        if(match.index > (length - PAM.length)){
            results.push({index: match.index, seq: matchSeq, strand: currentStrand});
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

    // Strip out the candidates that don't meet some criteria
    results = filterForLeadingG(results);

    return results;
}

function generateMixedBaseRegex(seq){
    var length = seq.length;
    var regexString = '';
    for(var i = 0; i < length; i++){
        if(allowedSeqCharacters.indexOf(seq[i]) < 0){
            var block;
            switch(seq[i]){
                case 'B':
                    block = '[CGT]';
                    break;
                case 'D':
                    block = '[AGT]';
                    break;
                case 'H':
                    block = '[ACT]';
                    break;
                case 'V':
                    block = '[ACG]';
                    break;
                case 'R':
                    block = '[AG]';
                    break;
                case 'Y':
                    block = '[CT]';
                    break;
                case 'M':
                    block = '[GT]';
                    break;
                case 'S':
                    block = '[AC]';
                    break;
                case 'W':
                    block = '[AT]';
                    break;
                case 'N':
                    block = '[ATCG]';
                    break;
            }
            regexString += block;
        }else{
            regexString += seq[i];
        }
    }
    return new RegExp(regexString, 'g');
}

// Takes an array of sequence objects and returns an array of sequence objects that satisfy
// the criteria of having a leading G
function filterForLeadingG(seqs){
    var length = seqs.length;
    var results = [];
    for(var i = 0; i < length; i++){
        if(seqs[i].seq[0] == 'G'){
            results.push(seqs[i]);
        }
    }
    return results;
}

var allowedSeqCharacters = ['A', 'T', 'G', 'C'];

function seqIsValidSeq(seq){
    var length = seq.length;
    for(var i = 0; i < length; i++){
        if(allowedSeqCharacters.indexOf(seq[i]) < 0){
            return false;
        }
    }
    return true;
}

var reverseComplementReference = {'A': 'T', 'T': 'A', 'G': 'C', 'C': 'G'};

function reverseComplement(seq){
    var result = '';
    var length = seq.length;
    for(var i = length - 1; i > 0; i--){
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
