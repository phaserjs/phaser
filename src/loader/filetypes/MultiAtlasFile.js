/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

var Class = require('../../utils/Class');
var FileTypesManager = require('../FileTypesManager');
var GetFastValue = require('../../utils/object/GetFastValue');
var ImageFile = require('./ImageFile.js');
var IsPlainObject = require('../../utils/object/IsPlainObject');
var JSONFile = require('./JSONFile.js');
var MultiFile = require('../MultiFile.js');

/**
 * @classdesc
 * A Multi Atlas File.
 *
 * @class MultiAtlasFile
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
var MultiAtlasFile = new Class({

    Extends: MultiFile,

    initialize:

    function MultiAtlasFile (loader, key, atlasURL, path, baseURL, atlasXhrSettings, textureXhrSettings)
    {
        if (IsPlainObject(key))
        {
            var config = key;

            key = GetFastValue(config, 'key');
            atlasURL = GetFastValue(config, 'url');
            atlasXhrSettings = GetFastValue(config, 'xhrSettings');
            path = GetFastValue(config, 'path');
            baseURL = GetFastValue(config, 'baseURL');
            textureXhrSettings = GetFastValue(config, 'textureXhrSettings');
        }

        var data = new JSONFile(loader, key, atlasURL, atlasXhrSettings);

        MultiFile.call(this, loader, 'multiatlas', key, [ data ]);

        this.config.path = path;
        this.config.baseURL = baseURL;
        this.config.textureXhrSettings = textureXhrSettings;
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

            if (file.type === 'json' && file.data.hasOwnProperty('textures'))
            {
                //  Inspect the data for the files to now load
                var textures = file.data.textures;

                var config = this.config;
                var loader = this.loader;

                var currentBaseURL = loader.baseURL;
                var currentPath = loader.path;
                var currentPrefix = loader.prefix;

                var baseURL = GetFastValue(config, 'baseURL', currentBaseURL);
                var path = GetFastValue(config, 'path', currentPath);
                var prefix = GetFastValue(config, 'prefix', currentPrefix);
                var textureXhrSettings = GetFastValue(config, 'textureXhrSettings');

                loader.setBaseURL(baseURL);
                loader.setPath(path);
                loader.setPrefix(prefix);

                for (var i = 0; i < textures.length; i++)
                {
                    //  "image": "texture-packer-multi-atlas-0.png",
                    var textureURL = textures[i].image;

                    var key = '_MA_' + textureURL;

                    var image = new ImageFile(loader, key, textureURL, textureXhrSettings);

                    this.addToMultiFile(image);

                    loader.addFile(image);

                    //  "normalMap": "texture-packer-multi-atlas-0_n.png",
                    if (textures[i].normalMap)
                    {
                        var normalMap = new ImageFile(loader, key, textures[i].normalMap, textureXhrSettings);

                        normalMap.type = 'normalMap';

                        image.setLink(normalMap);

                        this.addToMultiFile(normalMap);

                        loader.addFile(normalMap);
                    }
                }

                //  Reset the loader settings
                loader.setBaseURL(currentBaseURL);
                loader.setPath(currentPath);
                loader.setPrefix(currentPrefix);
            }
        }
    },

    addToCache: function ()
    {
        if (this.isReadyToProcess())
        {
            var fileJSON = this.files[0];

            fileJSON.addToCache();

            var data = [];
            var images = [];
            var normalMaps = [];

            for (var i = 1; i < this.files.length; i++)
            {
                var file = this.files[i];

                if (file.type === 'normalMap')
                {
                    continue;
                }

                var key = file.key.substr(4);
                var image = file.data;

                //  Now we need to find out which json entry this mapped to
                for (var t = 0; t < fileJSON.data.textures.length; t++)
                {
                    var item = fileJSON.data.textures[t];

                    if (item.image === key)
                    {
                        images.push(image);
                        
                        data.push(item);

                        if (file.linkFile)
                        {
                            normalMaps.push(file.linkFile.data);
                        }

                        break;
                    }
                }
            }

            if (normalMaps.length === 0)
            {
                normalMaps = undefined;
            }

            this.loader.textureManager.addAtlasJSONArray(this.key, images, data, normalMaps);

            this.complete = true;

            for (i = 0; i < this.files.length; i++)
            {
                this.files[i].pendingDestroy();
            }
        }
    }

});

/**
 * Adds a Multi Texture Atlas file to the current load queue.
 *
 * Note: This method will only be available if the Atlas JSON File type has been built into Phaser.
 *
 * The file is **not** loaded immediately after calling this method.
 * Instead, the file is added to a queue within the Loader, which is processed automatically when the Loader starts.
 *
 * @method Phaser.Loader.LoaderPlugin#multiatlas
 * @since 3.7.0
 *
 * @param {string} key - The key of the file within the loader.
 * @param {string} atlasURL - The url to load the atlas file from.
 * @param {XHRSettingsObject} [atlasXhrSettings] - Optional atlas file specific XHR settings.
 *
 * @return {Phaser.Loader.LoaderPlugin} The Loader.
 */
FileTypesManager.register('multiatlas', function (key, atlasURL, path, baseURL, atlasXhrSettings)
{
    var multifile;

    //  Supports an Object file definition in the key argument
    //  Or an array of objects in the key argument
    //  Or a single entry where all arguments have been defined

    if (Array.isArray(key))
    {
        for (var i = 0; i < key.length; i++)
        {
            multifile = new MultiAtlasFile(this, key[i]);

            this.addFile(multifile.files);
        }
    }
    else
    {
        multifile = new MultiAtlasFile(this, key, atlasURL, path, baseURL, atlasXhrSettings);

        this.addFile(multifile.files);
    }

    return this;
});

module.exports = MultiAtlasFile;
