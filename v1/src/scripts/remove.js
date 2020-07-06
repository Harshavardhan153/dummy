const removeFile = require('find-remove');
const path = require('path');

let days = 1;//if days = 0, yesterdays and older files will be deleted;
             // if days = 1, day before yesterdays and older files will be deleted
             //and so on ...

let seconds = days*24*3600;

const date = new Date();

//add seconds of this day to seconds so that no files created today are deleted . 
seconds += (date.getHours())*3600;
seconds += (date.getMinutes())*60;
seconds += (date.getSeconds());

console.log(seconds);

const result = removeFile(path.join(__dirname,'../public/request'), {age: {seconds: seconds}, extensions: '.json'});

console.log(result);
