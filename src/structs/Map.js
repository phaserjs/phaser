/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Class = require('../utils/Class');

/**
 * @callback EachMapCallback<E>
 *
 * @param {string} key - The key of the Map entry.
 * @param {E} entry - The value of the Map entry.
 *
 * @return {?boolean} The callback result.
 */

/**
 * @classdesc
 * The keys of a Map can be arbitrary values.
 *
 * ```javascript
 * var map = new Map([
 *    [ 1, 'one' ],
 *    [ 2, 'two' ],
 *    [ 3, 'three' ]
 * ]);
 * ```
 *
 * @class Map
 * @memberof Phaser.Structs
 * @constructor
 * @since 3.0.0
 *
 * @generic K
 * @generic V
 * @genericUse {V[]} - [elements]
 *
 * @param {Array.<*>} elements - An optional array of key-value pairs to populate this Map with.
 */
var Map = new Class({

    initialize:

    function Map (elements)
    {
        /**
         * The entries in this Map.
         *
         * @genericUse {Object.<string, V>} - [$type]
         *
         * @name Phaser.Structs.Map#entries
         * @type {Object.<string, *>}
         * @default {}
         * @since 3.0.0
         */
        this.entries = {};

        /**
         * The number of key / value pairs in this Map.
         *
         * @name Phaser.Structs.Map#size
         * @type {number}
         * @default 0
         * @since 3.0.0
         */
        this.size = 0;

        this.setAll(elements);
    },

    /**
     * Adds all the elements in the given array to this Map.
     *
     * If the element already exists, the value will be skipped.
     *
     * @method Phaser.Structs.Map#setAll
     * @since 3.70.0
     *
     * @generic K
     * @generic V
     * @genericUse {V[]} - [elements]
     *
     * @param {Array.<*>} elements - An array of key-value pairs to populate this Map with.
     *
     * @return {this} This Map object.
     */
    setAll: function (elements)
    {
        if (Array.isArray(elements))
        {
            for (var i = 0; i < elements.length; i++)
            {
                this.set(elements[i][0], elements[i][1]);
            }
        }

        return this;
    },

    /**
     * Adds an element with a specified `key` and `value` to this Map.
     *
     * If the `key` already exists, the value will be replaced.
     *
     * If you wish to add multiple elements in a single call, use the `setAll` method instead.
     *
     * @method Phaser.Structs.Map#set
     * @since 3.0.0
     *
     * @genericUse {K} - [key]
     * @genericUse {V} - [value]
     * @genericUse {Phaser.Structs.Map.<K, V>} - [$return]
     *
     * @param {string} key - The key of the element to be added to this Map.
     * @param {*} value - The value of the element to be added to this Map.
     *
     * @return {this} This Map object.
     */
    set: function (key, value)
    {
        if (!this.has(key))
        {
            this.size++;
        }

        this.entries[key] = value;

        return this;
    },

    /**
     * Returns the value associated to the `key`, or `undefined` if there is none.
     *
     * @method Phaser.Structs.Map#get
     * @since 3.0.0
     *
     * @genericUse {K} - [key]
     * @genericUse {V} - [$return]
     *
     * @param {string} key - The key of the element to return from the `Map` object.
     *
     * @return {*} The element associated with the specified key or `undefined` if the key can't be found in this Map object.
     */
    get: function (key)
    {
        if (this.has(key))
        {
            return this.entries[key];
        }
    },

    /**
     * Returns an `Array` of all the values stored in this Map.
     *
     * @method Phaser.Structs.Map#getArray
     * @since 3.0.0
     *
     * @genericUse {V[]} - [$return]
     *
     * @return {Array.<*>} An array of the values stored in this Map.
     */
    getArray: function ()
    {
        var output = [];
        var entries = this.entries;

        for (var key in entries)
        {
            output.push(entries[key]);
        }

        return output;
    },

    /**
     * Returns a boolean indicating whether an element with the specified key exists or not.
     *
     * @method Phaser.Structs.Map#has
     * @since 3.0.0
     *
     * @genericUse {K} - [key]
     *
     * @param {string} key - The key of the element to test for presence of in this Map.
     *
     * @return {boolean} Returns `true` if an element with the specified key exists in this Map, otherwise `false`.
     */
    has: function (key)
    {
        return (this.entries.hasOwnProperty(key));
    },

    /**
     * Delete the specified element from this Map.
     *
     * @method Phaser.Structs.Map#delete
     * @since 3.0.0
     *
     * @genericUse {K} - [key]
     * @genericUse {Phaser.Structs.Map.<K, V>} - [$return]
     *
     * @param {string} key - The key of the element to delete from this Map.
     *
     * @return {this} This Map object.
     */
    delete: function (key)
    {
        if (this.has(key))
        {
            delete this.entries[key];
            this.size--;
        }

        return this;
    },

    /**
     * Delete all entries from this Map.
     *
     * @method Phaser.Structs.Map#clear
     * @since 3.0.0
     *
     * @genericUse {Phaser.Structs.Map.<K, V>} - [$return]
     *
     * @return {this} This Map object.
     */
    clear: function ()
    {
        Object.keys(this.entries).forEach(function (prop)
        {
            delete this.entries[prop];

        }, this);

        this.size = 0;

        return this;
    },

    /**
     * Returns all entries keys in this Map.
     *
     * @method Phaser.Structs.Map#keys
     * @since 3.0.0
     *
     * @genericUse {K[]} - [$return]
     *
     * @return {string[]} Array containing entries' keys.
     */
    keys: function ()
    {
        return Object.keys(this.entries);
    },

    /**
     * Returns an `Array` of all entries.
     *
     * @method Phaser.Structs.Map#values
     * @since 3.0.0
     *
     * @genericUse {V[]} - [$return]
     *
     * @return {Array.<*>} An `Array` of entries.
     */
    values: function ()
    {
        var output = [];
        var entries = this.entries;

        for (var key in entries)
        {
            output.push(entries[key]);
        }

        return output;
    },

    /**
     * Dumps the contents of this Map to the console via `console.group`.
     *
     * @method Phaser.Structs.Map#dump
     * @since 3.0.0
     */
    dump: function ()
    {
        var entries = this.entries;

        // eslint-disable-next-line no-console
        console.group('Map');

        for (var key in entries)
        {
            console.log(key, entries[key]);
        }

        // eslint-disable-next-line no-console
        console.groupEnd();
    },

    /**
     * Iterates through all entries in this Map, passing each one to the given callback.
     *
     * If the callback returns `false`, the iteration will break.
     *
     * @method Phaser.Structs.Map#each
     * @since 3.0.0
     *
     * @genericUse {EachMapCallback.<V>} - [callback]
     * @genericUse {Phaser.Structs.Map.<K, V>} - [$return]
     *
     * @param {EachMapCallback} callback - The callback which will receive the keys and entries held in this Map.
     *
     * @return {this} This Map object.
     */
    each: function (callback)
    {
        var entries = this.entries;

        for (var key in entries)
        {
            if (callback(key, entries[key]) === false)
            {
                break;
            }
        }

        return this;
    },

    /**
     * Returns `true` if the value exists within this Map. Otherwise, returns `false`.
     *
     * @method Phaser.Structs.Map#contains
     * @since 3.0.0
     *
     * @genericUse {V} - [value]
     *
     * @param {*} value - The value to search for.
     *
     * @return {boolean} `true` if the value is found, otherwise `false`.
     */
    contains: function (value)
    {
        var entries = this.entries;

        for (var key in entries)
        {
            if (entries[key] === value)
            {
                return true;
            }
        }

        return false;
    },

    /**
     * Merges all new keys from the given Map into this one.
     * If it encounters a key that already exists it will be skipped unless override is set to `true`.
     *
     * @method Phaser.Structs.Map#merge
     * @since 3.0.0
     *
     * @genericUse {Phaser.Structs.Map.<K, V>} - [map,$return]
     *
     * @param {Phaser.Structs.Map} map - The Map to merge in to this Map.
     * @param {boolean} [override=false] - Set to `true` to replace values in this Map with those from the source map, or `false` to skip them.
     *
     * @return {this} This Map object.
     */
    merge: function (map, override)
    {
        if (override === undefined) { override = false; }

        var local = this.entries;
        var source = map.entries;

        for (var key in source)
        {
            if (local.hasOwnProperty(key) && override)
            {
                local[key] = source[key];
            }
            else
            {
                this.set(key, source[key]);
            }
        }

        return this;
    }

});

module.exports = Map;
