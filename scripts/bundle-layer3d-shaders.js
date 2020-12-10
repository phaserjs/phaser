let fs = require('fs-extra');

let srcdir = './src/layer3d/shaders/chunks/glsl/';
let destdir = './src/layer3d/shaders/chunks/';

let files = fs.readdirSync(srcdir);

files.forEach(function (file) {

    let shaderSource = fs.readFileSync(srcdir + file, 'utf8');
    let shaderFilename = file.substr(0, file.lastIndexOf('.')) + '.js';

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
