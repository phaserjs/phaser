/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

var ArrayUtils = require('../utils/array');
var Class = require('../utils/Class');
var NOOP = require('../utils/NOOP');
var StableSort = require('../utils/array/StableSort');

/**
 * @callback EachListCallback
 * @generic I - [item]
 *
 * @param {*} item - [description]
 * @param {...*} [args] - Additional arguments that will be passed to the callback, after the child.
 */

/**
 * @classdesc
 * [description]
 *
 * @class List
 * @memberOf Phaser.Structs
 * @constructor
 * @since 3.0.0
 *
 * @generic T
 *
 * @param {*} parent - [description]
 */
var List = new Class({

    initialize:

    function List (parent)
    {
        /**
         * The parent of this list.
         *
         * @name Phaser.Structs.List#parent
         * @type {*}
         * @since 3.0.0
         */
        this.parent = parent;

        /**
         * The objects that belong to this collection.
         *
         * @genericUse {T[]} - [$type]
         *
         * @name Phaser.Structs.List#list
         * @type {Array.<*>}
         * @default []
         * @since 3.0.0
         */
        this.list = [];

        /**
         * [description]
         *
         * @name Phaser.Structs.List#position
         * @type {integer}
         * @default 0
         * @since 3.0.0
         */
        this.position = 0;

        /**
         * A callback that is invoked every time a child is added to this list.
         *
         * @name Phaser.Structs.List#addCallback
         * @type {function}
         * @since 3.4.0
         */
        this.addCallback = NOOP;

        /**
         * A callback that is invoked every time a child is removed from this list.
         *
         * @name Phaser.Structs.List#removeCallback
         * @type {function}
         * @since 3.4.0
         */
        this.removeCallback = NOOP;

        /**
         * The property key to sort by.
         *
         * @name Phaser.Structs.List#_sortKey
         * @type {string}
         * @since 3.4.0
         */
        this._sortKey = '';
    },

    /**
     * [description]
     *
     * @method Phaser.Structs.List#add
     * @since 3.0.0
     *
     * @genericUse {T} - [child,$return]
     *
     * @param {*|Array.<*>} child - [description]
     * @param {boolean} [skipCallback=false] - Skip calling the List.addCallback if this child is added successfully.
     *
     * @return {*} [description]
     */
    add: function (child, skipCallback)
    {
        if (skipCallback)
        {
            return ArrayUtils.Add(this.list, child);
        }
        else
        {
            return ArrayUtils.Add(this.list, child, 0, this.addCallback, this);
        }
    },

    /**
     * [description]
     *
     * @method Phaser.Structs.List#addAt
     * @since 3.0.0
     *
     * @genericUse {T} - [child,$return]
     *
     * @param {*} child - [description]
     * @param {integer} [index=0] - [description]
     * @param {boolean} [skipCallback=false] - Skip calling the List.addCallback if this child is added successfully.
     *
     * @return {*} [description]
     */
    addAt: function (child, index, skipCallback)
    {
        if (skipCallback)
        {
            return ArrayUtils.AddAt(this.list, child, index);
        }
        else
        {
            return ArrayUtils.AddAt(this.list, child, index, 0, this.addCallback, this);
        }
    },

    /**
     * [description]
     *
     * @method Phaser.Structs.List#getAt
     * @since 3.0.0
     *
     * @genericUse {T} - [$return]
     *
     * @param {integer} index - [description]
     *
     * @return {*} [description]
     */
    getAt: function (index)
    {
        return this.list[index];
    },

    /**
     * [description]
     *
     * @method Phaser.Structs.List#getIndex
     * @since 3.0.0
     *
     * @genericUse {T} - [child]
     *
     * @param {*} child - [description]
     *
     * @return {integer} [description]
     */
    getIndex: function (child)
    {
        //  Return -1 if given child isn't a child of this display list
        return this.list.indexOf(child);
    },

    /**
     * Sort the contents of this List so the items are in order based
     * on the given property. For example, `sort('alpha')` would sort the List
     * contents based on the value of their `alpha` property.
     *
     * @method Phaser.Structs.List#sort
     * @since 3.0.0
     *
     * @genericUse {T[]} - [children,$return]
     *
     * @param {string} property - The property to lexically sort by.
     *
     * @return {Array.<*>} [description]
     */
    sort: function (property)
    {
        if (property)
        {
            this._sortKey = property;

            StableSort.inplace(this.list, this.sortHandler);
        }

        return this;
    },

    /**
     * [description]
     *
     * @method Phaser.Structs.List#sortHandler
     * @private
     * @since 3.4.0
     *
     * @genericUse {T} - [childA,childB]
     *
     * @param {*} childA - [description]
     * @param {*} childB - [description]
     *
     * @return {integer} [description]
     */
    sortHandler: function (childA, childB)
    {
        return childA[this._sortKey] - childB[this._sortKey];
    },

    /**
     * Searches for the first instance of a child with its `name`
     * property matching the given argument. Should more than one child have
     * the same name only the first is returned.
     *
     * @method Phaser.Structs.List#getByName
     * @since 3.0.0
     *
     * @genericUse {T | null} - [$return]
     *
     * @param {string} name - The name to search for.
     *
     * @return {?*} The first child with a matching name, or null if none were found.
     */
    getByName: function (name)
    {
        return ArrayUtils.GetFirst(this.list, 'name', name);
    },

    /**
     * Returns a random child from the group.
     *
     * @method Phaser.Structs.List#getRandom
     * @since 3.0.0
     *
     * @genericUse {T | null} - [$return]
     *
     * @param {integer} [startIndex=0] - Offset from the front of the group (lowest child).
     * @param {integer} [length=(to top)] - Restriction on the number of values you want to randomly select from.
     *
     * @return {?*} A random child of this Group.
     */
    getRandom: function (startIndex, length)
    {
        return ArrayUtils.GetRandom(this.list, startIndex, length);
    },

    /**
     * [description]
     *
     * @method Phaser.Structs.List#getFirst
     * @since 3.0.0
     *
     * @genericUse {T} - [value]
     * @genericUse {T | null} - [$return]
     *
     * @param {string} property - [description]
     * @param {*} value - [description]
     * @param {number} [startIndex=0] - [description]
     * @param {number} [endIndex] - [description]
     *
     * @return {?*} [description]
     */
    getFirst: function (property, value, startIndex, endIndex)
    {
        return ArrayUtils.GetFirstElement(this.list, property, value, startIndex, endIndex);
    },

    /**
     * Returns all children in this List.
     *
     * You can optionally specify a matching criteria using the `property` and `value` arguments.
     *
     * For example: `getAll('parent')` would return only children that have a property called `parent`.
     *
     * You can also specify a value to compare the property to:
     * 
     * `getAll('visible', true)` would return only children that have their visible property set to `true`.
     *
     * Optionally you can specify a start and end index. For example if this List had 100 children,
     * and you set `startIndex` to 0 and `endIndex` to 50, it would return matches from only
     * the first 50 children in the List.
     *
     * @method Phaser.Structs.List#getAll
     * @since 3.0.0
     *
     * @genericUse {T} - [value]
     * @genericUse {T[]} - [$return]
     *
     * @param {string} [property] - An optional property to test against the value argument.
     * @param {*} [value] - If property is set then Child.property must strictly equal this value to be included in the results.
     * @param {integer} [startIndex] - The first child index to start the search from.
     * @param {integer} [endIndex] - The last child index to search up until.
     *
     * @return {Array.<*>} [description]
     */
    getAll: function (property, value, startIndex, endIndex)
    {
        return ArrayUtils.GetAll(this.list, property, value, startIndex, endIndex);
    },

    /**
     * [description]
     *
     * @method Phaser.Structs.List#count
     * @since 3.0.0
     *
     * @genericUse {T} - [value]
     *
     * @param {string} property - [description]
     * @param {*} value - [description]
     *
     * @return {integer} [description]
     */
    count: function (property, value)
    {
        return ArrayUtils.CountAllMatching(this.list, property, value);
    },

    /**
     * [description]
     *
     * @method Phaser.Structs.List#swap
     * @since 3.0.0
     *
     * @genericUse {T} - [child1,child2]
     *
     * @param {*} child1 - [description]
     * @param {*} child2 - [description]
     */
    swap: function (child1, child2)
    {
        ArrayUtils.Swap(this.list, child1, child2);
    },

    /**
     * [description]
     *
     * @method Phaser.Structs.List#moveTo
     * @since 3.0.0
     *
     * @genericUse {T} - [child,$return]
     *
     * @param {*} child - [description]
     * @param {integer} index - [description]
     *
     * @return {*} [description]
     */
    moveTo: function (child, index)
    {
        return ArrayUtils.MoveTo(this.list, child, index);
    },

    /**
     * [description]
     *
     * @method Phaser.Structs.List#remove
     * @since 3.0.0
     *
     * @genericUse {T} - [child,$return]
     *
     * @param {*} child - [description]
     * @param {boolean} [skipCallback=false] - Skip calling the List.removeCallback.
     *
     * @return {*} [description]
     */
    remove: function (child, skipCallback)
    {
        if (skipCallback)
        {
            return ArrayUtils.Remove(this.list, child);
        }
        else
        {
            return ArrayUtils.Remove(this.list, child, this.removeCallback, this);
        }
    },

    /**
     * [description]
     *
     * @method Phaser.Structs.List#removeAt
     * @since 3.0.0
     *
     * @genericUse {T} - [$return]
     *
     * @param {integer} index - [description]
     * @param {boolean} [skipCallback=false] - Skip calling the List.removeCallback.
     *
     * @return {*} [description]
     */
    removeAt: function (index, skipCallback)
    {
        if (skipCallback)
        {
            return ArrayUtils.RemoveAt(this.list, index);
        }
        else
        {
            return ArrayUtils.RemoveAt(this.list, index, this.removeCallback, this);
        }
    },

    /**
     * [description]
     *
     * @method Phaser.Structs.List#removeBetween
     * @since 3.0.0
     *
     * @genericUse {T[]} - [$return]
     *
     * @param {integer} [startIndex=0] - [description]
     * @param {integer} [endIndex] - [description]
     * @param {boolean} [skipCallback=false] - Skip calling the List.removeCallback.
     *
     * @return {Array.<*>} [description]
     */
    removeBetween: function (startIndex, endIndex, skipCallback)
    {
        if (skipCallback)
        {
            return ArrayUtils.RemoveBetween(this.list, startIndex, endIndex);
        }
        else
        {
            return ArrayUtils.RemoveBetween(this.list, startIndex, endIndex, this.removeCallback, this);
        }
    },

    /**
     * Removes all the items.
     *
     * @method Phaser.Structs.List#removeAll
     * @since 3.0.0
     *
     * @genericUse {Phaser.Structs.List.<T>} - [$return]
     * 
     * @param {boolean} [skipCallback=false] - Skip calling the List.removeCallback.
     *
     * @return {Phaser.Structs.List} This List object.
     */
    removeAll: function (skipCallback)
    {
        var i = this.list.length;

        while (i--)
        {
            this.remove(this.list[i], skipCallback);
        }

        return this;
    },

    /**
     * Brings the given child to the top of this List.
     *
     * @method Phaser.Structs.List#bringToTop
     * @since 3.0.0
     *
     * @genericUse {T} - [child,$return]
     *
     * @param {*} child - [description]
     *
     * @return {*} [description]
     */
    bringToTop: function (child)
    {
        return ArrayUtils.BringToTop(this.list, child);
    },

    /**
     * Sends the given child to the bottom of this List.
     *
     * @method Phaser.Structs.List#sendToBack
     * @since 3.0.0
     *
     * @genericUse {T} - [child,$return]
     *
     * @param {*} child - [description]
     *
     * @return {*} [description]
     */
    sendToBack: function (child)
    {
        return ArrayUtils.SendToBack(this.list, child);
    },

    /**
     * Moves the given child up one place in this group unless it's already at the top.
     *
     * @method Phaser.Structs.List#moveUp
     * @since 3.0.0
     *
     * @genericUse {T} - [child,$return]
     *
     * @param {*} child - [description]
     *
     * @return {*} [description]
     */
    moveUp: function (child)
    {
        ArrayUtils.MoveUp(this.list, child);

        return child;
    },

    /**
     * Moves the given child down one place in this group unless it's already at the bottom.
     *
     * @method Phaser.Structs.List#moveDown
     * @since 3.0.0
     *
     * @genericUse {T} - [child,$return]
     *
     * @param {*} child - [description]
     *
     * @return {*} [description]
     */
    moveDown: function (child)
    {
        ArrayUtils.MoveDown(this.list, child);

        return child;
    },

    /**
     * Reverses the order of all children in this List.
     *
     * @method Phaser.Structs.List#reverse
     * @since 3.0.0
     *
     * @genericUse {Phaser.Structs.List.<T>} - [$return]
     *
     * @return {Phaser.Structs.List} This List object.
     */
    reverse: function ()
    {
        this.list.reverse();

        return this;
    },

    /**
     * [description]
     *
     * @method Phaser.Structs.List#shuffle
     * @since 3.0.0
     *
     * @genericUse {Phaser.Structs.List.<T>} - [$return]
     *
     * @return {Phaser.Structs.List} This List object.
     */
    shuffle: function ()
    {
        ArrayUtils.Shuffle(this.list);

        return this;
    },

    /**
     * Replaces a child of this List with the given newChild. The newChild cannot be a member of this List.
     *
     * @method Phaser.Structs.List#replace
     * @since 3.0.0
     *
     * @genericUse {T} - [oldChild,newChild,$return]
     *
     * @param {*} oldChild - The child in this List that will be replaced.
     * @param {*} newChild - The child to be inserted into this List.
     *
     * @return {*} Returns the oldChild that was replaced within this group.
     */
    replace: function (oldChild, newChild)
    {
        return ArrayUtils.Replace(this.list, oldChild, newChild);
    },

    /**
     * [description]
     *
     * @method Phaser.Structs.List#exists
     * @since 3.0.0
     *
     * @genericUse {T} - [child]
     *
     * @param {*} child - [description]
     *
     * @return {boolean} True if the item is found in the list, otherwise false.
     */
    exists: function (child)
    {
        return (this.list.indexOf(child) > -1);
    },

    /**
     * Sets the property `key` to the given value on all members of this List.
     *
     * @method Phaser.Structs.List#setAll
     * @since 3.0.0
     *
     * @genericUse {T} - [value]
     *
     * @param {string} property - [description]
     * @param {*} value - [description]
     * @param {integer} [startIndex] - The first child index to start the search from.
     * @param {integer} [endIndex] - The last child index to search up until.
     */
    setAll: function (property, value, startIndex, endIndex)
    {
        ArrayUtils.SetAll(this.list, property, value, startIndex, endIndex);

        return this;
    },

    /**
     * Passes all children to the given callback.
     *
     * @method Phaser.Structs.List#each
     * @since 3.0.0
     *
     * @genericUse {EachListCallback.<T>} - [callback]
     *
     * @param {EachListCallback} callback - The function to call.
     * @param {*} [thisArg] - Value to use as `this` when executing callback.
     * @param {...*} [args] - Additional arguments that will be passed to the callback, after the child.
     */
    each: function (callback, context)
    {
        var args = [ null ];

        for (var i = 2; i < arguments.length; i++)
        {
            args.push(arguments[i]);
        }

        for (i = 0; i < this.list.length; i++)
        {
            args[0] = this.list[i];

            callback.apply(context, args);
        }
    },

    /**
     * [description]
     *
     * @method Phaser.Structs.List#shutdown
     * @since 3.0.0
     */
    shutdown: function ()
    {
        this.removeAll();

        this.list = [];
    },

    /**
     * [description]
     *
     * @method Phaser.Structs.List#destroy
     * @since 3.0.0
     */
    destroy: function ()
    {
        this.removeAll();

        this.parent = null;
        this.addCallback = null;
        this.removeCallback = null;
    },

    /**
     * [description]
     *
     * @name Phaser.Structs.List#length
     * @type {integer}
     * @readOnly
     * @since 3.0.0
     */
    length: {

        get: function ()
        {
            return this.list.length;
        }

    },

    /**
     * [description]
     *
     * @name Phaser.Structs.List#first
     * @type {integer}
     * @readOnly
     * @since 3.0.0
     */
    first: {

        get: function ()
        {
            this.position = 0;

            if (this.list.length > 0)
            {
                return this.list[0];
            }
            else
            {
                return null;
            }
        }

    },

    /**
     * [description]
     *
     * @name Phaser.Structs.List#last
     * @type {integer}
     * @readOnly
     * @since 3.0.0
     */
    last: {

        get: function ()
        {
            if (this.list.length > 0)
            {
                this.position = this.list.length - 1;

                return this.list[this.position];
            }
            else
            {
                return null;
            }
        }

    },

    /**
     * [description]
     *
     * @name Phaser.Structs.List#next
     * @type {integer}
     * @readOnly
     * @since 3.0.0
     */
    next: {

        get: function ()
        {
            if (this.position < this.list.length)
            {
                this.position++;

                return this.list[this.position];
            }
            else
            {
                return null;
            }
        }

    },

    /**
     * [description]
     *
     * @name Phaser.Structs.List#previous
     * @type {integer}
     * @readOnly
     * @since 3.0.0
     */
    previous: {

        get: function ()
        {
            if (this.position > 0)
            {
                this.position--;

                return this.list[this.position];
            }
            else
            {
                return null;
            }
        }

    }

});

module.exports = List;
