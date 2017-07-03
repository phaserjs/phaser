var Class = require('../../utils/Class');
var CONST = require('../const');
var File = require('../File');

//  Phaser.Loader.FileTypes.TextFile

var TextFile = new Class({

    Extends: File,

    initialize:

    function TextFile (key, url, path, xhrSettings)
    {
        if (path === undefined) { path = ''; }

        if (!key)
        {
            throw new Error('Error calling \'Loader.txt\' invalid key provided.');
        }

        if (!url)
        {
            url = path + key + '.txt';
        }
        else
        {
            url = path.concat(url);
        }

        File.call(this, 'txt', key, url, 'text', xhrSettings);
    },

    onProcess: function (callback)
    {
        this.state = CONST.FILE_PROCESSING;

        this.data = this.xhrLoader.responseText;

        this.onComplete();

        callback(this);
    }

});

module.exports = TextFile;
