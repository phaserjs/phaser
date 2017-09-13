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

/*
    //  Example extracted docblock:

  {
    "type": "block",
    "range": [ 1181, 1414 ],
    "loc": { "start": { "line": 37, "column": 8 }, "end": { "line": 42, "column": 11 } },
    "raw": "*\r\n         * A textual representation of this Game Object, i.e. `sprite`.\r\n         * Used internally by Phaser but is available for your own custom classes to populate.\r\n         *\r\n         * @property {string} type\r\n         ",
    "value": "\r\nA textual representation of this Game Object, i.e. `sprite`.\r\nUsed internally by Phaser but is available for your own custom classes to populate.\r\n\r\n@property {string} type",
    "code": {
      "context": {
        "type": "property",
        "receiver": "this",
        "name": "type",
        "value": "type",
        "string": "this.type"
      },
      "value": "this.type = type;\r",
      "line": 44,
      "loc": { "start": { "line": 44, "column": 1424 }, "end": { "line": 44, "column": 1442 } }
    }
  },
*/

    for (var i = 0; i < blocks.length; i++)
    {
        var block = blocks[i];

        comments.push(doctrine.parse(block.value, doctrineOptions));
    }

    // comments = JSON.stringify(comments);
    comments = beautify(comments, null, 2, 100); // just for debugging really
    // comments = beautify(blocks, null, 2, 100); // just for debugging really

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
