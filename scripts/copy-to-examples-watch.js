let fs = require('fs-extra');

let source = './build/phaser.js';
let sourceMap = './build/phaser.js.map';
let dest = '../examples/public/build/dev.js';
let destDir = '../examples/public/build/';
let destMap = '../examples/public/build/phaser.js.map';

if (fs.existsSync(destDir))
{
    fs.copy(sourceMap, destMap, function (err) {

        if (err)
        {
            return console.error(err);
        }

    });

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
    console.log('Copy-to-Examples failed: Phaser Examples not present at ../examples');
}
