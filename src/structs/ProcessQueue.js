/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

var Class = require('../utils/Class');

/**
 * @classdesc
 * [description]
 *
 * @class ProcessQueue
 * @memberOf Phaser.Structs
 * @constructor
 * @since 3.0.0
 */
var ProcessQueue = new Class({

    initialize:

    function ProcessQueue ()
    {
        /**
         * [description]
         *
         * @name Phaser.Structs.ProcessQueue#_pending
         * @type {array}
         * @private
         * @default []
         * @since 3.0.0
         */
        this._pending = [];

        /**
         * [description]
         *
         * @name Phaser.Structs.ProcessQueue#_active
         * @type {array}
         * @private
         * @default []
         * @since 3.0.0
         */
        this._active = [];

        /**
         * [description]
         *
         * @name Phaser.Structs.ProcessQueue#_destroy
         * @type {array}
         * @private
         * @default []
         * @since 3.0.0
         */
        this._destroy = [];

        /**
         * [description]
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
     * [description]
     *
     * @method Phaser.Structs.ProcessQueue#add
     * @since 3.0.0
     *
     * @param {any} item - [description]
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
     * [description]
     *
     * @method Phaser.Structs.ProcessQueue#remove
     * @since 3.0.0
     *
     * @param {any} item - [description]
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
     * [description]
     *
     * @method Phaser.Structs.ProcessQueue#update
     * @since 3.0.0
     *
     * @return {array} [description]
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
     * [description]
     *
     * @method Phaser.Structs.ProcessQueue#getActive
     * @since 3.0.0
     *
     * @return {array} [description]
     */
    getActive: function ()
    {
        return this._active;
    },

    /**
     * [description]
     *
     * @method Phaser.Structs.ProcessQueue#destroy
     * @since 3.0.0
     */
    destroy: function ()
    {
        this._pending = [];
        this._active = [];
        this._destroy = [];
    }

});

module.exports = ProcessQueue;
