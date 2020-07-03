const removeFile = require('find-remove');
const path = require('path');

const result = removeFile(path.join(__dirname,'../public/request'), {age: {seconds: 60}, extensions: '.json'});

console.log(result);
console.log(path.join(__dirname, '../public/request'));
