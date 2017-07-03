var Class = require('../../utils/Class');
var CONST = require('../const');
var File = require('../File');

//  Phaser.Loader.FileTypes.GLSLFile

var GLSLFile = new Class({

    Extends: File,

    initialize:

    function GLSLFile (key, url, path, xhrSettings)
    {
        if (path === undefined) { path = ''; }

        if (!key)
        {
            throw new Error('Error calling \'Loader.glsl\' invalid key provided.');
        }

        if (!url)
        {
            url = path + key + '.glsl';
        }
        else
        {
            url = path.concat(url);
        }

        File.call(this, 'glsl', key, url, 'text', xhrSettings);
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
