var fs = require('fs-extra');

var source = './plugins/spine/dist/';
var dest = '../phaser3-examples/public/plugins/';

if (fs.existsSync(dest))
{
    fs.copySync(source, dest, { overwrite: true });
}
else
{
    console.log('Copy-to-Examples failed: Phaser 3 Examples not present at ../phaser3-examples');
}
