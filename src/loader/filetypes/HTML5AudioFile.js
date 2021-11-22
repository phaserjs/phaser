/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Class = require('../../utils/Class');
var CONST = require('../const');
var Events = require('../events');
var File = require('../File');
var GetFastValue = require('../../utils/object/GetFastValue');
var GetURL = require('../GetURL');
var IsPlainObject = require('../../utils/object/IsPlainObject');

/**
 * @classdesc
 * A single Audio File suitable for loading by the Loader.
 *
 * These are created when you use the Phaser.Loader.LoaderPlugin#audio method and are not typically created directly.
 *
 * For documentation about what all the arguments and configuration options mean please see Phaser.Loader.LoaderPlugin#audio.
 *
 * @class HTML5AudioFile
 * @extends Phaser.Loader.File
 * @memberof Phaser.Loader.FileTypes
 * @constructor
 * @since 3.0.0
 *
 * @param {Phaser.Loader.LoaderPlugin} loader - A reference to the Loader that is responsible for this file.
 * @param {(string|Phaser.Types.Loader.FileTypes.AudioFileConfig)} key - The key to use for this file, or a file configuration object.
 * @param {string} [urlConfig] - The absolute or relative URL to load this file from.
 * @param {Phaser.Types.Loader.XHRSettingsObject} [xhrSettings] - Extra XHR Settings specifically for this file.
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
        this.soundManager = loader.systems.sound;
        this.locked = this.soundManager.locked;
        this.loaded = false;
        this.filesLoaded = 0;
        this.filesTotal = 0;
    },

    /**
     * Called when the file finishes loading.
     *
     * @method Phaser.Loader.FileTypes.HTML5AudioFile#onLoad
     * @since 3.0.0
     */
    onLoad: function ()
    {
        if (this.loaded)
        {
            return;
        }

        this.loaded = true;

        this.loader.nextFile(this, true);
    },

    /**
     * Called if the file errors while loading.
     *
     * @method Phaser.Loader.FileTypes.HTML5AudioFile#onError
     * @since 3.0.0
     */
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

    /**
     * Called during the file load progress. Is sent a DOM ProgressEvent.
     *
     * @method Phaser.Loader.FileTypes.HTML5AudioFile#onProgress
     * @fires Phaser.Loader.Events#FILE_PROGRESS
     * @since 3.0.0
     *
     * @param {ProgressEvent} event - The DOM ProgressEvent.
     */
    onProgress: function (event)
    {
        var audio = event.target;

        audio.oncanplaythrough = null;
        audio.onerror = null;

        this.filesLoaded++;

        this.percentComplete = Math.min((this.filesLoaded / this.filesTotal), 1);

        this.loader.emit(Events.FILE_PROGRESS, this, this.percentComplete);

        if (this.filesLoaded === this.filesTotal)
        {
            var success = !(event.target && event.target.status !== 200);

            this.state = CONST.FILE_LOADED;

            this.loader.nextFile(this, success);
        }
    },

    /**
     * Called by the Loader, starts the actual file downloading.
     * During the load the methods onLoad, onError and onProgress are called, based on the XHR events.
     * You shouldn't normally call this method directly, it's meant to be invoked by the Loader.
     *
     * @method Phaser.Loader.FileTypes.HTML5AudioFile#load
     * @since 3.0.0
     */
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
            var dataset = audio.dataset;

            dataset.name = this.key + '-' + i.toString();
            dataset.used = 'false';

            if (this.locked)
            {
                dataset.locked = 'true';
                console.log('HTML5AudioFile:', dataset.name, 'locked');
            }
            else
            {
                dataset.locked = 'false';

                audio.preload = 'auto';
                audio.oncanplaythrough = this.onProgress.bind(this);
                audio.onerror = this.onError.bind(this);

                console.log('HTML5AudioFile:', dataset.name, 'unlocked');
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
                console.log('HTML5AudioFile:', dataset.name, 'load called');
            }
        }

        if (this.locked)
        {
            this.loader.nextFile(this, true);
        }
    }

});

module.exports = HTML5AudioFile;
