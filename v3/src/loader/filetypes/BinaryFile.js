var Class = require('../../utils/Class');
var CONST = require('../const');
var File = require('../File');

//  Phaser.Loader.FileTypes.BinaryFile

var BinaryFile = new Class({

    Extends: File,

    initialize:

    function BinaryFile (key, url, path, xhrSettings)
    {
        var fileConfig = {
            type: 'binary',
            extension: 'bin',
            responseType: 'arraybuffer',
            key: key,
            url: url,
            path: path,
            xhrSettings: xhrSettings
        };

        File.call(this, fileConfig);
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
