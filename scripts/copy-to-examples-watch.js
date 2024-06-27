let fs = require('fs-extra');

let source = './build/phaser.js';
let sourceMap = './build/phaser.js.map';
let dest = '../phaser3-examples/public/build/dev.js';
let destDir = '../phaser3-examples/public/build/';
let destMap = '../phaser3-examples/public/build/phaser.js.map';
let dest2 = '../examples/public/build/dev.js';
let dest2Dir = '../examples/public/build/';
let dest2Map = '../examples/public/build/phaser.js.map';

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
else if (fs.existsSync(dest2Dir))
{
    fs.copy(sourceMap, dest2Map, function (err) {

        if (err)
        {
            return console.error(err);
        }

    });

    fs.copy(source, dest2, function (err) {

        if (err)
        {
            return console.error(err);
        }

        console.log('Build copied to ' + dest2);

    });
}
else
{
    console.log('Copy-to-Examples failed: Phaser 3 Examples not present at ../phaser3-examples or ../examples');
}
