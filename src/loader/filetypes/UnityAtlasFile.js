/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

var Class = require('../../utils/Class');
var FileTypesManager = require('../FileTypesManager');
var ImageFile = require('./ImageFile.js');
var LinkFile = require('../LinkFile.js');
var TextFile = require('./TextFile.js');

/**
 * @classdesc
 * A Unity Atlas File.
 *
 * @class UnityAtlasFile
 * @extends Phaser.Loader.LinkFile
 * @memberOf Phaser.Loader.FileTypes
 * @constructor
 *
 * @param {string} key - The key of the file within the loader.
 * @param {string} textureURL - The url to load the texture file from.
 * @param {string} atlasURL - The url to load the atlas file from.
 * @param {XHRSettingsObject} [textureXhrSettings] - Optional texture file specific XHR settings.
 * @param {XHRSettingsObject} [atlasXhrSettings] - Optional atlas file specific XHR settings.
 */
var UnityAtlasFile = new Class({

    Extends: LinkFile,

    initialize:

    function UnityAtlasFile (loader, key, textureURL, atlasURL, textureXhrSettings, atlasXhrSettings)
    {
        var image = new ImageFile(loader, key, textureURL, textureXhrSettings);
        var data = new TextFile(loader, key, atlasURL, atlasXhrSettings);

        LinkFile.call(this, loader, 'unityatlas', key, [ image, data ]);
    },

    addToCache: function ()
    {
        if (this.failed === 0 && !this.complete)
        {
            var fileA = this.files[0];
            var fileB = this.files[1];

            if (fileA.type === 'image')
            {
                this.loader.textureManager.addUnityAtlas(fileA.key, fileA.data, fileB.data);
                fileB.addToCache();
            }
            else
            {
                this.loader.textureManager.addUnityAtlas(fileB.key, fileB.data, fileA.data);
                fileA.addToCache();
            }

            this.complete = true;
        }
    }

});

/**
 * Adds a Unity Texture Atlas file to the current load queue.
 *
 * Note: This method will only be available if the Unity Atlas File type has been built into Phaser.
 *
 * The file is **not** loaded immediately after calling this method.
 * Instead, the file is added to a queue within the Loader, which is processed automatically when the Loader starts.
 *
 * @method Phaser.Loader.LoaderPlugin#unityAtlas
 * @since 3.0.0
 *
 * @param {string} key - The key of the file within the loader.
 * @param {string} textureURL - The url to load the texture file from.
 * @param {string} atlasURL - The url to load the atlas file from.
 * @param {XHRSettingsObject} [textureXhrSettings] - Optional texture file specific XHR settings.
 * @param {XHRSettingsObject} [atlasXhrSettings] - Optional atlas file specific XHR settings.
 *
 * @return {Phaser.Loader.LoaderPlugin} The Loader.
 */
FileTypesManager.register('unityAtlas', function (key, textureURL, atlasURL, textureXhrSettings, atlasXhrSettings)
{
    var linkfile = new UnityAtlasFile(this, key, textureURL, atlasURL, textureXhrSettings, atlasXhrSettings);

    this.addFile(linkfile.files);

    return this;
});

module.exports = UnityAtlasFile;
