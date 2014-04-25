/**
* @author       Richard Davey <rich@photonstorm.com>
* @copyright    2014 Photon Storm Ltd.
* @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
*/

/**
* A basic linked list data structure.
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
    * Adds a new element to this linked list.
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

    getIndex: function (child) {

        var i = this.list.length;

        while (i--)
        {
            if (this.list[i] === child)
            {
                return i;
            }
        }

        return -1;

    },

    exists: function (child) {

        var i = this.list.length;

        while (i--)
        {
            if (this.list[i] === child)
            {
                return true;
            }
        }

        return false;

    },

    /**
    * Resets the first, last, next and previous node pointers in this list.
    *
    * @method Phaser.ArrayList#reset
    */
    reset: function () {

        this.list.length = 0;
        this.total = 0;

    },

    /**
    * Removes the given element from this linked list if it exists.
    *
    * @method Phaser.ArrayList#remove
    * @param {object} child - The child to be removed from the list.
    */
    remove: function (child) {

        var idx = this.getIndex(child);

        if (idx > -1)
        {
            this.list.splice(idx, 1);
            this.total--;
            return child;
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
            this.list[i][callback].apply(this.list[i], args);
        }

    }

};

/**
* 
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
* 
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
