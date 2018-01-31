var Class = require('../utils/Class');

//  Phaser.Data.DataManager

/**
* The Data Component features a means to store pieces of data specific to a Game Object, System or Plugin.
* You can then search, query it, and retrieve the data. The parent must either extend EventEmitter,
* or have a property called `events` that is an instance of it.
*/
var DataManager = new Class({

    initialize:

    function DataManager (parent, eventEmitter)
    {
        this.parent = parent;

        this.events = eventEmitter;

        if (!eventEmitter)
        {
            this.events = (parent.events) ? parent.events : parent;
        }

        this.list = {};

        this.blockSet = false;

        this._frozen = false;

        this.events.once('destroy', this.destroy, this);
    },

    //  Retrieves the value for the given key, or undefined if it doesn't exist.
    get: function (key)
    {
        return this.list[key];
    },

    getAll: function ()
    {
        var results = {};

        for (var key in this.list)
        {
            results[key] = this.list[key];
        }

        return results;
    },

    query: function (search)
    {
        var results = {};

        for (var key in this.list)
        {
            if (key.match(search))
            {
                results[key] = this.list[key];
            }
        }

        return results;
    },

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
    * @method each
    * @param {function} callback - The function to call.
    * @param {object} [scope] - Value to use as `this` when executing callback.
    * @param {...*} [arguments] - Additional arguments that will be passed to the callback, after the game object, key, and data.
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

    merge: function (data, overwrite)
    {
        if (overwrite === undefined) { overwrite = true; }

        //  Merge data from another component into this one
        for (var key in data)
        {
            if (overwrite || (!overwrite && !this.has(key)))
            {
                this.list[key] = data;
            }
        }

        return this;
    },

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

    //  Gets the data associated with the given 'key', deletes it from this Data store, then returns it.
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

    has: function (key)
    {
        return this.list.hasOwnProperty(key);
    },

    setFreeze: function (value)
    {
        this._frozen = value;

        return this;
    },

    reset: function ()
    {
        for (var key in this.list)
        {
            delete this.list[key];
        }

        this.blockSet = false;
        this._frozen = false;
    },

    destroy: function ()
    {
        this.reset();

        this.events.off('changedata');
        this.events.off('setdata');
        this.events.off('removedata');

        this.parent = null;
    },

    /**
    * Freeze this Data component, so no changes can be written to it.
    *
    * @name freeze
    * @property {boolean} freeze
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
