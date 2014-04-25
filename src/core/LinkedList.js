/**
* @author       Richard Davey <rich@photonstorm.com>
* @copyright    2014 Photon Storm Ltd.
* @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
*/

/**
* A basic linked list data structure.
*
* @class Phaser.LinkedList
* @constructor
*/
Phaser.LinkedList = function () {

    /**
    * @property {object} next - Next element in the list.
    * @default
    */
    this.next = null;

    /**
    * @property {object} prev - Previous element in the list.
    * @default
    */
    this.prev = null;

    /**
    * @property {object} first - First element in the list.
    * @default
    */
    this.first = null;

    /**
    * @property {object} last - Last element in the list.
    * @default
    */
    this.last = null;

    /**
    * @property {number} total - Number of elements in the list.
    * @default
    */
    this.total = 0;

};

Phaser.LinkedList.prototype = {

    /**
    * Adds a new element to this linked list.
    *
    * @method Phaser.LinkedList#add
    * @param {object} child - The element to add to this list. Can be a Phaser.Sprite or any other object you need to quickly iterate through.
    * @return {object} The child that was added.
    */
    add: function (child) {

        //  If the list is empty
        if (this.total === 0 && this.first === null && this.last === null)
        {
            this.first = child;
            this.last = child;
            this.next = child;
            child.prev = this;
            this.total++;
            return child;
        }

        //  Gets appended to the end of the list, regardless of anything, and it won't have any children of its own (non-nested list)
        this.last.next = child;

        child.prev = this.last;

        this.last = child;

        this.total++;

        return child;

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
    * @param {object} child - The child to be removed from the list.
    */
    remove: function (child) {

        if (this.total === 1)
        {
            this.reset();
            child.next = child.prev = null;
            return;
        }

        if (child === this.first)
        {
            // It was 'first', make 'first' point to first.next
            this.first = this.first.next;
        }
        else if (child === this.last)
        {
            // It was 'last', make 'last' point to last.prev
            this.last = this.last.prev;
        }

        if (child.prev)
        {
            // make child.prev.next point to childs.next instead of child
            child.prev.next = child.next;
        }

        if (child.next)
        {
            // make child.next.prev point to child.prev instead of child
            child.next.prev = child.prev;
        }

        child.next = child.prev = null;

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
