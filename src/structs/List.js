/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var ArrayUtils = require('../utils/array');
var Class = require('../utils/Class');
var NOOP = require('../utils/NOOP');
var StableSort = require('../utils/array/StableSort');

/**
 * @callback EachListCallback<I>
 *
 * @param {I} item - The item which is currently being processed.
 * @param {...*} [args] - Additional arguments that will be passed to the callback, after the child.
 */

/**
 * @classdesc
 * List is a generic implementation of an ordered list which contains utility methods for retrieving, manipulating, and iterating items.
 *
 * @class List
 * @memberof Phaser.Structs
 * @constructor
 * @since 3.0.0
 *
 * @generic T
 *
 * @param {*} parent - The parent of this list.
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
         * The index of the current element.
         *
         * This is used internally when iterating through the list with the {@link #first}, {@link #last}, {@link #get}, and {@link #previous} properties.
         *
         * @name Phaser.Structs.List#position
         * @type {number}
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
     * Adds the given item to the end of the list. Each item must be unique.
     *
     * @method Phaser.Structs.List#add
     * @since 3.0.0
     *
     * @param {*|Array.<*>} child - The item, or array of items, to add to the list.
     * @param {boolean} [skipCallback=false] - Skip calling the List.addCallback if this child is added successfully.
     *
     * @return {*} The list's underlying array.
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
     * Adds an item to list, starting at a specified index. Each item must be unique within the list.
     *
     * @method Phaser.Structs.List#addAt
     * @since 3.0.0
     *
     * @genericUse {(T|T[])} - [child,$return]
     *
     * @param {*} child - The item, or array of items, to add to the list.
     * @param {number} [index=0] - The index in the list at which the element(s) will be inserted.
     * @param {boolean} [skipCallback=false] - Skip calling the List.addCallback if this child is added successfully.
     *
     * @return {*} The List's underlying array.
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
     * Retrieves the item at a given position inside the List.
     *
     * @method Phaser.Structs.List#getAt
     * @since 3.0.0
     *
     * @genericUse {T} - [$return]
     *
     * @param {number} index - The index of the item.
     *
     * @return {*} The retrieved item, or `undefined` if it's outside the List's bounds.
     */
    getAt: function (index)
    {
        return this.list[index];
    },

    /**
     * Locates an item within the List and returns its index.
     *
     * @method Phaser.Structs.List#getIndex
     * @since 3.0.0
     *
     * @genericUse {T} - [child]
     *
     * @param {*} child - The item to locate.
     *
     * @return {number} The index of the item within the List, or -1 if it's not in the List.
     */
    getIndex: function (child)
    {
        //  Return -1 if given child isn't a child of this display list
        return this.list.indexOf(child);
    },

    /**
     * Sort the contents of this List so the items are in order based on the given property.
     * For example, `sort('alpha')` would sort the List contents based on the value of their `alpha` property.
     *
     * @method Phaser.Structs.List#sort
     * @since 3.0.0
     *
     * @genericUse {T[]} - [children,$return]
     *
     * @param {string} property - The property to lexically sort by.
     * @param {function} [handler] - Provide your own custom handler function. Will receive 2 children which it should compare and return a boolean.
     *
     * @return {Phaser.Structs.List} This List object.
     */
    sort: function (property, handler)
    {
        if (!property)
        {
            return this;
        }

        if (handler === undefined)
        {
            handler = function (childA, childB)
            {
                return childA[property] - childB[property];
            };
        }

        StableSort(this.list, handler);

        return this;
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
     * @param {number} [startIndex=0] - Offset from the front of the group (lowest child).
     * @param {number} [length=(to top)] - Restriction on the number of values you want to randomly select from.
     *
     * @return {?*} A random child of this Group.
     */
    getRandom: function (startIndex, length)
    {
        return ArrayUtils.GetRandom(this.list, startIndex, length);
    },

    /**
     * Returns the first element in a given part of the List which matches a specific criterion.
     *
     * @method Phaser.Structs.List#getFirst
     * @since 3.0.0
     *
     * @genericUse {T | null} - [$return]
     *
     * @param {string} property - The name of the property to test or a falsey value to have no criterion.
     * @param {*} value - The value to test the `property` against, or `undefined` to allow any value and only check for existence.
     * @param {number} [startIndex=0] - The position in the List to start the search at.
     * @param {number} [endIndex] - The position in the List to optionally stop the search at. It won't be checked.
     *
     * @return {?*} The first item which matches the given criterion, or `null` if no such item exists.
     */
    getFirst: function (property, value, startIndex, endIndex)
    {
        return ArrayUtils.GetFirst(this.list, property, value, startIndex, endIndex);
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
     * @genericUse {T[]} - [$return]
     *
     * @param {string} [property] - An optional property to test against the value argument.
     * @param {any} [value] - If property is set then Child.property must strictly equal this value to be included in the results.
     * @param {number} [startIndex] - The first child index to start the search from.
     * @param {number} [endIndex] - The last child index to search up until.
     *
     * @return {Array.<*>} All items of the List which match the given criterion, if any.
     */
    getAll: function (property, value, startIndex, endIndex)
    {
        return ArrayUtils.GetAll(this.list, property, value, startIndex, endIndex);
    },

    /**
     * Returns the total number of items in the List which have a property matching the given value.
     *
     * @method Phaser.Structs.List#count
     * @since 3.0.0
     *
     * @genericUse {T} - [value]
     *
     * @param {string} property - The property to test on each item.
     * @param {*} value - The value to test the property against.
     *
     * @return {number} The total number of matching elements.
     */
    count: function (property, value)
    {
        return ArrayUtils.CountAllMatching(this.list, property, value);
    },

    /**
     * Swaps the positions of two items in the list.
     *
     * @method Phaser.Structs.List#swap
     * @since 3.0.0
     *
     * @genericUse {T} - [child1,child2]
     *
     * @param {*} child1 - The first item to swap.
     * @param {*} child2 - The second item to swap.
     */
    swap: function (child1, child2)
    {
        ArrayUtils.Swap(this.list, child1, child2);
    },

    /**
     * Moves an item in the List to a new position.
     *
     * @method Phaser.Structs.List#moveTo
     * @since 3.0.0
     *
     * @genericUse {T} - [child,$return]
     *
     * @param {*} child - The item to move.
     * @param {number} index - Moves an item in the List to a new position.
     *
     * @return {*} The item that was moved.
     */
    moveTo: function (child, index)
    {
        return ArrayUtils.MoveTo(this.list, child, index);
    },

    /**
     * Moves an item above another one in the List.
     * If the given item is already above the other, it isn't moved.
     * Above means toward the end of the List.
     *
     * @method Phaser.Structs.List#moveAbove
     * @since 3.55.0
     *
     * @genericUse {T} - [child1,child2]
     *
     * @param {*} child1 - The element to move above base element.
     * @param {*} child2 - The base element.
     */
    moveAbove: function (child1, child2)
    {
        return ArrayUtils.MoveAbove(this.list, child1, child2);
    },

    /**
     * Moves an item below another one in the List.
     * If the given item is already below the other, it isn't moved.
     * Below means toward the start of the List.
     *
     * @method Phaser.Structs.List#moveBelow
     * @since 3.55.0
     *
     * @genericUse {T} - [child1,child2]
     *
     * @param {*} child1 - The element to move below base element.
     * @param {*} child2 - The base element.
     */
    moveBelow: function (child1, child2)
    {
        return ArrayUtils.MoveBelow(this.list, child1, child2);
    },

    /**
     * Removes one or many items from the List.
     *
     * @method Phaser.Structs.List#remove
     * @since 3.0.0
     *
     * @param {*} child - The item, or array of items, to remove.
     * @param {boolean} [skipCallback=false] - Skip calling the List.removeCallback.
     *
     * @return {*} The item, or array of items, which were successfully removed from the List.
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
     * Removes the item at the given position in the List.
     *
     * @method Phaser.Structs.List#removeAt
     * @since 3.0.0
     *
     * @genericUse {T} - [$return]
     *
     * @param {number} index - The position to remove the item from.
     * @param {boolean} [skipCallback=false] - Skip calling the List.removeCallback.
     *
     * @return {*} The item that was removed.
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
     * Removes the items within the given range in the List.
     *
     * @method Phaser.Structs.List#removeBetween
     * @since 3.0.0
     *
     * @genericUse {T[]} - [$return]
     *
     * @param {number} [startIndex=0] - The index to start removing from.
     * @param {number} [endIndex] - The position to stop removing at. The item at this position won't be removed.
     * @param {boolean} [skipCallback=false] - Skip calling the List.removeCallback.
     *
     * @return {Array.<*>} An array of the items which were removed.
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
     * @param {boolean} [skipCallback=false] - Skip calling the List.removeCallback.
     *
     * @return {this} This List object.
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
     * @param {*} child - The item to bring to the top of the List.
     *
     * @return {*} The item which was moved.
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
     * @param {*} child - The item to send to the back of the list.
     *
     * @return {*} The item which was moved.
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
     * @param {*} child - The item to move up.
     *
     * @return {*} The item which was moved.
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
     * @param {*} child - The item to move down.
     *
     * @return {*} The item which was moved.
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
     * Shuffles the items in the list.
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
     * Checks if an item exists within the List.
     *
     * @method Phaser.Structs.List#exists
     * @since 3.0.0
     *
     * @genericUse {T} - [child]
     *
     * @param {*} child - The item to check for the existence of.
     *
     * @return {boolean} `true` if the item is found in the list, otherwise `false`.
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
     * @param {string} property - The name of the property to set.
     * @param {*} value - The value to set the property to.
     * @param {number} [startIndex] - The first child index to start the search from.
     * @param {number} [endIndex] - The last child index to search up until.
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
     * @param {*} [context] - Value to use as `this` when executing callback.
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
     * Clears the List and recreates its internal array.
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
     * Destroys this List.
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
     * The number of items inside the List.
     *
     * @name Phaser.Structs.List#length
     * @type {number}
     * @readonly
     * @since 3.0.0
     */
    length: {

        get: function ()
        {
            return this.list.length;
        }

    },

    /**
     * The first item in the List or `null` for an empty List.
     *
     * @name Phaser.Structs.List#first
     * @genericUse {T} - [$type]
     * @type {*}
     * @readonly
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
     * The last item in the List, or `null` for an empty List.
     *
     * @name Phaser.Structs.List#last
     * @genericUse {T} - [$type]
     * @type {*}
     * @readonly
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
     * The next item in the List, or `null` if the entire List has been traversed.
     *
     * This property can be read successively after reading {@link #first} or manually setting the {@link #position} to iterate the List.
     *
     * @name Phaser.Structs.List#next
     * @genericUse {T} - [$type]
     * @type {*}
     * @readonly
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
     * The previous item in the List, or `null` if the entire List has been traversed.
     *
     * This property can be read successively after reading {@link #last} or manually setting the {@link #position} to iterate the List backwards.
     *
     * @name Phaser.Structs.List#previous
     * @genericUse {T} - [$type]
     * @type {*}
     * @readonly
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
