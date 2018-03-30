/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

var FileTypesManager = require('../FileTypesManager');
var ImageFile = require('./ImageFile.js');
var JSONFile = require('./JSONFile.js');
var NumberArray = require('../../utils/array/NumberArray');

/**
 * Adds a Multi File Texture Atlas to the current load queue.
 *
 * Note: This method will only be available if the Multi Atlas File type has been built into Phaser.
 *
 * The file is **not** loaded immediately after calling this method.
 * Instead, the file is added to a queue within the Loader, which is processed automatically when the Loader starts.
 *
 * @method Phaser.Loader.LoaderPlugin#multiatlas
 * @since 3.0.0
 *
 * @param {string} key - [description]
 * @param {string[]} textureURLs - [description]
 * @param {string[]} atlasURLs - [description]
 * @param {XHRSettingsObject} textureXhrSettings - [description]
 * @param {XHRSettingsObject} atlasXhrSettings - [description]
 *
 * @return {Phaser.Loader.LoaderPlugin} The Loader.
 */
FileTypesManager.register('multiatlas', function (key, textureURLs, atlasURLs, textureXhrSettings, atlasXhrSettings)
{
    if (typeof textureURLs === 'number')
    {
        var total = textureURLs;
        var suffix = (atlasURLs === undefined) ? '' : atlasURLs;

        textureURLs = NumberArray(0, total, key + suffix, '.png');
        atlasURLs = NumberArray(0, total, key + suffix, '.json');
    }
    else
    {
        if (!Array.isArray(textureURLs))
        {
            textureURLs = [ textureURLs ];
        }

        if (!Array.isArray(atlasURLs))
        {
            atlasURLs = [ atlasURLs ];
        }
    }

    var file;
    var i = 0;
    var multiKey;

    this._multilist[key] = [];

    for (i = 0; i < textureURLs.length; i++)
    {
        multiKey = '_MA_IMG_' + key + '_' + i.toString();

        file = new ImageFile(multiKey, textureURLs[i], this.path, textureXhrSettings);

        this.addFile(file);

        this._multilist[key].push(multiKey);
    }

    for (i = 0; i < atlasURLs.length; i++)
    {
        multiKey = '_MA_JSON_' + key + '_' + i.toString();

        file = new JSONFile(multiKey, atlasURLs[i], this.path, atlasXhrSettings);

        this.addFile(file);

        this._multilist[key].push(multiKey);
    }

    return this;
});
