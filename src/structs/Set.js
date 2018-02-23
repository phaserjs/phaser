/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

var Class = require('../utils/Class');

/**
 * @classdesc
 * A Set is a collection of unique elements.
 *
 * @class Set
 * @memberOf Phaser.Structs
 * @constructor
 * @since 3.0.0
 *
 * @param {array} [elements] - [description]
 */
var Set = new Class({

    initialize:

    function Set (elements)
    {
        /**
         * [description]
         *
         * @name Phaser.Structs.Set#entries
         * @type {array}
         * @default []
         * @since 3.0.0
         */
        this.entries = [];

        if (Array.isArray(elements))
        {
            for (var i = 0; i < elements.length; i++)
            {
                this.set(elements[i]);
            }
        }
    },

    /**
     * [description]
     *
     * @method Phaser.Structs.Set#set
     * @since 3.0.0
     *
     * @param {any} value - [description]
     *
     * @return {Phaser.Structs.Set} This Set object.
     */
    set: function (value)
    {
        if (this.entries.indexOf(value) === -1)
        {
            this.entries.push(value);
        }

        return this;
    },

    /**
     * [description]
     *
     * @method Phaser.Structs.Set#get
     * @since 3.0.0
     *
     * @param {string} property - [description]
     * @param {any} value - [description]
     *
     * @return {any} [description]
     */
    get: function (property, value)
    {
        for (var i = 0; i < this.entries.length; i++)
        {
            var entry = this.entries[i];

            if (entry[property] === value)
            {
                return entry;
            }
        }
    },

    /**
     * [description]
     *
     * @method Phaser.Structs.Set#getArray
     * @since 3.0.0
     *
     * @return {array} [description]
     */
    getArray: function ()
    {
        return this.entries.slice(0);
    },

    /**
     * [description]
     *
     * @method Phaser.Structs.Set#delete
     * @since 3.0.0
     *
     * @param {any} value - [description]
     *
     * @return {Phaser.Structs.Set} This Set object.
     */
    delete: function (value)
    {
        var index = this.entries.indexOf(value);

        if (index > -1)
        {
            this.entries.splice(index, 1);
        }

        return this;
    },

    /**
     * [description]
     *
     * @method Phaser.Structs.Set#dump
     * @since 3.0.0
     */
    dump: function ()
    {
        // eslint-disable-next-line no-console
        console.group('Set');

        for (var i = 0; i < this.entries.length; i++)
        {
            var entry = this.entries[i];
            console.log(entry);
        }

        // eslint-disable-next-line no-console
        console.groupEnd();
    },

    /**
     * For when you know this Set will be modified during the iteration.
     *
     * @method Phaser.Structs.Set#each
     * @since 3.0.0
     *
     * @param {function} callback - [description]
     * @param {object} callbackScope - [description]
     *
     * @return {Phaser.Structs.Set} This Set object.
     */
    each: function (callback, callbackScope)
    {
        var i;
        var temp = this.entries.slice();
        var len = temp.length;

        if (callbackScope)
        {
            for (i = 0; i < len; i++)
            {
                if (callback.call(callbackScope, temp[i], i) === false)
                {
                    break;
                }
            }
        }
        else
        {
            for (i = 0; i < len; i++)
            {
                if (callback(temp[i], i) === false)
                {
                    break;
                }
            }
        }

        return this;
    },

    /**
     * For when you absolutely know this Set won't be modified during the iteration.
     *
     * @method Phaser.Structs.Set#iterate
     * @since 3.0.0
     *
     * @param {function} callback - [description]
     * @param {object} callbackScope - [description]
     *
     * @return {Phaser.Structs.Set} This Set object.
     */
    iterate: function (callback, callbackScope)
    {
        var i;
        var len = this.entries.length;

        if (callbackScope)
        {
            for (i = 0; i < len; i++)
            {
                if (callback.call(callbackScope, this.entries[i], i) === false)
                {
                    break;
                }
            }
        }
        else
        {
            for (i = 0; i < len; i++)
            {
                if (callback(this.entries[i], i) === false)
                {
                    break;
                }
            }
        }

        return this;
    },

    /**
     * [description]
     *
     * @method Phaser.Structs.Set#iterateLocal
     * @since 3.0.0
     *
     * @param {string} callbackKey - [description]
     * @param {...*} [arguments] - Additional arguments that will be passed to the callback, after the child.
     *
     * @return {Phaser.Structs.Set} This Set object.
     */
    iterateLocal: function (callbackKey)
    {
        var i;
        var args = [];

        for (i = 1; i < arguments.length; i++)
        {
            args.push(arguments[i]);
        }

        var len = this.entries.length;

        for (i = 0; i < len; i++)
        {
            var entry = this.entries[i];

            entry[callbackKey].apply(entry, args);
        }

        return this;
    },

    /**
     * [description]
     *
     * @method Phaser.Structs.Set#clear
     * @since 3.0.0
     *
     * @return {Phaser.Structs.Set} This Set object.
     */
    clear: function ()
    {
        this.entries.length = 0;

        return this;
    },

    /**
     * [description]
     *
     * @method Phaser.Structs.Set#contains
     * @since 3.0.0
     *
     * @param {any} value - [description]
     *
     * @return {boolean} [description]
     */
    contains: function (value)
    {
        return (this.entries.indexOf(value) > -1);
    },

    /**
     * [description]
     *
     * @method Phaser.Structs.Set#union
     * @since 3.0.0
     *
     * @param {Phaser.Structs.Set} set - [description]
     *
     * @return {Phaser.Structs.Set} [description]
     */
    union: function (set)
    {
        var newSet = new Set();

        set.entries.forEach(function (value)
        {
            newSet.set(value);
        });

        this.entries.forEach(function (value)
        {
            newSet.set(value);
        });

        return newSet;
    },

    /**
     * [description]
     *
     * @method Phaser.Structs.Set#intersect
     * @since 3.0.0
     *
     * @param {Phaser.Structs.Set} set - [description]
     *
     * @return {Phaser.Structs.Set} [description]
     */
    intersect: function (set)
    {
        var newSet = new Set();

        this.entries.forEach(function (value)
        {
            if (set.contains(value))
            {
                newSet.set(value);
            }
        });

        return newSet;
    },

    /**
     * [description]
     *
     * @method Phaser.Structs.Set#difference
     * @since 3.0.0
     *
     * @param {Phaser.Structs.Set} set - [description]
     *
     * @return {Phaser.Structs.Set} [description]
     */
    difference: function (set)
    {
        var newSet = new Set();

        this.entries.forEach(function (value)
        {
            if (!set.contains(value))
            {
                newSet.set(value);
            }
        });

        return newSet;
    },

    /**
     * [description]
     *
     * @name Phaser.Structs.Set#size
     * @type {integer}
     * @since 3.0.0
     */
    size: {

        get: function ()
        {
            return this.entries.length;
        },

        set: function (value)
        {
            return this.entries.length = value;
        }

    }

});

module.exports = Set;
