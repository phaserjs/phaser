var Class = require('../../utils/Class');
var File = require('../File');
var GetFastValue = require('../../utils/object/GetFastValue');
var GetURL = require('../GetURL');

//  Phaser.Loader.FileTypes.HTML5AudioFile

var HTML5AudioFile = new Class({

    Extends: File,

    initialize:

        function HTML5AudioFile (key, url, path, config, touchLocked)
        {
            this.touchLocked = touchLocked;

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

    onLoad: function ()
    {
        this.callback(this, true);
    },

    onError: function (event)
    {
        for (var i = 0; i < this.data.length; i++)
        {
            var audio = this.data[i];
            audio.oncanplaythrough = null;
            audio.onerror = null;
        }

        this.callback(this, false);
    },

    onProgress: function (event)
    {
        var audio = event.target;
        audio.oncanplaythrough = null;
        audio.onerror = null;

        if(++this.filesLoaded === this.filesTotal)
        {
            this.onLoad();
        }

        this.percentComplete = Math.min((this.filesLoaded / this.filesTotal), 1);
    },

    //  Called by the Loader, starts the actual file downloading
    load: function (callback, baseURL)
    {
        this.callback = callback;

        this.data = [];

        var instances = (this.config && this.config.instances) || 1;

        this.filesTotal = instances;
        this.filesLoaded = 0;
        this.percentComplete = 0;

        for(var i = 0; i < instances; i++)
        {
            var audio = new Audio();
            audio.dataset.name = this.key + ('0' + i).slice(-2); // Useful for debugging
            audio.dataset.used = 'false';

            if (!this.touchLocked)
            {
                audio.preload = 'auto';
                audio.oncanplaythrough = this.onProgress.bind(this);
                audio.onerror = this.onError.bind(this);
            }

            this.data.push(audio);
        }

        for (i = 0; i < this.data.length; i++)
        {
            audio = this.data[i];
            audio.src = GetURL(this, baseURL || '');

            if (!this.touchLocked)
            {
                audio.load();
            }
        }

        if (this.touchLocked)
        {
            setTimeout(function ()
            {
                this.filesLoaded = this.filesTotal;
                this.percentComplete = 1;
                this.onLoad();

            }.bind(this));
        }
    }

});

module.exports = HTML5AudioFile;
