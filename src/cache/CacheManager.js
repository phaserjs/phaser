/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var BaseCache = require('./BaseCache');
var Class = require('../utils/Class');
var GameEvents = require('../core/events');

/**
 * @classdesc
 * The Cache Manager is the global cache owned and maintained by the Game instance.
 *
 * Various systems, such as the file Loader, rely on this cache in order to store the files
 * it has loaded. The manager itself doesn't store any files, but instead owns multiple BaseCache
 * instances, one per type of file. You can also add your own custom caches.
 *
 * @class CacheManager
 * @memberof Phaser.Cache
 * @constructor
 * @since 3.0.0
 *
 * @param {Phaser.Game} game - A reference to the Phaser.Game instance that owns this CacheManager.
 */
var CacheManager = new Class({

    initialize:

    function CacheManager (game)
    {
        /**
         * A reference to the Phaser.Game instance that owns this CacheManager.
         *
         * @name Phaser.Cache.CacheManager#game
         * @type {Phaser.Game}
         * @protected
         * @since 3.0.0
         */
        this.game = game;

        /**
         * A Cache storing all binary files, typically added via the Loader.
         *
         * @name Phaser.Cache.CacheManager#binary
         * @type {Phaser.Cache.BaseCache}
         * @since 3.0.0
         */
        this.binary = new BaseCache();

        /**
         * A Cache storing all bitmap font data files, typically added via the Loader.
         * Only the font data is stored in this cache, the textures are part of the Texture Manager.
         *
         * @name Phaser.Cache.CacheManager#bitmapFont
         * @type {Phaser.Cache.BaseCache}
         * @since 3.0.0
         */
        this.bitmapFont = new BaseCache();

        /**
         * A Cache storing all JSON data files, typically added via the Loader.
         *
         * @name Phaser.Cache.CacheManager#json
         * @type {Phaser.Cache.BaseCache}
         * @since 3.0.0
         */
        this.json = new BaseCache();

        /**
         * A Cache storing all physics data files, typically added via the Loader.
         *
         * @name Phaser.Cache.CacheManager#physics
         * @type {Phaser.Cache.BaseCache}
         * @since 3.0.0
         */
        this.physics = new BaseCache();

        /**
         * A Cache storing all shader source files, typically added via the Loader.
         *
         * @name Phaser.Cache.CacheManager#shader
         * @type {Phaser.Cache.BaseCache}
         * @since 3.0.0
         */
        this.shader = new BaseCache();

        /**
         * A Cache storing all non-streaming audio files, typically added via the Loader.
         *
         * @name Phaser.Cache.CacheManager#audio
         * @type {Phaser.Cache.BaseCache}
         * @since 3.0.0
         */
        this.audio = new BaseCache();

        /**
         * A Cache storing all non-streaming video files, typically added via the Loader.
         *
         * @name Phaser.Cache.CacheManager#video
         * @type {Phaser.Cache.BaseCache}
         * @since 3.20.0
         */
        this.video = new BaseCache();

        /**
         * A Cache storing all text files, typically added via the Loader.
         *
         * @name Phaser.Cache.CacheManager#text
         * @type {Phaser.Cache.BaseCache}
         * @since 3.0.0
         */
        this.text = new BaseCache();

        /**
         * A Cache storing all html files, typically added via the Loader.
         *
         * @name Phaser.Cache.CacheManager#html
         * @type {Phaser.Cache.BaseCache}
         * @since 3.12.0
         */
        this.html = new BaseCache();

        /**
         * A Cache storing all WaveFront OBJ files, typically added via the Loader.
         *
         * @name Phaser.Cache.CacheManager#obj
         * @type {Phaser.Cache.BaseCache}
         * @since 3.0.0
         */
        this.obj = new BaseCache();

        /**
         * A Cache storing all tilemap data files, typically added via the Loader.
         * Only the data is stored in this cache, the textures are part of the Texture Manager.
         *
         * @name Phaser.Cache.CacheManager#tilemap
         * @type {Phaser.Cache.BaseCache}
         * @since 3.0.0
         */
        this.tilemap = new BaseCache();

        /**
         * A Cache storing all xml data files, typically added via the Loader.
         *
         * @name Phaser.Cache.CacheManager#xml
         * @type {Phaser.Cache.BaseCache}
         * @since 3.0.0
         */
        this.xml = new BaseCache();

        /**
         * An object that contains your own custom BaseCache entries.
         * Add to this via the `addCustom` method.
         *
         * @name Phaser.Cache.CacheManager#custom
         * @type {Object.<Phaser.Cache.BaseCache>}
         * @since 3.0.0
         */
        this.custom = {};

        this.game.events.once(GameEvents.DESTROY, this.destroy, this);
    },

    /**
     * Add your own custom Cache for storing your own files.
     * The cache will be available under `Cache.custom.key`.
     * The cache will only be created if the key is not already in use.
     *
     * @method Phaser.Cache.CacheManager#addCustom
     * @since 3.0.0
     *
     * @param {string} key - The unique key of your custom cache.
     *
     * @return {Phaser.Cache.BaseCache} A reference to the BaseCache that was created. If the key was already in use, a reference to the existing cache is returned instead.
     */
    addCustom: function (key)
    {
        if (!this.custom.hasOwnProperty(key))
        {
            this.custom[key] = new BaseCache();
        }

        return this.custom[key];
    },

    /**
     * Removes all entries from all BaseCaches and destroys all custom caches.
     *
     * @method Phaser.Cache.CacheManager#destroy
     * @since 3.0.0
     */
    destroy: function ()
    {
        var keys = [
            'binary',
            'bitmapFont',
            'json',
            'physics',
            'shader',
            'audio',
            'video',
            'text',
            'html',
            'obj',
            'tilemap',
            'xml'
        ];

        for (var i = 0; i < keys.length; i++)
        {
            this[keys[i]].destroy();
            this[keys[i]] = null;
        }

        for (var key in this.custom)
        {
            this.custom[key].destroy();
        }

        this.custom = null;

        this.game = null;
    }

});

module.exports = CacheManager;
