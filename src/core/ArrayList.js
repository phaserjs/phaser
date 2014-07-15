/**
* @author       Richard Davey <rich@photonstorm.com>
* @copyright    2014 Photon Storm Ltd.
* @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
*/

/**
* A set data structure. Allows items to add themselves to and remove themselves from the set. Items can only exist once in the set.
*
* @class Phaser.ArrayList
* @constructor
*/
Phaser.ArrayList = function () {

    /**
    * @property {number} total - Number of objects in the list.
    * @default
    */
    this.total = 0;

    /**
    * @property {number} position - Current cursor position.
    * @default
    */
    this.position = 0;

    /**
    * @property {array} list - The list.
    */
    this.list = [];

};

Phaser.ArrayList.prototype = {

    /**
    * Adds a new element to this list. The item can only exist in the list once.
    *
    * @method Phaser.ArrayList#add
    * @param {object} child - The element to add to this list. Can be a Phaser.Sprite or any other object you need to quickly iterate through.
    * @return {object} The child that was added.
    */
    add: function (child) {

        if (!this.exists(child))
        {
            this.list.push(child);
            this.total++;
        }

        return child;

    },

    /**
    * Gets the index of the child in the list, or -1 if it isn't in the list.
    *
    * @method Phaser.ArrayList#getIndex
    * @param {object} child - The element to get the list index for.
    * @return {number} The index of the child or -1 if not found.
    */
    getIndex: function (child) {

        return this.list.indexOf(child);

    },

    /**
    * Checks for the child within this list.
    *
    * @method Phaser.ArrayList#exists
    * @param {object} child - The element to get the list index for.
    * @return {boolean} True if the child is found in the list, otherwise false.
    */
    exists: function (child) {

        return (this.list.indexOf(child) > -1);

    },

    /**
    * Resets the list length and drops all items in the list.
    *
    * @method Phaser.ArrayList#reset
    */
    reset: function () {

        this.list.length = 0;
        this.total = 0;

    },

    /**
    * Removes the given element from this list if it exists.
    *
    * @method Phaser.ArrayList#remove
    * @param {object} child - The child to be removed from the list.
    * @return {object} child - The child that was removed.
    */
    remove: function (child) {

        var idx = this.list.indexOf(child);

        if (idx > -1)
        {
            this.list.splice(idx, 1);
            this.total--;
            return child;
        }

    },

    /**
    * Sets the property `key` to the given value on all members of this list.
    *
    * @method Phaser.ArrayList#setAll
    * @param {object} key - The object on the child to set.
    * @param {*} value - The value to set the property to.
    */
    setAll: function (key, value) {

        var i = this.list.length;

        while (i--)
        {
            if (this.list[i] && this.list[i][key])
            {
                this.list[i][key] = value;
            }
        }

    },

    /**
    * Calls a function on all members of this list, using the member as the context for the callback.
    * The function must exist on the member.
    *
    * @method Phaser.ArrayList#callAll
    * @param {function} callback - The function to call.
    * @param {...*} parameter - Additional parameters that will be passed to the callback.
    */
    callAll: function (callback) {

        var args = Array.prototype.splice.call(arguments, 1);

        var i = this.list.length;

        while (i--)
        {
            if (this.list[i] && this.list[i][callback])
            {
                this.list[i][callback].apply(this.list[i], args);
            }
        }

    }

};

/**
* Resets the cursor to the first item in the list and returns it.
*
* @name Phaser.ArrayList#first
* @property {object} first - The first item in the list.
*/
Object.defineProperty(Phaser.ArrayList.prototype, "first", {

    get: function () {

        this.position = 0;

        if (this.total > 0)
        {
            return this.list[0];
        }
        else
        {
            return null;
        }

    }

});

/**
* Gets the next item in the list and returns it, advancing the cursor.
*
* @name Phaser.ArrayList#next
* @property {object} next - Advanced the cursor and return.
*/
Object.defineProperty(Phaser.ArrayList.prototype, "next", {

    get: function () {

        if (this.position < this.total)
        {
            this.position++;

            return this.list[this.position];
        }
        else
        {
            return null;
        }

    }

});

Phaser.ArrayList.prototype.constructor = Phaser.ArrayList;
