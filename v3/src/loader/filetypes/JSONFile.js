var Class = require('../../utils/Class');
var CONST = require('../const');
var File = require('../File');

//  Phaser.Loader.FileTypes.JSONFile

var JSONFile = new Class({

    Extends: File,

    initialize:

    function JSONFile (key, url, path, xhrSettings)
    {
        var fileConfig = {
            type: 'json',
            extension: 'json',
            responseType: 'text',
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

        this.data = JSON.parse(this.xhrLoader.responseText);

        this.onComplete();

        callback(this);
    }

});

module.exports = JSONFile;
