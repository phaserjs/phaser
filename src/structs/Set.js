/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2022 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Class = require('../utils/Class');

/**
 * @callback EachSetCallback<E>
 *
 * @param {E} entry - The Set entry.
 * @param {number} index - The index of the entry within the Set.
 *
 * @return {?boolean} The callback result.
 */

/**
 * @classdesc
 * A Set is a collection of unique elements.
 *
 * @class Set
 * @memberof Phaser.Structs
 * @constructor
 * @since 3.0.0
 *
 * @generic T
 * @genericUse {T[]} - [elements]
 *
 * @param {Array.<*>} [elements] - An optional array of elements to insert into this Set.
 */
var Set = new Class({

    initialize:

    function Set (elements)
    {
        /**
         * The entries of this Set. Stored internally as an array.
         *
         * @genericUse {T[]} - [$type]
         *
         * @name Phaser.Structs.Set#entries
         * @type {Array.<*>}
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
     * Inserts the provided value into this Set. If the value is already contained in this Set this method will have no effect.
     *
     * @method Phaser.Structs.Set#set
     * @since 3.0.0
     *
     * @genericUse {T} - [value]
     * @genericUse {Phaser.Structs.Set.<T>} - [$return]
     *
     * @param {*} value - The value to insert into this Set.
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
     * Get an element of this Set which has a property of the specified name, if that property is equal to the specified value.
     * If no elements of this Set satisfy the condition then this method will return `null`.
     *
     * @method Phaser.Structs.Set#get
     * @since 3.0.0
     *
     * @genericUse {T} - [value,$return]
     *
     * @param {string} property - The property name to check on the elements of this Set.
     * @param {*} value - The value to check for.
     *
     * @return {*} The first element of this Set that meets the required condition, or `null` if this Set contains no elements that meet the condition.
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
     * Returns an array containing all the values in this Set.
     *
     * @method Phaser.Structs.Set#getArray
     * @since 3.0.0
     *
     * @genericUse {T[]} - [$return]
     *
     * @return {Array.<*>} An array containing all the values in this Set.
     */
    getArray: function ()
    {
        return this.entries.slice(0);
    },

    /**
     * Removes the given value from this Set if this Set contains that value.
     *
     * @method Phaser.Structs.Set#delete
     * @since 3.0.0
     *
     * @genericUse {T} - [value]
     * @genericUse {Phaser.Structs.Set.<T>} - [$return]
     *
     * @param {*} value - The value to remove from the Set.
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
     * Dumps the contents of this Set to the console via `console.group`.
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
     * Passes each value in this Set to the given callback.
     * Use this function when you know this Set will be modified during the iteration, otherwise use `iterate`.
     *
     * @method Phaser.Structs.Set#each
     * @since 3.0.0
     *
     * @genericUse {EachSetCallback.<T>} - [callback]
     * @genericUse {Phaser.Structs.Set.<T>} - [$return]
     *
     * @param {EachSetCallback} callback - The callback to be invoked and passed each value this Set contains.
     * @param {*} [callbackScope] - The scope of the callback.
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
     * Passes each value in this Set to the given callback.
     *
     * For when you absolutely know this Set won't be modified during the iteration.
     *
     * The callback must return a boolean. If it returns `false` then it will abort
     * the Set iteration immediately. If it returns `true`, it will carry on
     * iterating the next child in the Set.
     *
     * @method Phaser.Structs.Set#iterate
     * @since 3.0.0
     *
     * @genericUse {EachSetCallback.<T>} - [callback]
     * @genericUse {Phaser.Structs.Set.<T>} - [$return]
     *
     * @param {EachSetCallback} callback - The callback to be invoked and passed each value this Set contains.
     * @param {*} [callbackScope] - The scope of the callback.
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
     * Goes through each entry in this Set and invokes the given function on them, passing in the arguments.
     *
     * @method Phaser.Structs.Set#iterateLocal
     * @since 3.0.0
     *
     * @genericUse {Phaser.Structs.Set.<T>} - [$return]
     *
     * @param {string} callbackKey - The key of the function to be invoked on each Set entry.
     * @param {...*} [args] - Additional arguments that will be passed to the callback, after the child.
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
     * Clears this Set so that it no longer contains any values.
     *
     * @method Phaser.Structs.Set#clear
     * @since 3.0.0
     *
     * @genericUse {Phaser.Structs.Set.<T>} - [$return]
     *
     * @return {Phaser.Structs.Set} This Set object.
     */
    clear: function ()
    {
        this.entries.length = 0;

        return this;
    },

    /**
     * Returns `true` if this Set contains the given value, otherwise returns `false`.
     *
     * @method Phaser.Structs.Set#contains
     * @since 3.0.0
     *
     * @genericUse {T} - [value]
     *
     * @param {*} value - The value to check for in this Set.
     *
     * @return {boolean} `true` if the given value was found in this Set, otherwise `false`.
     */
    contains: function (value)
    {
        return (this.entries.indexOf(value) > -1);
    },

    /**
     * Returns a new Set containing all values that are either in this Set or in the Set provided as an argument.
     *
     * @method Phaser.Structs.Set#union
     * @since 3.0.0
     *
     * @genericUse {Phaser.Structs.Set.<T>} - [set,$return]
     *
     * @param {Phaser.Structs.Set} set - The Set to perform the union with.
     *
     * @return {Phaser.Structs.Set} A new Set containing all the values in this Set and the Set provided as an argument.
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
     * Returns a new Set that contains only the values which are in this Set and that are also in the given Set.
     *
     * @method Phaser.Structs.Set#intersect
     * @since 3.0.0
     *
     * @genericUse {Phaser.Structs.Set.<T>} - [set,$return]
     *
     * @param {Phaser.Structs.Set} set - The Set to intersect this set with.
     *
     * @return {Phaser.Structs.Set} The result of the intersection, as a new Set.
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
     * Returns a new Set containing all the values in this Set which are *not* also in the given Set.
     *
     * @method Phaser.Structs.Set#difference
     * @since 3.0.0
     *
     * @genericUse {Phaser.Structs.Set.<T>} - [set,$return]
     *
     * @param {Phaser.Structs.Set} set - The Set to perform the difference with.
     *
     * @return {Phaser.Structs.Set} A new Set containing all the values in this Set that are not also in the Set provided as an argument to this method.
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
     * The size of this Set. This is the number of entries within it.
     * Changing the size will truncate the Set if the given value is smaller than the current size.
     * Increasing the size larger than the current size has no effect.
     *
     * @name Phaser.Structs.Set#size
     * @type {number}
     * @since 3.0.0
     */
    size: {

        get: function ()
        {
            return this.entries.length;
        },

        set: function (value)
        {
            if (value < this.entries.length)
            {
                return this.entries.length = value;
            }
            else
            {
                return this.entries.length;
            }
        }

    }

});

module.exports = Set;
