/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2013-2023 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Class = require('../utils/Class');
var EventEmitter = require('eventemitter3');
var Events = require('./events');

/**
 * @classdesc
 * A Process Queue maintains three internal lists.
 *
 * The `pending` list is a selection of items which are due to be made 'active' in the next update.
 * The `active` list is a selection of items which are considered active and should be updated.
 * The `destroy` list is a selection of items that were active and are awaiting being destroyed in the next update.
 *
 * When new items are added to a Process Queue they are put in the pending list, rather than being added
 * immediately the active list. Equally, items that are removed are put into the destroy list, rather than
 * being destroyed immediately. This allows the Process Queue to carefully process each item at a specific, fixed
 * time, rather than at the time of the request from the API.
 *
 * @class ProcessQueue
 * @extends Phaser.Events.EventEmitter
 * @memberof Phaser.Structs
 * @constructor
 * @since 3.0.0
 *
 * @generic T
 */
var ProcessQueue = new Class({

    Extends: EventEmitter,

    initialize:

    function ProcessQueue ()
    {
        EventEmitter.call(this);

        /**
         * The `pending` list is a selection of items which are due to be made 'active' in the next update.
         *
         * @genericUse {T[]} - [$type]
         *
         * @name Phaser.Structs.ProcessQueue#_pending
         * @type {Array.<*>}
         * @private
         * @default []
         * @since 3.0.0
         */
        this._pending = [];

        /**
         * The `active` list is a selection of items which are considered active and should be updated.
         *
         * @genericUse {T[]} - [$type]
         *
         * @name Phaser.Structs.ProcessQueue#_active
         * @type {Array.<*>}
         * @private
         * @default []
         * @since 3.0.0
         */
        this._active = [];

        /**
         * The `destroy` list is a selection of items that were active and are awaiting being destroyed in the next update.
         *
         * @genericUse {T[]} - [$type]
         *
         * @name Phaser.Structs.ProcessQueue#_destroy
         * @type {Array.<*>}
         * @private
         * @default []
         * @since 3.0.0
         */
        this._destroy = [];

        /**
         * The total number of items awaiting processing.
         *
         * @name Phaser.Structs.ProcessQueue#_toProcess
         * @type {number}
         * @private
         * @default 0
         * @since 3.0.0
         */
        this._toProcess = 0;

        /**
         * If `true` only unique objects will be allowed in the queue.
         *
         * @name Phaser.Structs.ProcessQueue#checkQueue
         * @type {boolean}
         * @since 3.50.0
         */
        this.checkQueue = false;
    },

    /**
     * Checks the given item to see if it is already active within this Process Queue.
     *
     * @method Phaser.Structs.ProcessQueue#isActive
     * @since 3.60.0
     *
     * @genericUse {T} - [item]
     * @genericUse {Phaser.Structs.ProcessQueue.<T>} - [$return]
     *
     * @param {*} item - The item to check.
     *
     * @return {boolean} `true` if the item is active, otherwise `false`.
     */
    isActive: function (item)
    {
        return (this._active.indexOf(item) > -1);
    },

    /**
     * Checks the given item to see if it is already pending addition to this Process Queue.
     *
     * @method Phaser.Structs.ProcessQueue#isPending
     * @since 3.60.0
     *
     * @genericUse {T} - [item]
     * @genericUse {Phaser.Structs.ProcessQueue.<T>} - [$return]
     *
     * @param {*} item - The item to check.
     *
     * @return {boolean} `true` if the item is pending insertion, otherwise `false`.
     */
    isPending: function (item)
    {
        return (this._toProcess > 0 && this._pending.indexOf(item) > -1);
    },

    /**
     * Checks the given item to see if it is already pending destruction from this Process Queue.
     *
     * @method Phaser.Structs.ProcessQueue#isDestroying
     * @since 3.60.0
     *
     * @genericUse {T} - [item]
     * @genericUse {Phaser.Structs.ProcessQueue.<T>} - [$return]
     *
     * @param {*} item - The item to check.
     *
     * @return {boolean} `true` if the item is pending destruction, otherwise `false`.
     */
    isDestroying: function (item)
    {
        return (this._destroy.indexOf(item) > -1);
    },

    /**
     * Adds a new item to the Process Queue.
     *
     * The item is added to the pending list and made active in the next update.
     *
     * @method Phaser.Structs.ProcessQueue#add
     * @since 3.0.0
     *
     * @genericUse {T} - [item]
     * @genericUse {Phaser.Structs.ProcessQueue.<T>} - [$return]
     *
     * @param {*} item - The item to add to the queue.
     *
     * @return {*} The item that was added.
     */
    add: function (item)
    {
        //  Don't add if already active or pending, but DO add if active AND in the destroy list
        if (this.checkQueue && (this.isActive(item) && !this.isDestroying(item)) || this.isPending(item))
        {
            return item;
        }

        this._pending.push(item);

        this._toProcess++;

        return item;
    },

    /**
     * Removes an item from the Process Queue.
     *
     * The item is added to the 'destroy' list and is fully removed in the next update.
     *
     * @method Phaser.Structs.ProcessQueue#remove
     * @since 3.0.0
     *
     * @genericUse {T} - [item]
     * @genericUse {Phaser.Structs.ProcessQueue.<T>} - [$return]
     *
     * @param {*} item - The item to be removed from the queue.
     *
     * @return {*} The item that was removed.
     */
    remove: function (item)
    {
        //  Check if it's in the _pending list
        if (this.isPending(item))
        {
            var pending = this._pending;

            var idx = pending.indexOf(item);

            if (idx !== -1)
            {
                //  Remove directly, no need to wait for an update loop
                pending.splice(idx, 1);
            }
        }
        else if (this.isActive(item))
        {
            //  Item is actively running? Queue it for deletion
            this._destroy.push(item);

            this._toProcess++;
        }

        //  If neither of the above conditions pass, then the item is either already in the destroy list,
        //  or isn't pending or active, so cannot be removed anyway

        return item;
    },

    /**
     * Removes all active items from this Process Queue.
     *
     * All the items are marked as 'pending destroy' and fully removed in the next update.
     *
     * @method Phaser.Structs.ProcessQueue#removeAll
     * @since 3.20.0
     *
     * @return {this} This Process Queue object.
     */
    removeAll: function ()
    {
        var list = this._active;
        var destroy = this._destroy;
        var i = list.length;

        while (i--)
        {
            destroy.push(list[i]);

            this._toProcess++;
        }

        return this;
    },

    /**
     * Update this queue. First it will process any items awaiting destruction, and remove them.
     *
     * Then it will check to see if there are any items pending insertion, and move them to an
     * active state. Finally, it will return a list of active items for further processing.
     *
     * @method Phaser.Structs.ProcessQueue#update
     * @since 3.0.0
     *
     * @genericUse {T[]} - [$return]
     *
     * @return {Array.<*>} A list of active items.
     */
    update: function ()
    {
        if (this._toProcess === 0)
        {
            //  Quick bail
            return this._active;
        }

        var list = this._destroy;
        var active = this._active;
        var i;
        var item;

        //  Clear the 'destroy' list
        for (i = 0; i < list.length; i++)
        {
            item = list[i];

            //  Remove from the 'active' array
            var idx = active.indexOf(item);

            if (idx !== -1)
            {
                active.splice(idx, 1);

                this.emit(Events.PROCESS_QUEUE_REMOVE, item);
            }
        }

        list.length = 0;

        //  Process the pending addition list
        //  This stops callbacks and out of sync events from populating the active array mid-way during an update

        list = this._pending;

        for (i = 0; i < list.length; i++)
        {
            item = list[i];

            if (!this.checkQueue || (this.checkQueue && active.indexOf(item) === -1))
            {
                active.push(item);

                this.emit(Events.PROCESS_QUEUE_ADD, item);
            }
        }

        list.length = 0;

        this._toProcess = 0;

        //  The owner of this queue can now safely do whatever it needs to with the active list
        return active;
    },

    /**
     * Returns the current list of active items.
     *
     * This method returns a reference to the active list array, not a copy of it.
     * Therefore, be careful to not modify this array outside of the ProcessQueue.
     *
     * @method Phaser.Structs.ProcessQueue#getActive
     * @since 3.0.0
     *
     * @genericUse {T[]} - [$return]
     *
     * @return {Array.<*>} A list of active items.
     */
    getActive: function ()
    {
        return this._active;
    },

    /**
     * The number of entries in the active list.
     *
     * @name Phaser.Structs.ProcessQueue#length
     * @type {number}
     * @readonly
     * @since 3.20.0
     */
    length: {

        get: function ()
        {
            return this._active.length;
        }

    },

    /**
     * Immediately destroys this process queue, clearing all of its internal arrays and resetting the process totals.
     *
     * @method Phaser.Structs.ProcessQueue#destroy
     * @since 3.0.0
     */
    destroy: function ()
    {
        this._toProcess = 0;

        this._pending = [];
        this._active = [];
        this._destroy = [];
    }

});

module.exports = ProcessQueue;
