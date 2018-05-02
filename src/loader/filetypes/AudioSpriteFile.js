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
var LinkFile = require('../LinkFile.js');

/**
 * @classdesc
 * An Audio Sprite JSON File.
 *
 * @class AudioSpriteFile
 * @extends Phaser.Loader.LinkFile
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

    Extends: LinkFile,

    initialize:

    function AudioSpriteFile (loader, key, urls, json, config, audioXhrSettings, jsonXhrSettings)
    {
        if (IsPlainObject(key))
        {
            var config = key;

            // key = GetFastValue(config, 'key');
            // URLs = GetFastValue(config, 'urls');
            // json = GetFastValue(config, 'json');
            // atlasURL = GetFastValue(config, 'atlasURL');
            // textureXhrSettings = GetFastValue(config, 'textureXhrSettings');
            // atlasXhrSettings = GetFastValue(config, 'atlasXhrSettings');
        }

        var audio = AudioFile.create(loader, key, urls, config, audioXhrSettings)
        var data = new JSONFile(loader, key, json, jsonXhrSettings);

        LinkFile.call(this, loader, 'audiosprite', key, [ audio, data ]);
    },

    addToCache: function ()
    {
        if (this.isReadyToProcess())
        {
            var fileA = this.files[0];
            var fileB = this.files[1];

            /*
            if (fileA.type === 'image')
            {
                this.loader.textureManager.addAtlas(fileA.key, fileA.data, fileB.data);
                fileB.addToCache();
            }
            else
            {
                this.loader.textureManager.addAtlas(fileB.key, fileB.data, fileA.data);
                fileA.addToCache();
            }
            */

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
 * @param {(string|string[])} urls - [description]
 * @param {object} json - [description]
 * @param {object} config - [description]
 * @param {XHRSettingsObject} [audioXhrSettings] - Optional file specific XHR settings.
 * @param {XHRSettingsObject} [jsonXhrSettings] - Optional file specific XHR settings.
 *
 * @return {Phaser.Loader.LoaderPlugin} The Loader.
 */
FileTypesManager.register('audioSprite', function (key, urls, json, config, audioXhrSettings, jsonXhrSettings)
{
    var linkfile;

    //  Supports an Object file definition in the key argument
    //  Or an array of objects in the key argument
    //  Or a single entry where all arguments have been defined

    if (Array.isArray(key))
    {
        for (var i = 0; i < key.length; i++)
        {
            linkfile = new AudioSpriteFile(this, key[i]);

            this.addFile(linkfile.files);
        }
    }
    else
    {
        linkfile = new AudioSpriteFile(this, key, urls, json, config, audioXhrSettings, jsonXhrSettings);

        this.addFile(linkfile.files);
    }

    return this;

    /*
    var audioFile = AudioFile.create(this, key, urls, config, audioXhrSettings);

    if (audioFile)
    {
        var jsonFile;

        if (typeof json === 'string')
        {
            jsonFile = new JSONFile(this, key, json, jsonXhrSettings);

            this.addFile(jsonFile);
        }
        else
        {
            jsonFile = {
                type: 'json',
                key: key,
                data: json,
                state: CONST.FILE_WAITING_LINKFILE
            };
        }

        //  Link them together
        audioFile.linkFile = jsonFile;
        jsonFile.linkFile = audioFile;

        //  Set the type
        audioFile.linkType = 'audioSprite';
        jsonFile.linkType = 'audioSprite';

        this.addFile(audioFile);
    }

    return this;
    */
});
