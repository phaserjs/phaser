var fs = require('fs-extra');

var source = './dist/phaser.js';
var dest = '../../phaser3-examples/public/js/phaser.js';

fs.copy(source, dest, function (err) {

    if (err)
    {
        return console.error(err);
    }

    console.log('Copied to ' + dest);

});
