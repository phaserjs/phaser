var fs = require('fs-extra');
var uuid = require('uuid');

var v = uuid.v1();

var output = [
    'var CHECKSUM = {',
    'build: \'' + v + '\'',
    '};',
    'module.exports = CHECKSUM;'
];

//  Should output a json file, but webpack2 json-loader is broken
//  at the moment, so we're outputting a js file instead

fs.writeFile('./src/checksum.js', output.join('\n'), function (error) {

    if (error)
    {
        throw error;
    }
    else
    {
        console.log('Building #' + v);
    }

});
