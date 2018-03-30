/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

var AudioFile = require('./AudioFile.js');
var CONST = require('../const');
var FileTypesManager = require('../FileTypesManager');
var JSONFile = require('./JSONFile.js');

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
 * @param {XHRSettingsObject} audioXhrSettings - Optional file specific XHR settings.
 * @param {XHRSettingsObject} jsonXhrSettings - Optional file specific XHR settings.
 *
 * @return {Phaser.Loader.LoaderPlugin} The Loader.
 */
FileTypesManager.register('audioSprite', function (key, urls, json, config, audioXhrSettings, jsonXhrSettings)
{
    var audioFile = AudioFile.create(this, key, urls, config, audioXhrSettings);

    if (audioFile)
    {
        var jsonFile;

        if (typeof json === 'string')
        {
            jsonFile = new JSONFile(key, json, this.path, jsonXhrSettings);

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
});
