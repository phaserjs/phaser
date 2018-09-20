let fs = require('fs-extra');

// let dest = '../phaser3-examples/public/build/dev.js';
// let destMap = '../phaser3-examples/public/build/phaser.js.map';

let source = './build/phaser-facebook-instant-games.js';
let sourceMap = './build/phaser-facebook-instant-games.js.map';
let dest = '../fbtest1/lib/dev.js';
let destMap = '../fbtest1/lib/phaser.js.map';

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
    // console.log('Copy-to-Examples failed: Phaser 3 Examples not present at ../phaser3-examples');
}
