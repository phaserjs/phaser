var Class = require('../../utils/Class');
var CONST = require('../const');
var File = require('../File');

//  Phaser.Loader.FileTypes.BinaryFile

var BinaryFile = new Class({

    Extends: File,

    initialize:

    function BinaryFile (key, url, path, xhrSettings)
    {
        if (path === undefined) { path = ''; }

        if (!key)
        {
            throw new Error('Error calling \'Loader.binary\' invalid key provided.');
        }

        if (!url)
        {
            url = path + key + '.bin';
        }
        else
        {
            url = path.concat(url);
        }

        File.call(this, 'binary', key, url, 'arraybuffer', xhrSettings);
    },

    onProcess: function (callback)
    {
        this.state = CONST.FILE_PROCESSING;

        this.data = this.xhrLoader.response;

        this.onComplete();

        callback(this);
    }

});

module.exports = BinaryFile;
