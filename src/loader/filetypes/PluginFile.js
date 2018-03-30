/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

var Class = require('../../utils/Class');
var CONST = require('../const');
var File = require('../File');
var FileTypesManager = require('../FileTypesManager');
var GetFastValue = require('../../utils/object/GetFastValue');
var PluginManager = require('../../boot/PluginManager');

/**
 * @classdesc
 * [description]
 *
 * @class PluginFile
 * @extends Phaser.Loader.File
 * @memberOf Phaser.Loader.FileTypes
 * @constructor
 * @since 3.0.0
 *
 * @param {string} key - [description]
 * @param {string} url - [description]
 * @param {string} path - [description]
 * @param {XHRSettingsObject} xhrSettings - [description]
 */
var PluginFile = new Class({

    Extends: File,

    initialize:

    function PluginFile (key, url, path, xhrSettings)
    {
        // If the url variable refers to a class, add the plugin directly
        if (typeof url === 'function')
        {
            this.key = key;
            window[key] = url;
            window[key].register(PluginManager);
        }

        var fileKey = (typeof key === 'string') ? key : GetFastValue(key, 'key', '');

        var fileConfig = {
            type: 'script',
            extension: GetFastValue(key, 'extension', 'js'),
            responseType: 'text',
            key: fileKey,
            url: GetFastValue(key, 'file', url),
            path: path,
            xhrSettings: GetFastValue(key, 'xhr', xhrSettings)
        };

        File.call(this, fileConfig);
    },

    onProcess: function (callback)
    {
        this.state = CONST.FILE_PROCESSING;

        this.data = document.createElement('script');
        this.data.language = 'javascript';
        this.data.type = 'text/javascript';
        this.data.defer = false;
        this.data.text = this.xhrLoader.responseText;

        document.head.appendChild(this.data);

        //  Need to wait for onload?
        window[this.key].register(PluginManager);

        this.onComplete();

        callback(this);
    }

});

/**
 * Adds a Plugin file to the current load queue.
 *
 * Note: This method will only be available if the Plugin File type has been built into Phaser.
 *
 * The file is **not** loaded immediately after calling this method.
 * Instead, the file is added to a queue within the Loader, which is processed automatically when the Loader starts.
 *
 * @method Phaser.Loader.LoaderPlugin#plugin
 * @since 3.0.0
 *
 * @param {string} key - [description]
 * @param {string} url - [description]
 * @param {XHRSettingsObject} xhrSettings - [description]
 *
 * @return {Phaser.Loader.LoaderPlugin} The Loader.
 */
FileTypesManager.register('plugin', function (key, url, xhrSettings)
{
    if (Array.isArray(key))
    {
        for (var i = 0; i < key.length; i++)
        {
            //  If it's an array it has to be an array of Objects, so we get everything out of the 'key' object
            this.addFile(new PluginFile(key[i], url, this.path, xhrSettings));
        }
    }
    else
    {
        this.addFile(new PluginFile(key, url, this.path, xhrSettings));
    }

    //  For method chaining
    return this;
});

module.exports = PluginFile;
