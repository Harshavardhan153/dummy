const removeFile = require('find-remove');
const path = require('path');

let seconds = 0;

const date = new Date();

console.log(date.getTime);

seconds += (date.getHours())*3600;
seconds += (date.getMinutes())*60;
seconds += (date.getSeconds());

console.log(seconds);

const result = removeFile(path.join(__dirname,'../public/request'), {age: {seconds: seconds}, extensions: '.json'});

console.log(result);
console.log(path.join(__dirname, '../public/request'));
