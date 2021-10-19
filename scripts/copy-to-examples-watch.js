let fs = require('fs-extra');

let source = './build/phaser.js';
let sourceMap = './build/phaser.js.map';
let dest = '../phaser3-examples/public/build/dev.js';
let destMap = '../phaser3-examples/public/build/phaser.js.map';

if (fs.existsSync(dest))
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
