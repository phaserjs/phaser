/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

var Class = require('../../utils/Class');
var FileTypesManager = require('../FileTypesManager');
var ImageFile = require('./ImageFile.js');

/**
 * @classdesc
 * [description]
 *
 * @class SpriteSheetFile
 * @extends Phaser.Loader.File
 * @memberOf Phaser.Loader.FileTypes
 * @constructor
 * @since 3.0.0
 *
 * @param {string} key - [description]
 * @param {string} url - [description]
 * @param {object} [config] - config can include: frameWidth, frameHeight, startFrame, endFrame, margin, spacing
 * @param {XHRSettingsObject} [xhrSettings] - [description]
 */
var SpriteSheetFile = new Class({

    Extends: ImageFile,

    initialize:

    //  url can either be a string, in which case it is treated like a proper url, or an object, in which case it is treated as a ready-made JS Object

    function SpriteSheetFile (loader, key, url, config, xhrSettings)
    {
        ImageFile.call(this, loader, key, url, xhrSettings, config);

        this.type = 'spritesheet';
    },

    addToCache: function ()
    {
        this.cache.addSpriteSheet(this.key, this.data, this.config);

        this.loader.emit('filecomplete', this.key, this);
    }

});

/**
 * Adds a Sprite Sheet file to the current load queue.
 *
 * Note: This method will only be available if the Sprite Sheet File type has been built into Phaser.
 *
 * The file is **not** loaded immediately after calling this method.
 * Instead, the file is added to a queue within the Loader, which is processed automatically when the Loader starts.
 *
 * @method Phaser.Loader.LoaderPlugin#spritesheet
 * @since 3.0.0
 *
 * @param {string} key - [description]
 * @param {string} url - [description]
 * @param {object} config - config can include: frameWidth, frameHeight, startFrame, endFrame, margin, spacing.
 * @param {XHRSettingsObject} [xhrSettings] - [description]
 *
 * @return {Phaser.Loader.LoaderPlugin} The Loader.
 */
FileTypesManager.register('spritesheet', function (key, url, config, xhrSettings)
{
    if (Array.isArray(key))
    {
        for (var i = 0; i < key.length; i++)
        {
            //  If it's an array it has to be an array of Objects, so we get everything out of the 'key' object
            this.addFile(new SpriteSheetFile(this, key[i]));
        }
    }
    else
    {
        this.addFile(new SpriteSheetFile(this, key, url, config, xhrSettings));
    }

    return this;
});

module.exports = SpriteSheetFile;
