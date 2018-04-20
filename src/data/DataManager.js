/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

var Class = require('../utils/Class');

/**
 * @callback DataEachCallback
 *
 * @param {*} parent - The parent object of the DataManager.
 * @param {string} key - The key of the value.
 * @param {*} value - The value.
 * @param {...*} [args] - Additional arguments that will be passed to the callback, after the game object, key, and data.
 */

/**
 * @classdesc
 * The Data Component features a means to store pieces of data specific to a Game Object, System or Plugin.
 * You can then search, query it, and retrieve the data. The parent must either extend EventEmitter,
 * or have a property called `events` that is an instance of it.
 *
 * @class DataManager
 * @memberOf Phaser.Data
 * @constructor
 * @since 3.0.0
 *
 * @param {object} parent - The object that this DataManager belongs to.
 * @param {Phaser.Events.EventEmitter} eventEmitter - The DataManager's event emitter.
 */
var DataManager = new Class({

    initialize:

    function DataManager (parent, eventEmitter)
    {
        /**
         * The object that this DataManager belongs to.
         *
         * @name Phaser.Data.DataManager#parent
         * @type {*}
         * @since 3.0.0
         */
        this.parent = parent;

        /**
         * The DataManager's event emitter.
         *
         * @name Phaser.Data.DataManager#events
         * @type {Phaser.Events.EventEmitter}
         * @since 3.0.0
         */
        this.events = eventEmitter;

        if (!eventEmitter)
        {
            this.events = (parent.events) ? parent.events : parent;
        }

        /**
         * The data list.
         *
         * @name Phaser.Data.DataManager#list
         * @type {Object.<string, *>}
         * @default {}
         * @since 3.0.0
         */
        this.list = {};

        /**
         * Whether setting data is blocked for this DataManager.
         *
         * Used temporarily to allow 'changedata' event listeners to prevent
         * specific data from being set.
         *
         * @name Phaser.Data.DataManager#blockSet
         * @type {boolean}
         * @default false
         * @since 3.0.0
         */
        this.blockSet = false;

        /**
         * Whether setting data is frozen for this DataManager.
         *
         * @name Phaser.Data.DataManager#_frozen
         * @type {boolean}
         * @private
         * @default false
         * @since 3.0.0
         */
        this._frozen = false;

        if (!parent.hasOwnProperty('sys') && this.events)
        {
            this.events.once('destroy', this.destroy, this);
        }
    },

    /**
     * Retrieves the value for the given key, or undefined if it doesn't exist.
     *
     * @method Phaser.Data.DataManager#get
     * @since 3.0.0
     *
     * @param {string} key - The key of the value to retrieve.
     *
     * @return {*} The value belonging to the given key.
     */
    get: function (key)
    {
        return this.list[key];
    },

    /**
     * Retrieves all data values.
     *
     * @method Phaser.Data.DataManager#getAll
     * @since 3.0.0
     *
     * @return {Object.<string, *>} All data values.
     */
    getAll: function ()
    {
        var results = {};

        for (var key in this.list)
        {
            if(this.list.hasOwnProperty(key))
            {
                results[key] = this.list[key];
            }
        }

        return results;
    },

    /**
     * Queries the DataManager for the values of keys matching the given search string.
     *
     * @method Phaser.Data.DataManager#query
     * @since 3.0.0
     *
     * @param {string} search - The search string.
     *
     * @return {Object.<string, *>} The values of the keys matching the search string.
     */
    query: function (search)
    {
        var results = {};

        for (var key in this.list)
        {
            if (this.list.hasOwnProperty(key) && key.match(search))
            {
                results[key] = this.list[key];
            }
        }

        return results;
    },

    /**
     * Sets the value for the given key.
     *
     * Emits the 'changedata' and 'setdata' events.
     *
     * @method Phaser.Data.DataManager#set
     * @since 3.0.0
     *
     * @param {string} key - The key to set the value for.
     * @param {*} data - The value to set.
     *
     * @return {Phaser.Data.DataManager} This DataManager object.
     */
    set: function (key, data)
    {
        if (this._frozen)
        {
            return this;
        }

        if (this.events.listenerCount('changedata') > 0)
        {
            this.blockSet = false;

            var _this = this;

            var resetFunction = function (value)
            {
                _this.blockSet = true;
                _this.list[key] = value;
                _this.events.emit('setdata', _this.parent, key, value);
            };

            this.events.emit('changedata', this.parent, key, data, resetFunction);

            //  One of the listeners blocked this update from being set, so abort
            if (this.blockSet)
            {
                return this;
            }
        }

        this.list[key] = data;

        this.events.emit('setdata', this.parent, key, data);

        return this;
    },

    /**
     * Passes all data entries to the given callback. Stores the result of the callback.
     *
     * @method Phaser.Data.DataManager#each
     * @since 3.0.0
     *
     * @param {DataEachCallback} callback - The function to call.
     * @param {*} [scope] - Value to use as `this` when executing callback.
     * @param {...*} [args] - Additional arguments that will be passed to the callback, after the game object, key, and data.
     *
     * @return {Phaser.Data.DataManager} This DataManager object.
     */
    each: function (callback, scope)
    {
        var args = [ this.parent, null, undefined ];

        for (var i = 1; i < arguments.length; i++)
        {
            args.push(arguments[i]);
        }

        for (var key in this.list)
        {
            args[1] = key;
            args[2] = this.list[key];

            callback.apply(scope, args);
        }

        return this;
    },

    /**
     * Merge the given data object into this DataManager's data object.
     *
     * @method Phaser.Data.DataManager#merge
     * @since 3.0.0
     *
     * @param {Object.<string, *>} data - The data to merge.
     * @param {boolean} overwrite - Whether to overwrite existing data. Defaults to true.
     *
     * @return {Phaser.Data.DataManager} This DataManager object.
     */
    merge: function (data, overwrite)
    {
        if (overwrite === undefined) { overwrite = true; }

        //  Merge data from another component into this one
        for (var key in data)
        {
            if (data.hasOwnProperty(key) && (overwrite || (!overwrite && !this.has(key))))
            {
                this.list[key] = data[key];
            }
        }

        return this;
    },

    /**
     * Remove the value for the given key.
     *
     * @method Phaser.Data.DataManager#remove
     * @since 3.0.0
     *
     * @param {string} key - The key to remove
     *
     * @return {Phaser.Data.DataManager} This DataManager object.
     */
    remove: function (key)
    {
        if (!this._frozen && this.has(key))
        {
            var data = this.list[key];

            delete this.list[key];

            this.events.emit('removedata', this, key, data);
        }

        return this;
    },

    /**
     * Retrieves the data associated with the given 'key', deletes it from this Data store, then returns it.
     *
     * @method Phaser.Data.DataManager#pop
     * @since 3.0.0
     *
     * @param {string} key - The key of the value to retrieve and delete.
     *
     * @return {*} The value of the given key.
     */
    pop: function (key)
    {
        var data = undefined;

        if (!this._frozen && this.has(key))
        {
            data = this.list[key];

            delete this.list[key];

            this.events.emit('removedata', this, key, data);
        }

        return data;
    },

    /**
     * Determines whether the given key is set in this Data store.
     *
     * @method Phaser.Data.DataManager#has
     * @since 3.0.0
     *
     * @param {string} key - The key to check.
     *
     * @return {boolean} Whether the key is set.
     */
    has: function (key)
    {
        return this.list.hasOwnProperty(key);
    },

    /**
     * Freeze or unfreeze this Data store, to allow or prevent setting its values.
     *
     * @method Phaser.Data.DataManager#setFreeze
     * @since 3.0.0
     *
     * @param {boolean} value - Whether to freeze the Data store.
     *
     * @return {Phaser.Data.DataManager} This DataManager object.
     */
    setFreeze: function (value)
    {
        this._frozen = value;

        return this;
    },

    /**
     * Delete all data in this Data store and unfreeze it.
     *
     * @method Phaser.Data.DataManager#reset
     * @since 3.0.0
     *
     * @return {Phaser.Data.DataManager} This DataManager object.
     */
    reset: function ()
    {
        for (var key in this.list)
        {
            delete this.list[key];
        }

        this.blockSet = false;
        this._frozen = false;

        return this;
    },

    /**
     * Destroy this data manager.
     *
     * @method Phaser.Data.DataManager#destroy
     * @since 3.0.0
     */
    destroy: function ()
    {
        this.reset();

        this.events.off('changedata');
        this.events.off('setdata');
        this.events.off('removedata');

        this.parent = null;
    },

    /**
     * Freeze this Data component, so no values can be set.
     *
     * @name Phaser.Data.DataManager#freeze
     * @type {boolean}
     * @since 3.0.0
     */
    freeze: {

        get: function ()
        {
            return this._frozen;
        },

        set: function (value)
        {
            this._frozen = (value) ? true : false;
        }

    },

    /**
     * Return the total number of entries in this Data component.
     *
     * @name Phaser.Data.DataManager#count
     * @type {integer}
     * @since 3.0.0
     */
    count: {

        get: function ()
        {
            var i = 0;

            for (var key in this.list)
            {
                if (this.list[key] !== undefined)
                {
                    i++;
                }
            }

            return i;
        }

    }

});

module.exports = DataManager;
