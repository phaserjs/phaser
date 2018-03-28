const path = require('path');
const fs = require('fs');
const dom = require('dts-dom');
const parser = require('jsdoc3-parser');
const convert = require('./convert');

const phaserPkgModuleDOM = dom.create.module('phaser');
const phaserClassDOM = dom.create.class('Phaser');
const phaserModuleDOM = dom.create.namespace('Phaser');

const srcPath = path.join('src', 'actions');
const outPath = path.join('types', 'phaser.d.ts');

// Phaser source namespaces.
const phaserSrcNs = [
    'Actions',
    'Animations',
    'Cache',
    'Cameras',
    'Class',
    'Create',
    'Curves',
    'Data',
    'Display',
    'DOM',
    'EventEmitter',
    'Game',
    'GameObjects',
    'Geom',
    'Input',
    'Loader',
    'Math',
    'Physics',
    'Scene',
    'Scenes',
    'Sound',
    'Structs',
    'Textures',
    'Tilemaps',
    'Time',
    'Tweens',
    'Utils'
];

function readPhaserSrc (dir)
{
    return [ path.join('src', 'actions', 'Angle.js') ];

    /* return fs.readdirSync(dir).reduce(function (files, file)
    {
        if (fs.statSync(path.join(dir, file)).isDirectory())
        {
            return files.concat(readPhaserSrc(path.join(dir, file)));
        }
        else
        {
            return files.concat(path.join(dir, file));
        }
    }, []); */
}

function transpile (memberList)
{
    console.log('Converting to Typescript Definitions...');

    readPhaserSrc(srcPath).forEach(function (file)
    {
        parser(file, function (err, ast)
        {
            if (err)
            {
                return console.log(err);
            }

            console.log(`Converting file "${file}"...`);
            convert(phaserModuleDOM, ast, memberList);
        });
    });

    /* parser(srcPath, function (err, ast)
    {
        if (err)
        {
            return console.log(err);
        }

        console.log('Converting to Typescript Definitions...');

        fs.writeFile('typescript/jsdoc.json', JSON.stringify(ast));

        convert(phaserModuleDOM, ast, memberList);
        const domOutput =
            dom.emit(phaserPkgModuleDOM) +
            dom.emit(phaserClassDOM) +
            dom.emit(phaserModuleDOM);

        fs.writeFile(outPath, domOutput, function (err)
        {
            if (err)
            {
                return console.log(err);
            }

            console.log(`File was written to ${outPath}`);
        });
    }); */
}

/**
 * Transpiler
 */
phaserPkgModuleDOM.members.push(dom.create.exportName('Phaser'));

// Create namespace for each src namespace.
const memberList = {};
phaserSrcNs.forEach(function (cls)
{
    const domNs = dom.create.namespace(cls);
    const domClass = dom.create.class(cls, 0);

    phaserModuleDOM.members.push(domNs);
    phaserModuleDOM.members.push(domClass);

    memberList[cls] = { namespace: domNs, class: domClass };
});

readPhaserSrc(srcPath).forEach(function (file)
{
    const pathData = path.parse(file);
    const relPath = pathData.dir.replace('src\\', '').replace(/\\/g, '/');
    const filename = pathData.base.replace('.js', '');

    try
    {
        fs.mkdirSync(`typescript/jsdoc/${relPath}`);
    }
    catch (e) {}

    parser(file, function (err, ast)
    {
        if (err)
        {
            return console.log(err);
        }

        fs.writeFileSync(
            `typescript/jsdoc/${relPath}/${filename}.json`,
            JSON.stringify(ast)
        );
    });
});

transpile(memberList);
