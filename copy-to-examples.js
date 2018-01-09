let fs = require('fs-extra');
let sloc = require('node-sloc');

let source = './dist/phaser.js';
let dest = '../phaser3-examples/public/build/dev.js';

if (fs.existsSync(dest))
{
    fs.copy(source, dest, function (err) {

        if (err)
        {
            return console.error(err);
        }

        console.log('Build copied to ' + dest);

        const options = {
            path: './src',
            extensions: [ '.js' ]
        };
 
        sloc(options).then((res) => {
            console.log('Source files: ' + res.sloc.files + '\nLines of code: ' + res.sloc.sloc);
        });

    });
}
else
{
    console.log('Copy-to-Examples failed: Phaser 3 Examples not present at ../phaser3-examples');
}
