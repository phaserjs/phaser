var Class = require('../../utils/Class');
var CONST = require('../const');
var File = require('../File');

//  Phaser.Loader.FileTypes.GLSLFile

var GLSLFile = new Class({

    Extends: File,

    initialize:

    function GLSLFile (key, url, path, xhrSettings)
    {
        var fileConfig = {
            type: 'glsl',
            extension: 'glsl',
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

        this.data = this.xhrLoader.responseText;

        this.onComplete();

        callback(this);
    }

});

module.exports = GLSLFile;
