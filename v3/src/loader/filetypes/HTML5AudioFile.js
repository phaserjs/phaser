var Class = require('../../utils/Class');
var File = require('../File');
var GetFastValue = require('../../utils/object/GetFastValue');
var GetURL = require('../GetURL');

//  Phaser.Loader.FileTypes.HTML5AudioFile

var HTML5AudioFile = new Class({

    Extends: File,

    initialize:

        function HTML5AudioFile (key, url, path, config)
        {
            var fileConfig = {
                type: 'audio',
                extension: GetFastValue(url, 'type', ''),
                key: key,
                url: GetFastValue(url, 'uri', url),
                path: path,
                config: config
            };

            File.call(this, fileConfig);
        },

    //  Called by the Loader, starts the actual file downloading
    load: function (callback, baseURL)
    {
        this.callback = callback;

        this.data = [];

        var instances = (this.config && this.config.instances) || 1;

        for(var i = 0; i < instances; i++)
        {
            var audio = new Audio();
            audio.name = this.key;
            audio.preload = 'auto';
            audio.src = GetURL(this, baseURL || '');
            audio.load();

            this.data.push(audio);
        }
    }

});

module.exports = HTML5AudioFile;
