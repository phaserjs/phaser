var Class = require('../utils/Class');
var CustomMap = require('../structs/Map');
var EventDispatcher = require('../events/EventDispatcher');
var Events = require('./events');

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
        this.events = new EventDispatcher();
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

        this.events.dispatch(new Events.CACHE_ADD_EVENT(this, key, data));
    },

    /**
     * [description]
     *
     * @method Phaser.Cache.BaseCache#has
     * @since 3.0.0
     *
     * @param {string} key [description]
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

            this.events.dispatch(new Events.CACHE_REMOVE_EVENT(this, key, entry.data));
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
