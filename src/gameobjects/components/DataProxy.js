var Class = require('../../utils/Class');

var DataProxy = new Class({

    initialize:

    function DataProxy (scene, gameObject)
    {
        this.manager = scene.sys.dataStore;

        this.gameObject = gameObject;
    },

    set: function (key, value)
    {
        return this.manager.set(this.gameObject, key, value);
    },

    get: function (key)
    {
        return this.manager.get(this.gameObject, key);
    },

    getAll: function ()
    {
        return this.manager.getAll(this.gameObject);
    },

    query: function (search)
    {
        return this.manager.query(this.gameObject, search);
    },

    before: function (key, callback, scope)
    {
        return this.manager.before(this.gameObject, key, callback, scope);
    },

    after: function (key, callback, scope)
    {
        return this.manager.after(this.gameObject, key, callback, scope);
    },

    each: function (callback, scope)
    {
        var args = [ this.gameObject, null, undefined ];

        for (var i = 2; i < arguments.length; i++)
        {
            args.push(arguments[i]);
        }

        return this.manager.each(this.gameObject, callback, scope, args);
    },

    merge: function (data, overwrite)
    {
        return this.manager.merge(this.gameObject, data, overwrite);
    },

    remove: function (key)
    {
        return this.manager.remove(this.gameObject, key);
    },

    removeListeners: function (key)
    {
        return this.manager.removeListeners(this.gameObject, key);
    },

    pop: function (key)
    {
        return this.manager.pop(this.gameObject, key);
    },

    has: function (key)
    {
        return this.manager.has(this.gameObject, key);
    },

    reset: function ()
    {
        return this.manager.reset(this.gameObject);
    },

    freeze: function ()
    {
        this.manager.freeze(this.gameObject);
    },

    unfreeze: function ()
    {
        this.manager.unfreeze(this.gameObject);
    },

    destroy: function ()
    {
        this.manager.kill(this.gameObject);

        this.manager = null;
        this.gameObject = null;
    }

});

module.exports = DataProxy;
