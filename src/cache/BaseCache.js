/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

var Class = require('../utils/Class');
var CustomMap = require('../structs/Map');
var EventEmitter = require('eventemitter3');

/**
 * @classdesc
 * The BaseCache is a base Cache class that can be used for storing references to any kind of data.
 *
 * Data can be added, retrieved and removed based on the given keys.
 *
 * Keys are string-based.
 *
 * @class BaseCache
 * @memberOf Phaser.Cache
 * @constructor
 * @since 3.0.0
 */
var BaseCache = new Class({

    initialize:

    function BaseCache ()
    {
        /**
         * The Map in which the cache objects are stored.
         *
         * You can query the Map directly or use the BaseCache methods.
         *
         * @name Phaser.Cache.BaseCache#entries
         * @type {Phaser.Structs.Map}
         * @since 3.0.0
         */
        this.entries = new CustomMap();

        /**
         * An instance of EventEmitter used by the cache to emit related events.
         *
         * @name Phaser.Cache.BaseCache#events
         * @type {EventEmitter}
         * @since 3.0.0
         */
        this.events = new EventEmitter();
    },

    /**
     * Cache add event.
     *
     * This event is fired by the Cache each time a new object is added to it.
     *
     * @event Phaser.Cache.BaseCache#addEvent
     * @param {Phaser.Cache.BaseCache} The BaseCache to which the object was added.
     * @param {string} The key of the object added to the cache.
     * @param {any} A reference to the object added to the cache.
     */

    /**
     * Adds an item to this cache. The item is referenced by a unique string, which you are responsible
     * for setting and keeping track of. The item can only be retrieved by using this string.
     *
     * @method Phaser.Cache.BaseCache#add
     * @fires Phaser.Cache.BaseCache#addEvent
     * @since 3.0.0
     *
     * @param {string} key - The unique key by which the data added to the cache will be referenced.
     * @param {any} data - The data to be stored in the cache.
     *
     * @return {Phaser.Cache.BaseCache} This BaseCache object.
     */
    add: function (key, data)
    {
        this.entries.set(key, data);

        this.events.emit('add', this, key, data);

        return this;
    },

    /**
     * Checks if this cache contains an item matching the given key.
     *
     * @method Phaser.Cache.BaseCache#has
     * @since 3.0.0
     *
     * @param {string} key - The unique key of the item to be checked in this cache.
     * 
     * @return {boolean} Returns `true` if the cache contains an item matching the given key, otherwise `false`.
     */
    has: function (key)
    {
        return this.entries.has(key);
    },

    /**
     * Gets an item from this cache based on the given key.
     *
     * @method Phaser.Cache.BaseCache#get
     * @since 3.0.0
     *
     * @param {string} key - The unique key of the item to be retrieved from this cache.
     * 
     * @return {any} The item in the cache, or `null` if no item matching the given key was found.
     */
    get: function (key)
    {
        return this.entries.get(key);
    },

    /**
     * Cache remove event.
     *
     * This event is fired by the Cache each time an object is removed from it.
     *
     * @event Phaser.Cache.BaseCache#removeEvent
     * @param {Phaser.Cache.BaseCache} The BaseCache from which the object was removed.
     * @param {string} The key of the object removed from the cache.
     * @param {any} The object that was removed from the cache.
     */

    /**
     * Removes and item from this cache based on the given key.
     *
     * If an entry matching the key is found it is removed from the cache and a `remove` event emitted.
     * No additional checks are done on the item removed. If other systems or parts of your game code
     * are relying on this item, it is up to you to sever those relationships prior to removing the item.
     *
     * @method Phaser.Cache.BaseCache#remove
     * @fires Phaser.Cache.BaseCache#removeEvent
     * @since 3.0.0
     *
     * @param {string} key - The unique key of the item to remove from the cache.
     *
     * @return {Phaser.Cache.BaseCache} This BaseCache object.
     */
    remove: function (key)
    {
        var entry = this.get(key);

        if (entry)
        {
            this.entries.delete(key);

            this.events.emit('remove', this, key, entry.data);
        }

        return this;
    },

    /**
     * Destroys this cache and all items within it.
     *
     * @method Phaser.Cache.BaseCache#destroy
     * @since 3.0.0
     */
    destroy: function ()
    {
        this.entries.clear();
        this.events.removeAllListeners();

        this.entries = null;
        this.events = null;
    }

});

module.exports = BaseCache;
