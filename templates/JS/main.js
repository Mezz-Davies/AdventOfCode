const fs = require('fs');
const path = require('path');
const fileContents = fs.readFileSync(path.resolve(__dirname, 'input.txt'));
console.log(fileContents);