var fs = require('fs-extra');

var source = './plugins/spine/dist/';
var dest = '../phaser3-examples/public/plugins/3.8.95/';

if (fs.existsSync(dest))
{
    fs.copySync(source, dest, { overwrite: true });
}
else
{
    console.log('Copy-to-Examples failed: Phaser 3 Examples not present at ../phaser3-examples');
}

dest = '../100-phaser3-snippets/public/libs/';

if (fs.existsSync(dest))
{
    fs.copySync(source, dest, { overwrite: true });
}
