// import dateFormat from 'dateformat';
var dateFormat = require('dateformat');

var ts_hms=dateFormat(new Date(), "yyyy-mm-dd h:MM:ss");
console.log(ts_hms);