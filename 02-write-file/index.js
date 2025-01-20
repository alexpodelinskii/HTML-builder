const readline = require('readline');
const fs = require('fs');
const process = require('process');
const path = require('path');

const rl = readline.createInterface(process.stdin, process.stdout);
const writeStream = fs.createWriteStream(path.join(__dirname, 'text.txt'));

function question() {
  rl.question('What do you want to write in text.txt file? \n', answer => {
    if (answer !== 'exit') {
      writeStream.write(answer + '\n');
      question();
    } else {
      rl.close()
    }
  })
}

rl.on('close', () => process.stdout.write('See you later, bye'));

process.on('SIGINT', () => stdin = 'exit');

question();