var BaseCache = require('./BaseCache');
var Class = require('../utils/Class');

var CacheManager = new Class({

    initialize:

    /**
     * [description]
     *
     * @class CacheManager
     * @memberOf Phaser.Cache
     * @constructor
     * @since 3.0.0
     *
     * @param {Phaser.Game} game - [description]
     */
    function CacheManager (game)
    {
        /**
         * [description]
         *
         * @property {Phaser.Game} game
         * @protected
         */
        this.game = game;

        /**
         * [description]
         *
         * @property {Phaser.Cache.BaseCache} binary
         * @protected
         */
        this.binary = new BaseCache();

        /**
         * [description]
         *
         * @property {Phaser.Cache.BaseCache} bitmapFont
         * @protected
         */
        this.bitmapFont = new BaseCache();

        /**
         * [description]
         *
         * @property {Phaser.Cache.BaseCache} json
         * @protected
         */
        this.json = new BaseCache();

        /**
         * [description]
         *
         * @property {Phaser.Cache.BaseCache} physics
         * @protected
         */
        this.physics = new BaseCache();

        /**
         * [description]
         *
         * @property {Phaser.Cache.BaseCache} shader
         * @protected
         */
        this.shader = new BaseCache();

        /**
         * [description]
         *
         * @property {Phaser.Cache.BaseCache} audio
         * @protected
         */
        this.audio = new BaseCache();

        /**
         * [description]
         *
         * @property {Phaser.Cache.BaseCache} text
         * @protected
         */
        this.text = new BaseCache();

        /**
         * [description]
         *
         * @property {Phaser.Cache.BaseCache} obj
         * @protected
         */
        this.obj = new BaseCache();

        /**
         * [description]
         *
         * @property {Phaser.Cache.BaseCache} tilemap
         * @protected
         */
        this.tilemap = new BaseCache();

        /**
         * [description]
         *
         * @property {Phaser.Cache.BaseCache} video
         * @protected
         */
        this.video = new BaseCache();

        /**
         * [description]
         *
         * @property {Phaser.Cache.BaseCache} xml
         * @protected
         */
        this.xml = new BaseCache();

        /**
         * [description]
         *
         * @property {object.<Phaser.Cache.BaseCache>} custom
         * @protected
         */
        this.custom = {};
    },

    //  Add your own custom Cache entry, available under Cache.custom.key

    /**
     * [description]
     *
     * @method Phaser.Cache.CacheManager#addCustom
     * @since 3.0.0
     *
     * @param {string} key - [description]
     *
     * @return {Phaser.Cache.BaseCache} [description]
     */
    addCustom: function (key)
    {
        if (!this.custom.hasOwnProperty(key))
        {
            this.custom[key] = new BaseCache();

            return this.custom[key];
        }
    }

});

module.exports = CacheManager;
