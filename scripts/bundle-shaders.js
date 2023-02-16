let fs = require('fs-extra');

let srcdir = './src/renderer/webgl/shaders/src/';
let destdir = './src/renderer/webgl/shaders/';

let files = fs.readdirSync(srcdir);

let index = `/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2013-2023 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * @namespace Phaser.Renderer.WebGL.Shaders
 */

module.exports = {

`;

files.forEach(function (file, c) {

    let shaderSource = fs.readFileSync(srcdir + file, 'utf8');
    let type = file.substr(-4);
    let shaderFilename = file.substr(0, file.lastIndexOf('.')) + '-' + type + '.js';

    let outputSource = 'module.exports = [\n';

    let lines = shaderSource.split('\n');

    for (var i = 0; i < lines.length; i++)
    {
        let line = lines[i].trimRight();

        if (line == '' || line.trimStart().startsWith('//'))
        {
            continue;
        }

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

    let inc = file.substr(0, file.lastIndexOf('.'));

    if (file.substr(-4) === 'frag')
    {
        inc = inc.concat('Frag');
    }
    else
    {
        inc = inc.concat('Vert');
    }

    index = index.concat(`    ${inc}: require('./${shaderFilename}')`);

    if (c < files.length - 1)
    {
        index = index.concat(',\n');
    }

});

index = index.concat(`

};
`);

fs.writeFile(destdir + 'index.js', index, function (error) {

    if (error)
    {
        throw error;
    }
    else
    {
        console.log('Index Saved');
    }

});
