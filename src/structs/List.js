/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

var Class = require('../utils/Class');

/**
 * @callback EachListCallback
 *
 * @param {*} item - [description]
 * @param {...*} [arguments] - Additional arguments that will be passed to the callback, after the child.
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
         * @name Phaser.Structs.List#list
         * @type {array}
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
    },

    /**
     * [description]
     *
     * @method Phaser.Structs.List#add
     * @since 3.0.0
     *
     * @param {object} child - [description]
     *
     * @return {object} [description]
     */
    add: function (child)
    {
        //  Is child already in this display list?

        if (this.getIndex(child) === -1)
        {
            this.list.push(child);
        }

        return child;
    },

    /**
     * [description]
     *
     * @method Phaser.Structs.List#addAt
     * @since 3.0.0
     *
     * @param {object} child - [description]
     * @param {integer} index - [description]
     *
     * @return {object} [description]
     */
    addAt: function (child, index)
    {
        if (index === undefined) { index = 0; }

        if (this.list.length === 0)
        {
            return this.add(child);
        }

        if (index >= 0 && index <= this.list.length)
        {
            if (this.getIndex(child) === -1)
            {
                this.list.splice(index, 0, child);
            }
        }

        return child;
    },

    /**
     * [description]
     *
     * @method Phaser.Structs.List#addMultiple
     * @since 3.0.0
     *
     * @param {array} children - [description]
     *
     * @return {array} [description]
     */
    addMultiple: function (children)
    {
        if (Array.isArray(children))
        {
            for (var i = 0; i < children.length; i++)
            {
                this.add(children[i]);
            }
        }

        return children;
    },

    /**
     * [description]
     *
     * @method Phaser.Structs.List#getAt
     * @since 3.0.0
     *
     * @param {integer} index - [description]
     *
     * @return {object} [description]
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
     * @param {object} child - [description]
     *
     * @return {integer} [description]
     */
    getIndex: function (child)
    {
        //  Return -1 if given child isn't a child of this display list
        return this.list.indexOf(child);
    },

    /**
     * Given an array of objects, sort the array and return it,
     * so that the objects are in index order with the lowest at the bottom.
     *
     * @method Phaser.Structs.List#sort
     * @since 3.0.0
     *
     * @param {array} children - [description]
     *
     * @return {array} [description]
     */
    sort: function (children)
    {
        if (children === undefined) { children = this.list; }

        return children.sort(this.sortIndexHandler.bind(this));
    },

    /**
     * [description]
     *
     * @method Phaser.Structs.List#sortIndexHandler
     * @since 3.0.0
     *
     * @param {object} childA - [description]
     * @param {object} childB - [description]
     *
     * @return {integer} [description]
     */
    sortIndexHandler: function (childA, childB)
    {
        //  The lower the index, the lower down the display list they are
        var indexA = this.getIndex(childA);
        var indexB = this.getIndex(childB);

        if (indexA < indexB)
        {
            return -1;
        }
        else if (indexA > indexB)
        {
            return 1;
        }

        //  Technically this shouldn't happen, but if the GO wasn't part of this display list then it'll
        //  have an index of -1, so in some cases it can
        return 0;
    },

    /**
     * Gets the first item from the set based on the property strictly equaling the value given.
     * Returns null if not found.
     *
     * @method Phaser.Structs.List#getByKey
     * @since 3.0.0
     *
     * @param {string} property - The property to check against the value.
     * @param {*} value - The value to check if the property strictly equals.
     *
     * @return {*} The item that was found, or null if nothing matched.
     */
    getByKey: function (property, value)
    {
        for (var i = 0; i < this.list.length; i++)
        {
            if (this.list[i][property] === value)
            {
                return this.list[i];
            }
        }

        return null;
    },

    /**
     * Searches the Group for the first instance of a child with the `name`
     * property matching the given argument. Should more than one child have
     * the same name only the first instance is returned.
     *
     * @method Phaser.Structs.List#getByName
     * @since 3.0.0
     *
     * @param {string} name - The name to search for.
     *
     * @return {*} The first child with a matching name, or null if none were found.
     */
    getByName: function (name)
    {
        return this.getByKey('name', name);
    },

    /**
     * Returns a random child from the group.
     *
     * @method Phaser.Structs.List#getRandom
     * @since 3.0.0
     *
     * @param {integer} [startIndex=0] - Offset from the front of the group (lowest child).
     * @param {integer} [length=(to top)] - Restriction on the number of values you want to randomly select from.
     *
     * @return {*} A random child of this Group.
     */
    getRandom: function (startIndex, length)
    {
        if (startIndex === undefined) { startIndex = 0; }
        if (length === undefined) { length = this.list.length; }

        if (length === 0 || length > this.list.length)
        {
            return null;
        }

        var randomIndex = startIndex + Math.floor(Math.random() * length);

        return this.list[randomIndex];
    },

    /**
     * [description]
     *
     * @method Phaser.Structs.List#getFirst
     * @since 3.0.0
     *
     * @param {string} property - [description]
     * @param {*} value - [description]
     * @param {number} [startIndex=0] - [description]
     * @param {number} [endIndex] - [description]
     *
     * @return {*} [description]
     */
    getFirst: function (property, value, startIndex, endIndex)
    {
        if (startIndex === undefined) { startIndex = 0; }
        if (endIndex === undefined) { endIndex = this.list.length; }

        for (var i = startIndex; i < endIndex; i++)
        {
            var child = this.list[i];

            if (child[property] === value)
            {
                return child;
            }
        }

        return null;
    },

    /**
     * Returns all children in this List.
     *
     * You can optionally specify a matching criteria using the `property` and `value` arguments.
     *
     * For example: `getAll('visible', true)` would return only children that have their visible property set.
     *
     * Optionally you can specify a start and end index. For example if this List had 100 children,
     * and you set `startIndex` to 0 and `endIndex` to 50, it would return matches from only
     * the first 50 children in the List.
     *
     * @method Phaser.Structs.List#getAll
     * @since 3.0.0
     *
     * @param {string} [property] - An optional property to test against the value argument.
     * @param {*} [value] - If property is set then Child.property must strictly equal this value to be included in the results.
     * @param {integer} [startIndex=0] - The first child index to start the search from.
     * @param {integer} [endIndex] - The last child index to search up until.
     *
     * @return {array} [description]
     */
    getAll: function (property, value, startIndex, endIndex)
    {
        if (startIndex === undefined) { startIndex = 0; }
        if (endIndex === undefined) { endIndex = this.list.length; }

        var output = [];

        for (var i = startIndex; i < endIndex; i++)
        {
            var child = this.list[i];

            if (property)
            {
                if (child[property] === value)
                {
                    output.push(child);
                }
            }
            else
            {
                output.push(child);
            }
        }

        return output;
    },

    /**
     * [description]
     *
     * @method Phaser.Structs.List#count
     * @since 3.0.0
     *
     * @param {string} property - [description]
     * @param {*} value - [description]
     *
     * @return {integer} [description]
     */
    count: function (property, value)
    {
        var total = 0;

        for (var i = 0; i < this.list.length; i++)
        {
            var child = this.list[i];

            if (child[property] === value)
            {
                total++;
            }
        }

        return total;
    },

    /**
     * [description]
     *
     * @method Phaser.Structs.List#swap
     * @since 3.0.0
     *
     * @param {object} child1 - [description]
     * @param {object} child2 - [description]
     */
    swap: function (child1, child2)
    {
        if (child1 === child2)
        {
            return;
        }

        var index1 = this.getIndex(child1);
        var index2 = this.getIndex(child2);

        if (index1 < 0 || index2 < 0)
        {
            throw new Error('List.swap: Supplied objects must be children of the same list');
        }

        this.list[index1] = child2;
        this.list[index2] = child1;
    },

    /**
     * [description]
     *
     * @method Phaser.Structs.List#moveTo
     * @since 3.0.0
     *
     * @param {object} child - [description]
     * @param {integer} index - [description]
     *
     * @return {object} [description]
     */
    moveTo: function (child, index)
    {
        var currentIndex = this.getIndex(child);

        if (currentIndex === -1 || index < 0 || index >= this.list.length)
        {
            throw new Error('List.moveTo: The supplied index is out of bounds');
        }

        //  Remove
        this.list.splice(currentIndex, 1);

        //  Add in new location
        this.list.splice(index, 0, child);

        return child;
    },

    /**
     * [description]
     *
     * @method Phaser.Structs.List#remove
     * @since 3.0.0
     *
     * @param {object} child - [description]
     *
     * @return {object} [description]
     */
    remove: function (child)
    {
        var index = this.list.indexOf(child);

        if (index !== -1)
        {
            this.list.splice(index, 1);
        }

        return child;
    },

    /**
     * [description]
     *
     * @method Phaser.Structs.List#removeAt
     * @since 3.0.0
     *
     * @param {integer} index - [description]
     *
     * @return {object} [description]
     */
    removeAt: function (index)
    {
        var child = this.list[index];

        if (child)
        {
            this.children.splice(index, 1);
        }

        return child;
    },

    /**
     * [description]
     *
     * @method Phaser.Structs.List#removeBetween
     * @since 3.0.0
     *
     * @param {integer} beginIndex - [description]
     * @param {integer} endIndex - [description]
     *
     * @return {array} [description]
     */
    removeBetween: function (beginIndex, endIndex)
    {
        if (beginIndex === undefined) { beginIndex = 0; }
        if (endIndex === undefined) { endIndex = this.list.length; }

        var range = endIndex - beginIndex;

        if (range > 0 && range <= endIndex)
        {
            var removed = this.list.splice(beginIndex, range);

            return removed;
        }
        else if (range === 0 && this.list.length === 0)
        {
            return [];
        }
        else
        {
            throw new Error('List.removeBetween: Range Error, numeric values are outside the acceptable range');
        }
    },

    /**
     * Removes all the items.
     *
     * @method Phaser.Structs.List#removeAll
     * @since 3.0.0
     *
     * @return {Phaser.Structs.List} This List object.
     */
    removeAll: function ()
    {
        var i = this.list.length;

        while (i--)
        {
            this.remove(this.list[i]);
        }

        return this;
    },

    /**
     * Brings the given child to the top of this List.
     *
     * @method Phaser.Structs.List#bringToTop
     * @since 3.0.0
     *
     * @param {object} child - [description]
     *
     * @return {object} [description]
     */
    bringToTop: function (child)
    {
        if (this.getIndex(child) < this.list.length)
        {
            this.remove(child);
            this.add(child);
        }

        return child;
    },

    /**
     * Sends the given child to the bottom of this List.
     *
     * @method Phaser.Structs.List#sendToBack
     * @since 3.0.0
     *
     * @param {object} child - [description]
     *
     * @return {object} [description]
     */
    sendToBack: function (child)
    {
        if (this.getIndex(child) > 0)
        {
            this.remove(child);
            this.addAt(child, 0);
        }

        return child;
    },

    /**
     * Moves the given child up one place in this group unless it's already at the top.
     *
     * @method Phaser.Structs.List#moveUp
     * @since 3.0.0
     *
     * @param {object} child - [description]
     *
     * @return {object} [description]
     */
    moveUp: function (child)
    {
        var a = this.getIndex(child);

        if (a !== -1 && a < this.list.length - 1)
        {
            var b = this.getAt(a + 1);

            if (b)
            {
                this.swap(child, b);
            }
        }

        return child;
    },

    /**
     * Moves the given child down one place in this group unless it's already at the bottom.
     *
     * @method Phaser.Structs.List#moveDown
     * @since 3.0.0
     *
     * @param {object} child - [description]
     *
     * @return {object} [description]
     */
    moveDown: function (child)
    {
        var a = this.getIndex(child);

        if (a > 0)
        {
            var b = this.getAt(a - 1);

            if (b)
            {
                this.swap(child, b);
            }
        }

        return child;
    },

    /**
     * Reverses the order of all children in this List.
     *
     * @method Phaser.Structs.List#reverse
     * @since 3.0.0
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
     * @return {Phaser.Structs.List} This List object.
     */
    shuffle: function ()
    {
        for (var i = this.list.length - 1; i > 0; i--)
        {
            var j = Math.floor(Math.random() * (i + 1));
            var temp = this.list[i];
            this.list[i] = this.list[j];
            this.list[j] = temp;
        }

        return this;
    },

    /**
     * Replaces a child of this List with the given newChild. The newChild cannot be a member of this List.
     *
     * @method Phaser.Structs.List#replace
     * @since 3.0.0
     *
     * @param {object} oldChild - The child in this List that will be replaced.
     * @param {object} newChild - The child to be inserted into this List.
     *
     * @return {object} Returns the oldChild that was replaced within this group.
     */
    replace: function (oldChild, newChild)
    {
        var index = this.getIndex(oldChild);

        if (index !== -1)
        {
            this.remove(oldChild);

            this.addAt(newChild, index);

            return oldChild;
        }
    },

    /**
     * [description]
     *
     * @method Phaser.Structs.List#exists
     * @since 3.0.0
     *
     * @param {object} child - [description]
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
     * @param {string} key - [description]
     * @param {*} value - [description]
     */
    setAll: function (key, value)
    {
        for (var i = 0; i < this.list.length; i++)
        {
            if (this.list[i])
            {
                this.list[i][key] = value;
            }
        }
    },

    /**
     * Passes all children to the given callback.
     *
     * @method Phaser.Structs.List#each
     * @since 3.0.0
     *
     * @param {EachListCallback} callback - The function to call.
     * @param {object} [thisArg] - Value to use as `this` when executing callback.
     * @param {...*} [arguments] - Additional arguments that will be passed to the callback, after the child.
     */
    each: function (callback, thisArg)
    {
        var args = [ null ];

        for (var i = 1; i < arguments.length; i++)
        {
            args.push(arguments[i]);
        }

        for (i = 0; i < this.list.length; i++)
        {
            args[0] = this.list[i];
            callback.apply(thisArg, args);
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

        this.list = [];

        this.parent = null;
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
