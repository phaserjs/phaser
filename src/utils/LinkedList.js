/**
* @author       Richard Davey <rich@photonstorm.com>
* @copyright    2014 Photon Storm Ltd.
* @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
*/

/**
* A basic Linked List data structure.
*
* This implementation _modifies_ the `prev` and `next` properties of each item added:
* - The `prev` and `next` properties must be writable and should not be used for any other purpose.
* - Items _cannot_ be added to multiple LinkedLists at the same time.
* - Only objects can be added.
*
* @class Phaser.LinkedList
* @constructor
*/
Phaser.LinkedList = function () {

    /**
    * Next element in the list.
    * @property {object} next
    * @default
    */
    this.next = null;

    /**
    * Previous element in the list.
    * @property {object} prev
    * @default
    */
    this.prev = null;

    /**
    * First element in the list.
    * @property {object} first
    * @default
    */
    this.first = null;

    /**
    * Last element in the list.
    * @property {object} last
    * @default
    */
    this.last = null;

    /**
    * Number of elements in the list.
    * @property {integer} total
    * @default
    */
    this.total = 0;

};

Phaser.LinkedList.prototype = {

    /**
    * Adds a new element to this linked list.
    *
    * @method Phaser.LinkedList#add
    * @param {object} item - The element to add to this list. Can be a Phaser.Sprite or any other object you need to quickly iterate through.
    * @return {object} The item that was added.
    */
    add: function (item) {

        //  If the list is empty
        if (this.total === 0 && this.first === null && this.last === null)
        {
            this.first = item;
            this.last = item;
            this.next = item;
            item.prev = this;
            this.total++;
            return item;
        }

        //  Gets appended to the end of the list, regardless of anything, and it won't have any children of its own (non-nested list)
        this.last.next = item;

        item.prev = this.last;

        this.last = item;

        this.total++;

        return item;

    },

    /**
    * Resets the first, last, next and previous node pointers in this list.
    *
    * @method Phaser.LinkedList#reset
    */
    reset: function () {

        this.first = null;
        this.last = null;
        this.next = null;
        this.prev = null;
        this.total = 0;

    },

    /**
    * Removes the given element from this linked list if it exists.
    *
    * @method Phaser.LinkedList#remove
    * @param {object} item - The item to be removed from the list.
    */
    remove: function (item) {

        if (this.total === 1)
        {
            this.reset();
            item.next = item.prev = null;
            return;
        }

        if (item === this.first)
        {
            // It was 'first', make 'first' point to first.next
            this.first = this.first.next;
        }
        else if (item === this.last)
        {
            // It was 'last', make 'last' point to last.prev
            this.last = this.last.prev;
        }

        if (item.prev)
        {
            // make item.prev.next point to childs.next instead of item
            item.prev.next = item.next;
        }

        if (item.next)
        {
            // make item.next.prev point to item.prev instead of item
            item.next.prev = item.prev;
        }

        item.next = item.prev = null;

        if (this.first === null )
        {
            this.last = null;
        }

        this.total--;

    },

    /**
    * Calls a function on all members of this list, using the member as the context for the callback.
    * The function must exist on the member.
    *
    * @method Phaser.LinkedList#callAll
    * @param {function} callback - The function to call.
    */
    callAll: function (callback) {

        if (!this.first || !this.last)
        {
            return;
        }

        var entity = this.first;

        do
        {
            if (entity && entity[callback])
            {
                entity[callback].call(entity);
            }

            entity = entity.next;

        }
        while(entity != this.last.next);

    }

};

Phaser.LinkedList.prototype.constructor = Phaser.LinkedList;
