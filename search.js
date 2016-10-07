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

  var result = generate('benjamin', ['NNP','VBD','DT','NN'], 'BREADTH_FIRST', file);
  console.log(result);

  result = generate('a', ['DT','NN','VBD','NNP'], 'BREADTH_FIRST', file);
  console.log(result);

  result = generate('benjamin', ['NNP','VBD','DT','JJS','NN'], 'BREADTH_FIRST', file);
  console.log(result);

  result = generate('a', ['DT','NN','VBD','NNP','IN','DT','NN'], 'BREADTH_FIRST', file);
  console.log(result);

  var result = generate('benjamin', ['NNP','VBD','DT','NN'], 'DEPTH_FIRST', file);
  console.log(result);

  result = generate('a', ['DT','NN','VBD','NNP'], 'DEPTH_FIRST', file);
  console.log(result);

  result = generate('benjamin', ['NNP','VBD','DT','JJS','NN'], 'DEPTH_FIRST', file);
  console.log(result);

  result = generate('a', ['DT','NN','VBD','NNP','IN','DT','NN'], 'DEPTH_FIRST', file);
  console.log(result);

  var result = generate('benjamin', ['NNP','VBD','DT','NN'], 'HEURISTIC', file);
  console.log(result);

  result = generate('a', ['DT','NN','VBD','NNP'], 'HEURISTIC', file);
  console.log(result);

  result = generate('benjamin', ['NNP','VBD','DT','JJS','NN'], 'HEURISTIC', file);
  console.log(result);

  result = generate('a', ['DT','NN','VBD','NNP','IN','DT','NN'], 'HEURISTIC', file);
  console.log(result);
}

function buildPairsTable(graph) {
  graph
    .split('\n')
    .forEach((line) => {
      var tokens = line.split('/');

      if (pairs[tokens[0]]) {
        pairs[tokens[0]].edges.push({
          firstType: tokens[1],
          word: tokens[3],
          edgeType: tokens[4],
          probability: tokens[6]
        });
      } else {
        pairs[tokens[0]] = {
          edges: [{
            firstType: tokens[1],
            word: tokens[3],
            edgeType: tokens[4],
            probability: tokens[6]
          }]
        };
      }
    });
}

function generate(startingWord, sentenceSpec, searchStrategy, graph) {
  sentenceSpecification = sentenceSpec;
  buildPairsTable(graph);
  traverse(startingWord, graph, searchStrategy);

  var result = `"${highest.sentence}" with probability ${highest.probability}\nTotal nodes considered: ${counter}`;

  reset();

  return result;
}

function traverse(startingWord, graph, searchStrategy) {
  var startNode = {
    word: startingWord,
    type: sentenceSpecification[0],
    sequence: [{
      word: startingWord,
      type: sentenceSpecification[0]
    }],
    probability: 1.0,
    edges: []
  };

  queue.push(startNode);

  while (queue.length) {
    var node;
    if (searchStrategy === 'DEPTH_FIRST' || searchStrategy === 'HEURISTIC') {
      node = queue.pop();
    } else if (searchStrategy === 'BREADTH_FIRST') {
      node = queue.shift(); // dequeue
    }
    var pair = pairs[node.word];
    ++counter;

    if (isValidSentence(node.sequence) && node.probability > highest.probability) {
      highest.sentence = node.sequence.map((token) => token.word).join(' ');
      highest.probability = node.probability;
    }

    if (pair) {
      if (searchStrategy === 'HEURISTIC') {
        var scores = pair.edges.map((edge) => {
          var seq = addWordToSequence(node.sequence, edge.word, edge.edgeType);

          if (edge.firstType === node.sequence[node.sequence.length - 1].type && mayFormValidSentence(seq) && (node.probability * edge.probability > highest.probability)) {
            return {
              edge: {
                word: edge.word,
                type: edge.edgeType,
                sequence: seq,
                probability: node.probability * edge.probability
              },
              score: edge.probability
            };
          } else {
            return null;
          }
        })
        .filter(score => !!score)
        .sort((a, b) => { // sort in decreasing order
          if (a.score < b.score) {
            return 1;
          }
          if (a.score > b.score) {
            return -1;
          }
          return 0;
        });

        for (var score of scores) {
          queue.push(score.edge); // push highest score into stack first
        }
      } else {
        for (var edge of pair.edges) {
          if (edge.firstType !== node.sequence[node.sequence.length - 1].type) { // skip if first of pair is not of same type as last word in sequence
            continue;
          }

          var seq = addWordToSequence(node.sequence, edge.word, edge.edgeType);

          if (mayFormValidSentence(seq) && (node.probability * edge.probability > highest.probability)) {
            queue.push({
              word: edge.word,
              type: edge.edgeType,
              sequence: seq,
              probability: node.probability * edge.probability
            })
          }
        }
      }

    } else {
      // last word
    }
  }
}

function addWordToSequence(s, word, partOfSpeech) {
  return s.concat({
    word: word,
    type: partOfSpeech
  });
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

function reset() {
  pairs = {};
  queue = []; // stores nodes to visit
  visited = {};
  sentenceSpecification;
  counter = 0;
  highest = {
    sentence: '',
    probability: 0
  };
}
