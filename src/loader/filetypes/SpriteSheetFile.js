/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

var FileTypesManager = require('../FileTypesManager');
var ImageFile = require('./ImageFile.js');

/**
 * A Sprite Sheet File.
 *
 * @function Phaser.Loader.Filetypes.SpriteSheetFile
 * @since 3.0.0
 *
 * @param {string} key - The key of the file within the loader.
 * @param {string} url - The url to load the texture file from.
 * @param {object} config - Optional texture file specific XHR settings.
 * @param {string} path - Optional texture file specific XHR settings.
 * @param {object} xhrSettings - Optional atlas file specific XHR settings.
 *
 * @return {object} An object containing two File objects to be added to the loader.
 */
var SpriteSheetFile = function (key, url, config, path, xhrSettings)
{
    var image = new ImageFile(key, url, path, xhrSettings, config);

    //  Override the File type
    image.type = 'spritesheet';

    return image;
};

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
 * @param {object} xhrSettings - [description]
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
            this.addFile(new SpriteSheetFile(key[i], url, null, this.path, xhrSettings));
        }
    }
    else
    {
        this.addFile(new SpriteSheetFile(key, url, config, this.path, xhrSettings));
    }

    //  For method chaining
    return this;
});

module.exports = SpriteSheetFile;
