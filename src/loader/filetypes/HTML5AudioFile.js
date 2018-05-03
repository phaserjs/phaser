/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

var Class = require('../../utils/Class');
var File = require('../File');
var GetFastValue = require('../../utils/object/GetFastValue');
var GetURL = require('../GetURL');
var IsPlainObject = require('../../utils/object/IsPlainObject');

/**
 * @classdesc
 * [description]
 *
 * @class HTML5AudioFile
 * @extends Phaser.Loader.File
 * @memberOf Phaser.Loader.FileTypes
 * @constructor
 * @since 3.0.0
 *
 * @param {string} key - [description]
 * @param {string} url - [description]
 * @param {string} path - [description]
 * @param {XHRSettingsObject} [config] - [description]
 */
var HTML5AudioFile = new Class({

    Extends: File,

    initialize:

    function HTML5AudioFile (loader, key, urlConfig, audioConfig)
    {
        if (IsPlainObject(key))
        {
            var config = key;

            key = GetFastValue(config, 'key');
            audioConfig = GetFastValue(config, 'config', audioConfig);
        }

        var fileConfig = {
            type: 'audio',
            cache: loader.cacheManager.audio,
            extension: urlConfig.type,
            key: key,
            url: urlConfig.url,
            config: audioConfig
        };

        File.call(this, loader, fileConfig);

        //  New properties specific to this class
        this.locked = 'ontouchstart' in window;
        this.loaded = false;
        this.filesLoaded = 0;
        this.filesTotal = 0;
    },

    onLoad: function ()
    {
        if (this.loaded)
        {
            return;
        }

        this.loaded = true;

        this.loader.nextFile(this, true);
    },

    onError: function ()
    {
        for (var i = 0; i < this.data.length; i++)
        {
            var audio = this.data[i];

            audio.oncanplaythrough = null;
            audio.onerror = null;
        }

        this.loader.nextFile(this, false);
    },

    onProgress: function (event)
    {
        var audio = event.target;

        audio.oncanplaythrough = null;
        audio.onerror = null;

        this.filesLoaded++;

        this.percentComplete = Math.min((this.filesLoaded / this.filesTotal), 1);

        this.loader.emit('fileprogress', this, this.percentComplete);

        if (this.filesLoaded === this.filesTotal)
        {
            this.onLoad();
        }
    },

    //  Called by the Loader, starts the actual file downloading
    load: function ()
    {
        this.data = [];

        var instances = (this.config && this.config.instances) || 1;

        this.filesTotal = instances;
        this.filesLoaded = 0;
        this.percentComplete = 0;

        for (var i = 0; i < instances; i++)
        {
            var audio = new Audio();

            audio.dataset.name = this.key + ('0' + i).slice(-2);
            audio.dataset.used = 'false';

            if (this.locked)
            {
                audio.dataset.locked = 'true';
            }
            else
            {
                audio.dataset.locked = 'false';

                audio.preload = 'auto';
                audio.oncanplaythrough = this.onProgress.bind(this);
                audio.onerror = this.onError.bind(this);
            }

            this.data.push(audio);
        }

        for (i = 0; i < this.data.length; i++)
        {
            audio = this.data[i];
            audio.src = GetURL(this, this.loader.baseURL);

            if (!this.locked)
            {
                audio.load();
            }
        }

        if (this.locked)
        {
            //  This is super-dangerous but works. Race condition potential high.
            //  Is there another way?
            setTimeout(this.onLoad.bind(this));
        }
    }

});

module.exports = HTML5AudioFile;
