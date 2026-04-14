const fs = require('fs');

const data1 = require('./data1.js');
const data2 = require('./data2.js');
const data3 = require('./data3.js');
const data4 = require('./data4.js');
const data5 = require('./data5.js');

// The files actually just write to dataX.json, but they don't export.
// Let's rewrite combine.js to just read the data directly.
