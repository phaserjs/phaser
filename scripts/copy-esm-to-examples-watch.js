let fs = require('fs-extra');

let source = './build/phaser.esm.js';
let sourceMap = './build/phaser.esm.js.map';
let dest = '../phaser3-examples/public/build/dev.esm.js';
let destDir = '../phaser3-examples/public/build/';
let destMap = '../phaser3-examples/public/build/phaser.esm.js.map';

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
    console.log('Copy-to-Examples failed: Phaser 3 Examples not present at ../phaser3-examples');
}
