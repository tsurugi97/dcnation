const path = require('path');
const filename = process.argv[2];
const parsedLevelNumbers = [];
const parsedXPNumbers = [];
var Promise = require('bluebird');

const lineReader = require('readline').createInterface({
  input: require('fs').createReadStream(path.join(__dirname, filename))
});

let levelCounter = 0;
let xpCounter = 0;

const add = (a, b) => a + b;

lineReader.on('line', (line) => {
  const parsedLevelExpressions = /LVL?\s?(\d+)/g.exec(line.toUpperCase());
  const parsedXPExpressions = /(\d+)\s?XP/g.exec(line.toUpperCase());
  if (parsedLevelExpressions && parsedLevelExpressions[1]) {
    parsedLevelNumbers[levelCounter++] = parseInt(parsedLevelExpressions[1]);
  }
  if (parsedXPExpressions && parsedXPExpressions[1]) {
    parsedXPNumbers[xpCounter++] = parseInt(parsedXPExpressions[1]);
  }
});

lineReader.on('close', () => {
  calculateXPForAllLevels(parsedLevelNumbers, parsedXPNumbers).then(totalXPArray => {
    console.log(totalXPArray);
    console.log(totalXPArray.reduce(add));
  });
});

function calculateXPForAllLevels(levels, xpNumbers) {
  return Promise.map(levels, (level, index) => {
    return calculateXPForLevel(level, xpNumbers[index]);
  });
}

function calculateXPForLevel(level, xpForLevel) {
  return new Promise((resolve, reject) => {
    let totalXPForLevel = 0;
    let tempLevel = 1;
    while(tempLevel <= level) {
      totalXPForLevel += tempLevel*xpForLevel;
      tempLevel++;
    }
    resolve(totalXPForLevel);
  });
}
