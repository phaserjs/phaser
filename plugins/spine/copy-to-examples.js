var fs = require('fs-extra');

var source = './plugins/spine/dist/SpinePlugin.js';
var sourceMap = './plugins/spine/dist/SpinePlugin.js.map';
var dest = '../phaser3-examples/public/plugins/SpinePlugin.js';
var destMap = '../phaser3-examples/public/plugins/SpinePlugin.js.map';

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
