// https://github.com/jonschlinkert/extract-comments
// https://github.com/eslint/doctrine
// https://nodejs.org/api/fs.html
// https://github.com/jprichardson/node-fs-extra

var fs = require('fs-extra');
var extract = require('extract-comments');
var beautify = require('json-beautify');
var doctrine = require('doctrine');

var source = './src/gameobjects/GameObject.js';
var dest = './docs/comments.json';

var doctrineOptions = {
    unwrap: true,
    recoverable: true,
    sloppy: true,
    lineNumbers: true
};

fs.readFile(source, 'utf8', (err, data) => {

    if (err)
    {
        throw err;
    }

    var comments = [];
    var blocks = extract.block(data);

    for (var i = 0; i < blocks.length; i++)
    {
        var block = blocks[i];

        comments.push(doctrine.parse(block.value, doctrineOptions));
    }

    // comments = JSON.stringify(comments);
    comments = beautify(comments, null, 2, 100); // just for debugging really

    fs.writeFile(dest, comments, { encoding: 'utf8', flag: 'w' }, function (error) {

        if (error)
        {
            throw error;
        }
        else
        {
            console.log('Comments written');
        }

    });

});
