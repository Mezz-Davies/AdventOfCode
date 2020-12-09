const fs = require('fs');
const path = require('path');
const fileContents = fs.readFileSync(path.resolve(__dirname, 'input.txt'), {encoding:'UTF-8'});
console.log(fileContents);