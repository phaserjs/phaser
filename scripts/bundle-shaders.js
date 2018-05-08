let fs = require('fs-extra');

/*
BitmapMask.frag
BitmapMask.vert
DeferredDiffuse.frag
DeferredDiffuse.vert
FlatTint.frag
FlatTint.vert
ForwardDiffuse.frag
GBuffer.frag
TextureTint.frag
TextureTint.vert
*/

let srcdir = './src/renderer/webgl/shaders/src/';
let destdir = './src/renderer/webgl/shaders/';

let files = fs.readdirSync(srcdir);

files.forEach(function (file) {

    let shaderSource = fs.readFileSync(srcdir + file, 'utf8');
    let type = file.substr(-4);
    let shaderFilename = file.substr(0, file.lastIndexOf('.')) + '-' + type + '.js';

    let outputSource = 'module.exports = [\n';

    let lines = shaderSource.split('\n');

    for (var i = 0; i < lines.length; i++)
    {
        let line = lines[i].trimRight();

        if (i < lines.length - 1)
        {
            outputSource = outputSource.concat("    '" + line + "',\n");
        }
        else
        {
            outputSource = outputSource.concat("    '" + line + "'\n");
        }
    }

    outputSource = outputSource.concat('].join(\'\\n\');\n');

    fs.writeFile(destdir + shaderFilename, outputSource, function (error) {

        if (error)
        {
            throw error;
        }
        else
        {
            console.log('Saved', shaderFilename);
        }

    });

});
