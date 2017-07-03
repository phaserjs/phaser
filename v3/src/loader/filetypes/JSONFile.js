var Class = require('../../utils/Class');
var CONST = require('../const');
var File = require('../File');

//  Phaser.Loader.FileTypes.JSONFile

var JSONFile = new Class({

    Extends: File,

    initialize:

    function JSONFile (key, url, path, xhrSettings)
    {
        if (path === undefined) { path = ''; }

        if (!key)
        {
            throw new Error('Error calling \'Loader.json\' invalid key provided.');
        }

        if (!url)
        {
            url = path + key + '.json';
        }
        else
        {
            url = path.concat(url);
        }

        File.call(this, 'json', key, url, 'text', xhrSettings);
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
