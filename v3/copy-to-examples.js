var fs = require('fs-extra');

var source = './dist/phaser.js';
var dest = '../../phaser3-examples/public/build/dev.js';

if (fs.existsSync(dest))
{
    fs.copy(source, dest, function (err) {

        if (err)
        {
            return console.error(err);
        }

        console.log('Build copied to ' + dest);

    });
}
else
{
    console.log('Copy-to-Examples failed: Phaser 3 Examples not present at ../../phaser3-examples');
}
