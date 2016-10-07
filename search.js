var fs = require('fs');

// global structures
var pairs = {};
var queue = []; // stores nodes to visit
var visited = {};
var sentenceSpecification;
var counter = 0;
var highest = {
  sentence: '',
  probability: 0
};

main();

function main() {
  var file = fs.readFileSync('./input.txt', {
    encoding: 'utf-8'
  });
  var result = generate('hans', ['NNP', 'VBD', 'DT', 'NN'], file);

  // console.log(result);
  console.log(counter);
  console.log(highest);
}

function buildPairsTable(graph) {
  graph
    .split('\n')
    .forEach((line) => {
      var tokens = line.split('/');

      if (pairs[tokens[0]]) {
        pairs[tokens[0]].edges.push({
          word: tokens[3],
          type: tokens[4],
          probability: tokens[6]
        });
      } else {
        pairs[tokens[0]] = {
          type: tokens[1],
          edges: [{
            word: tokens[3],
            type: tokens[4],
            probability: tokens[6]
          }]
        };
      }
    });
}

function generate(startingWord, sentenceSpec, graph) {
  sentenceSpecification = sentenceSpec;
  buildPairsTable(graph);
  buildGraph(startingWord, graph);
}

function buildGraph(startingWord, graph) {
  var startNode = {
    word: startingWord,
    type: pairs[startingWord].type,
    sequence: [{
      word: startingWord,
      type: pairs[startingWord].type
    }],
    probability: 1.0,
    edges: []
  };

  queue.push(startNode);

  while (queue.length) {
    var node = queue.shift(); // dequeue
    var pair = pairs[node.word];
    ++counter;

    if (isValidSentence(node.sequence) && node.probability > highest.probability) {
      highest.sentence = node.sequence.map((token) => token.word).join(' ');
      highest.probability = node.probability;
    }

    if (pair) {
      for (var edge of pair.edges) {
        var seq = node.sequence.concat({
          word: edge.word,
          type: edge.type
        });

        if (mayFormValidSentence(seq)) {
          queue.push({
            word: edge.word,
            type: edge.type,
            sequence: seq,
            probability: node.probability * edge.probability
          })
        }
      }
    } else {
      // last word
    }
  }
}

// function createNodeFromPair(pair) {
//   return {
//
//   };
// }

function addWordToSequence(s, word, partOfSpeech, probability) {

}

function duplicateSequence(s) {

}

function isValidSentence(s) {
  if (s.length !== sentenceSpecification.length) {
    return false;
  }

  var spec = s.map(token => token.type);

  for (var i=0; i<sentenceSpecification.length; ++i) {
    if (spec[i] !== sentenceSpecification[i]) {
      return false;
    }
  }

  return true;
}

function mayFormValidSentence(s) {
  if (s.length > sentenceSpecification.length) {
    return false;
  }

  var spec = s.map(token => token.type);

  for (var i=0; i<s.length; ++i) {
    if (spec[i] !== sentenceSpecification[i]) {
      return false;
    }
  }

  return true;
}
