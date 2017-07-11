var Class = require('../../utils/Class');
var CONST = require('../const');
var File = require('../File');

//  Phaser.Loader.FileTypes.ScriptFile

var ScriptFile = new Class({

    Extends: File,

    initialize:

    function ScriptFile (key, url, path, xhrSettings)
    {
        var fileConfig = {
            type: 'script',
            extension: 'js',
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

        this.data = document.createElement('script');
        this.data.language = 'javascript';
        this.data.type = 'text/javascript';
        this.data.defer = false;
        this.data.text = this.xhrLoader.responseText;

        document.head.appendChild(this.data);

        this.onComplete();

        callback(this);
    }

});

module.exports = ScriptFile;
