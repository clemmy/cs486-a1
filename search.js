var fs = require('fs');

// global structures
var pairs = {};

main();

function main() {
  var file = fs.readFileSync('./input.txt', {
    encoding: 'utf-8'
  });
  var result = generate('hans', ['NNP', 'VBD', 'DT', 'NN'], file);

  // console.log(result);
}

function buildPairsTable(graph) {
  graph
    .split('\n')
    .forEach((line) => {
      var tokens = line.split('/');

      if (pairs[tokens[0]]) {
        pairs[tokens[0]].edges.push({
          word: tokens[3],
          wordType: tokens[4],
          probability: tokens[6]
        });
      } else {
        pairs[tokens[0]] = {
          type: tokens[1],
          edges: [{
            word: tokens[3],
            wordType: tokens[4],
            probability: tokens[6]
          }]
        };
      }
    });
}

function generate(startingWord, sentenceSpec, graph) {
  buildPairsTable(graph);
  buildGraph(startingWord, graph);
}

function buildGraph(startingWord, graph) {
  console.log(pairs);
  var startNode = {
    sequence: [startingWord],
    word: startingWord,
    probability: 1.0,
    visited: false,
    edges: []
  };

  build(startNode, graph, startingWord);
}

function build(node, graph, word) {
  // var filtered = lines.filter(function(line) {
  //   return line.startsWith(word+'/');
  // });
  // stick this into a global maybe

  // for () { // word in lines
  //   node.edges.push({
  //
  //   });
  // }


  // console.log(filtered);
}

function addWordToSequence(s, word, partOfSpeech, probability) {

}

function duplicateSequence(s) {

}

function isValidSentence(s) {

}

function mayFormValidSentence(s, sentenceSpec) {

}

// what should Sequence structure look like?
