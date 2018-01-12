var Class = require('../utils/Class');
var CustomMap = require('../structs/Map');
var EventEmitter = require('eventemitter3');

var BaseCache = new Class({

    initialize:

    /**
     * [description]
     *
     * @class BaseCache
     * @memberOf Phaser.Cache
     * @constructor
     * @since 3.0.0
     */
    function BaseCache ()
    {
        /**
         * [description]
         *
         * @property {Phaser.Structs.Map} entries
         */
        this.entries = new CustomMap();

        /**
         * [description]
         *
         * @property {Phaser.Events.EventDispatcher} events
         */
        this.events = new EventEmitter();
    },

    /**
     * [description]
     *
     * @method Phaser.Cache.BaseCache#add
     * @fires CacheAddEvent
     * @since 3.0.0
     *
     * @param {string} key [description]
     * @param {any} data [description]
     */
    add: function (key, data)
    {
        this.entries.set(key, data);

        this.events.emit('add', this, key, data);
    },

    /**
     * [description]
     *
     * @method Phaser.Cache.BaseCache#has
     * @since 3.0.0
     *
     * @param {string} key [description]
     * 
     * @return {boolean} [description]
     */
    has: function (key)
    {
        return this.entries.has(key);
    },

    /**
     * [description]
     *
     * @method Phaser.Cache.BaseCache#get
     * @since 3.0.0
     *
     * @param {string} key [description]
     * 
     * @return {any} [description]
     */
    get: function (key)
    {
        return this.entries.get(key);
    },

    /**
     * [description]
     *
     * @method Phaser.Cache.BaseCache#remove
     * @fires CacheRemoveEvent
     * @since 3.0.0
     *
     * @param {string} key [description]
     */
    remove: function (key)
    {
        var entry = this.get(key);

        if (entry)
        {
            this.entries.delete(key);

            this.events.emit('remove', this, key, entry.data);
        }
    },

    /**
     * [description]
     *
     * @method Phaser.Cache.BaseCache#destroy
     * @since 3.0.0
     */
    destroy: function ()
    {
        this.entries.clear();
    }

});

module.exports = BaseCache;
