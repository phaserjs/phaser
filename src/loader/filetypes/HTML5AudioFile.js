/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

var Class = require('../../utils/Class');
var File = require('../File');
var GetFastValue = require('../../utils/object/GetFastValue');
var GetURL = require('../GetURL');

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
 * @param {object} config - [description]
 * @param {boolean} locked - [description]
 */
var HTML5AudioFile = new Class({

    Extends: File,

    initialize:

        function HTML5AudioFile (key, url, path, config, locked)
        {
            this.locked = locked;

            this.loaded = false;

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
        if(this.loaded)
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

        if(this.filesLoaded === this.filesTotal)
        {
            this.onLoad();
        }
    },

    //  Called by the Loader, starts the actual file downloading
    load: function (loader)
    {
        this.loader = loader;

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

            if (!this.locked)
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
            audio.src = GetURL(this, loader.baseURL);

            if (!this.locked)
            {
                audio.load();
            }
        }

        if (this.locked)
        {
            setTimeout(this.onLoad.bind(this));
        }
    }

});

module.exports = HTML5AudioFile;
