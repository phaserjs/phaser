/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

var AudioFile = require('./AudioFile.js');
var Class = require('../../utils/Class');
var FileTypesManager = require('../FileTypesManager');
var GetFastValue = require('../../utils/object/GetFastValue');
var IsPlainObject = require('../../utils/object/IsPlainObject');
var JSONFile = require('./JSONFile.js');
var MultiFile = require('../MultiFile.js');

/**
 * @classdesc
 * An Audio Sprite JSON File.
 *
 * @class AudioSpriteFile
 * @extends Phaser.Loader.MultiFile
 * @memberOf Phaser.Loader.FileTypes
 * @constructor
 * @since 3.7.0
 *
 * @param {string} key - The key of the file within the loader.
 * @param {string} textureURL - The url to load the texture file from.
 * @param {string} atlasURL - The url to load the atlas file from.
 * @param {string} path - The path of the file.
 * @param {XHRSettingsObject} [textureXhrSettings] - Optional texture file specific XHR settings.
 * @param {XHRSettingsObject} [atlasXhrSettings] - Optional atlas file specific XHR settings.
 */
var AudioSpriteFile = new Class({

    Extends: MultiFile,

    initialize:

    function AudioSpriteFile (loader, key, url, json, audioConfig, audioXhrSettings, jsonXhrSettings)
    {
        if (IsPlainObject(key))
        {
            var config = key;

            key = GetFastValue(config, 'key');
            url = GetFastValue(config, 'url');
            json = GetFastValue(config, 'json');
            audioConfig = GetFastValue(config, 'config');
            audioXhrSettings = GetFastValue(config, 'audioXhrSettings');
            jsonXhrSettings = GetFastValue(config, 'jsonXhrSettings');
        }

        var data;

        //  No url? then we're going to do a json load and parse it from that
        if (!Array.isArray(url))
        {
            data = new JSONFile(loader, key, json, jsonXhrSettings);
            
            MultiFile.call(this, loader, 'audiosprite', key, [ data ]);

            this.config.resourceLoad = true;
            this.config.audioConfig = audioConfig;
            this.config.audioXhrSettings = audioXhrSettings;
        }
        else
        {
            var audio = AudioFile.create(loader, key, url, audioConfig, audioXhrSettings);

            if (audio)
            {
                data = new JSONFile(loader, key, json, jsonXhrSettings);

                MultiFile.call(this, loader, 'audiosprite', key, [ audio, data ]);

                this.config.resourceLoad = false;
            }
        }
    },

    /**
     * Called by each File when it finishes loading.
     *
     * @method Phaser.Loader.MultiFile#onFileComplete
     * @since 3.7.0
     *
     * @param {Phaser.Loader.File} file - The File that has completed processing.
     */
    onFileComplete: function (file)
    {
        var index = this.files.indexOf(file);

        if (index !== -1)
        {
            this.pending--;

            if (this.config.resourceLoad && file.type === 'json' && file.data.hasOwnProperty('resources'))
            {
                //  Inspect the data for the files to now load
                var urls = file.data.resources;

                var audioConfig = GetFastValue(this.config, 'audioConfig');
                var audioXhrSettings = GetFastValue(this.config, 'audioXhrSettings');

                var audio = AudioFile.create(this.loader, file.key, urls, audioConfig, audioXhrSettings);

                if (audio)
                {
                    this.addToMultiFile(audio);

                    this.loader.addFile(audio);
                }
            }
        }
    },

    addToCache: function ()
    {
        if (this.isReadyToProcess())
        {
            var fileA = this.files[0];
            var fileB = this.files[1];

            fileA.addToCache();
            fileB.addToCache();

            this.complete = true;
        }
    }

});

/**
 * Adds an Audio Sprite file to the current load queue.
 *
 * Note: This method will only be available if the Audio Sprite File type has been built into Phaser.
 *
 * The file is **not** loaded immediately after calling this method.
 * Instead, the file is added to a queue within the Loader, which is processed automatically when the Loader starts.
 *
 * @method Phaser.Loader.LoaderPlugin#audioSprite
 * @since 3.0.0
 *
 * @param {string} key - [description]
 * @param {object} json - [description]
 * @param {(string|string[])} urls - [description]
 * @param {object} config - [description]
 * @param {XHRSettingsObject} [audioXhrSettings] - Optional file specific XHR settings.
 * @param {XHRSettingsObject} [jsonXhrSettings] - Optional file specific XHR settings.
 *
 * @return {Phaser.Loader.LoaderPlugin} The Loader.
 */
FileTypesManager.register('audioSprite', function (key, json, urls, config, audioXhrSettings, jsonXhrSettings)
{
    var game = this.systems.game;
    var audioConfig = game.config.audio;
    var deviceAudio = game.device.audio;

    if ((audioConfig && audioConfig.noAudio) || (!deviceAudio.webAudio && !deviceAudio.audioData))
    {
        //  Sounds are disabled, so skip loading audio
        return this;
    }

    var multifile;

    //  Supports an Object file definition in the key argument
    //  Or an array of objects in the key argument
    //  Or a single entry where all arguments have been defined

    if (Array.isArray(key))
    {
        for (var i = 0; i < key.length; i++)
        {
            multifile = new AudioSpriteFile(this, key[i]);

            if (multifile.files)
            {
                this.addFile(multifile.files);
            }
        }
    }
    else
    {
        multifile = new AudioSpriteFile(this, key, urls, json, config, audioXhrSettings, jsonXhrSettings);

        if (multifile.files)
        {
            this.addFile(multifile.files);
        }
    }

    return this;
});
