/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Class = require('../utils/Class');
var CustomMap = require('../structs/Map');
var EventEmitter = require('eventemitter3');
var Events = require('./events');

/**
 * @classdesc
 * A key-value store used by the Phaser framework to cache loaded assets and other data.
 * Items are stored and retrieved using string-based keys. The BaseCache emits events when
 * items are added or removed, allowing other systems to react to cache changes. Multiple
 * BaseCache instances are owned by the CacheManager, one per asset type (JSON, binary,
 * audio, etc.), and you can also create custom caches via `CacheManager.addCustom()`.
 *
 * @class BaseCache
 * @memberof Phaser.Cache
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
         * @type {Phaser.Structs.Map.<String, *>}
         * @since 3.0.0
         */
        this.entries = new CustomMap();

        /**
         * An instance of EventEmitter used by the cache to emit related events.
         *
         * @name Phaser.Cache.BaseCache#events
         * @type {Phaser.Events.EventEmitter}
         * @since 3.0.0
         */
        this.events = new EventEmitter();
    },

    /**
     * Adds an item to this cache. The item is referenced by a unique string, which you are responsible
     * for setting and keeping track of. The item can only be retrieved by using this string.
     *
     * @method Phaser.Cache.BaseCache#add
     * @fires Phaser.Cache.Events#ADD
     * @since 3.0.0
     *
     * @param {string} key - The unique key by which the data added to the cache will be referenced.
     * @param {*} data - The data to be stored in the cache.
     *
     * @return {this} This BaseCache object.
     */
    add: function (key, data)
    {
        this.entries.set(key, data);

        this.events.emit(Events.ADD, this, key, data);

        return this;
    },

    /**
     * Checks if this cache contains an item matching the given key.
     * This performs the same action as `BaseCache.exists`.
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
     * Checks if this cache contains an item matching the given key.
     * This performs the same action as `BaseCache.has` and is called directly by the Loader.
     *
     * @method Phaser.Cache.BaseCache#exists
     * @since 3.7.0
     *
     * @param {string} key - The unique key of the item to be checked in this cache.
     *
     * @return {boolean} Returns `true` if the cache contains an item matching the given key, otherwise `false`.
     */
    exists: function (key)
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
     * @return {*} The item in the cache, or `null` if no item matching the given key was found.
     */
    get: function (key)
    {
        return this.entries.get(key);
    },

    /**
     * Removes an item from this cache based on the given key.
     *
     * If an entry matching the key is found it is removed from the cache and a `remove` event emitted.
     * No additional checks are done on the item removed. If other systems or parts of your game code
     * are relying on this item, it is up to you to sever those relationships prior to removing the item.
     *
     * @method Phaser.Cache.BaseCache#remove
     * @fires Phaser.Cache.Events#REMOVE
     * @since 3.0.0
     *
     * @param {string} key - The unique key of the item to remove from the cache.
     *
     * @return {this} This BaseCache object.
     */
    remove: function (key)
    {
        var entry = this.get(key);

        if (entry)
        {
            this.entries.delete(key);

            this.events.emit(Events.REMOVE, this, key, entry.data);
        }

        return this;
    },

    /**
     * Returns all keys in use in this cache.
     *
     * @method Phaser.Cache.BaseCache#getKeys
     * @since 3.17.0
     *
     * @return {string[]} An array of strings containing all keys currently stored in this cache.
     */
    getKeys: function ()
    {
        return this.entries.keys();
    },

    /**
     * Destroys this cache and all items within it. Clears the entries Map, removes all
     * event listeners from the EventEmitter, and nulls the internal references.
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
