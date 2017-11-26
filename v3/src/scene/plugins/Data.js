var Class = require('../../utils/Class');
var EventDispatcher = require('../../events/EventDispatcher');

/**
* The Data Component features a means to store pieces of data specific to a Game Object,
* search it, query it, and retrieve it.
*/
var Data = new Class({

    initialize:

    function Data (parent, eventDispatcher)
    {
        this.parent = parent;

        this.events = eventDispatcher || new EventDispatcher();

        this.list = {};

        this._beforeCallbacks = {};
        this._afterCallbacks = {};

        this._frozen = false;
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
            if (this.list[key] !== undefined)
            {
                results[key] = this.list[key];
            }
        }

        return results;
    },

    query: function (search)
    {
        var results = {};

        for (var key in this.list)
        {
            if (this.list[key] !== undefined && key.match(search))
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

        var listener;
        var result;

        //  If there is a 'before' callback, then check it for a result
        //  This means a property can only ever have 1 callback, which isn't right - we may need more
        //  Dispatch event instead?
        listener = this._beforeCallbacks[key];
        if (listener)
        {
            result = listener.callback.call(listener.scope, this.parent, key, data);

            if (result !== undefined)
            {
                data = result;
            }
        }

        // this.events.dispatch(new Event.LOADER_START_EVENT(this));

        this.list[key] = data;

        //  If there is a 'after' callback, then check it for a result
        listener = this._afterCallbacks[key];
        if (listener)
        {
            result = listener.callback.call(listener.scope, this.parent, key, data);

            if (result !== undefined)
            {
                this.list[key] = result;
            }
        }

        return this;
    },

    before: function (key, callback, scope)
    {
        if (callback === undefined)
        {
            //  Remove entry
            this._beforeCallbacks[key] = undefined;
        }
        else
        {
            this._beforeCallbacks[key] = { callback: callback, scope: scope };
        }
    },

    after: function (key, callback, scope)
    {
        if (callback === undefined)
        {
            //  Remove entry
            this._afterCallbacks[key] = undefined;
        }
        else
        {
            this._afterCallbacks[key] = { callback: callback, scope: scope };
        }
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
            if (this.list[key] === undefined) { continue; }
            args[1] = key;
            args[2] = this.list[key];

            callback.apply(scope, args);
        }
    },

    merge: function (data, overwrite)
    {
        if (overwrite === undefined) { overwrite = true; }

        //  Merge data from another component into this one
        for (var key in data)
        {
            if (overwrite || this.list[key] === undefined)
            {
                this.list[key] = data;
            }
        }
    },

    remove: function (key)
    {
        if (!this._frozen && this.list[key] !== undefined)
        {
            this.list[key] = undefined;

            this.removeListeners(key);
        }
    },

    removeListeners: function (key)
    {
        if (this._beforeCallbacks[key] !== undefined)
        {
            this._beforeCallbacks[key] = undefined;
        }

        if (this._afterCallbacks[key] !== undefined)
        {
            this._afterCallbacks[key] = undefined;
        }
    },

    //  Gets the data associated with the given 'key', deletes it from this Data store, then returns it.
    pop: function (key)
    {
        if (!this._frozen && this.list[key] !== undefined)
        {
            var data = this.list[key];

            this.list[key] = undefined;

            this.removeListeners(key);

            return data;
        }
    },

    has: function (key)
    {
        return this.list[key] !== undefined;
    },

    reset: function ()
    {
        this.list = {};
        this._beforeCallbacks = {};
        this._afterCallbacks = {};
        this._frozen = false;
    },

    destroy: function ()
    {
        this.reset();

        this.parent = null;

        this.events = null;
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
            this._frozen = !!value;
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

module.exports = Data;
