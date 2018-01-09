/**
* @author       Richard Davey <rich@photonstorm.com>
* @copyright    2016 Photon Storm Ltd.
* @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
*/

/**
* The Data Component features a means to store pieces of data specific to a Game Object,
* search it, query it, and retrieve it.
*
* @class
*/
Phaser.Component.Data = function (parent)
{
    this.parent = parent;

    this.list = {};

    this._beforeCallbacks = {};
    this._afterCallbacks = {};

    this._frozen = false;
};

Phaser.Component.Data.prototype.constructor = Phaser.Component.Data;

Phaser.Component.Data.prototype = {

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

        var listener;
        var result;

        //  If there is a 'before' callback, then check it for a result
        if (this._beforeCallbacks.hasOwnProperty(key))
        {
            listener = this._beforeCallbacks[key];

            result = listener.callback.call(listener.scope, this.parent, key, data);

            if (result !== undefined)
            {
                data = result;
            }
        }

        this.list[key] = data;

        //  If there is a 'after' callback, then check it for a result
        if (this._afterCallbacks.hasOwnProperty(key))
        {
            listener = this._afterCallbacks[key];

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
            delete this._beforeCallbacks[key];
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
            delete this._afterCallbacks[key];
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
            if (overwrite || (!overwrite && !this.has(key)))
            {
                this.list[key] = data;
            }
        }
    },

    remove: function (key)
    {
        if (!this._frozen && this.has(key))
        {
            delete this.list[key];

            this.removeListeners(key);
        }
    },

    removeListeners: function (key)
    {
        if (this._beforeCallbacks.hasOwnProperty(key))
        {
            delete this._beforeCallbacks[key];
        }

        if (this._afterCallbacks.hasOwnProperty(key))
        {
            delete this._afterCallbacks[key];
        }
    },

    //  Gets the data associated with the given 'key', deletes it from this Data store, then returns it.
    pop: function (key)
    {
        var data = undefined;

        if (!this._frozen && this.has(key))
        {
            data = this.list[key];

            delete this.list[key];

            this.removeListeners(key);
        }

        return data;
    },

    has: function (key)
    {
        return this.list.hasOwnProperty(key);
    },

    reset: function ()
    {
        for (var key in this.list)
        {
            delete this.list[key];
        }

        for (key in this._beforeCallbacks)
        {
            delete this._beforeCallbacks[key];
        }

        for (key in this._afterCallbacks)
        {
            delete this._afterCallbacks[key];
        }

        this._frozen = false;
    }

};

Object.defineProperties(Phaser.Component.Data.prototype, {

    /**
    * Freeze this Data component, so no changes can be written to it.
    *
    * @name freeze
    * @property {boolean} freeze
    */
    freeze: {

        enumerable: true,

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

        enumerable: true,

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
