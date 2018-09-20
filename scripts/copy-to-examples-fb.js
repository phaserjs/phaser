let fs = require('fs-extra');

let source = './build/phaser-facebook-instant-games.js';
let sourceMap = './build/phaser-facebook-instant-games.js.map';
let destFolder = '../fbtest1/lib/';
let dest = '../fbtest1/lib/phaser-facebook-instant-games.js';
let destMap = '../fbtest1/lib/phaser-facebook-instant-games.js.map';

if (fs.existsSync(destFolder))
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
