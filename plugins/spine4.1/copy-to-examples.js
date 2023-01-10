var fs = require('fs-extra');

var source = './plugins/spine4.1/dist/';
var dest = '../phaser3-examples/public/plugins/spine4.1/';

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
