/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2019 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Class = require('../utils/Class');

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
 * @memberof Phaser.Structs
 * @constructor
 * @since 3.0.0
 *
 * @generic T
 */
var ProcessQueue = new Class({

    initialize:

    function ProcessQueue ()
    {
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
         * @type {integer}
         * @private
         * @default 0
         * @since 3.0.0
         */
        this._toProcess = 0;
    },

    /**
     * Adds a new item to the Process Queue.
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
     * @return {Phaser.Structs.ProcessQueue} This Process Queue object.
     */
    add: function (item)
    {
        this._pending.push(item);

        this._toProcess++;

        return this;
    },

    /**
     * Removes an item from the Process Queue.
     * The item is added to the pending destroy and fully removed in the next update.
     *
     * @method Phaser.Structs.ProcessQueue#remove
     * @since 3.0.0
     *
     * @genericUse {T} - [item]
     * @genericUse {Phaser.Structs.ProcessQueue.<T>} - [$return]
     *
     * @param {*} item - The item to be removed from the queue.
     *
     * @return {Phaser.Structs.ProcessQueue} This Process Queue object.
     */
    remove: function (item)
    {
        this._destroy.push(item);

        this._toProcess++;

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
            }
        }

        list.length = 0;

        //  Process the pending addition list
        //  This stops callbacks and out of sync events from populating the active array mid-way during an update

        list = this._pending;

        for (i = 0; i < list.length; i++)
        {
            item = list[i];

            this._active.push(item);
        }

        list.length = 0;

        this._toProcess = 0;

        //  The owner of this queue can now safely do whatever it needs to with the active list
        return this._active;
    },

    /**
     * Returns the current list of active items.
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
