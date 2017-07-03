var Class = require('../../utils/Class');
var CONST = require('../const');
var File = require('../File');
var ParseXML = require('../../dom/ParseXML');

//  Phaser.Loader.FileTypes.XMLFile

var XMLFile = new Class({

    Extends: File,

    initialize:

    function XMLFile (key, url, path, xhrSettings)
    {
        var fileConfig = {
            type: 'xml',
            extension: 'xml',
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

        this.data = ParseXML(this.xhrLoader.responseText);

        if (this.data === null)
        {
            throw new Error('XMLFile: Invalid XML');
        }

        this.onComplete();

        callback(this);
    }

});

module.exports = XMLFile;
