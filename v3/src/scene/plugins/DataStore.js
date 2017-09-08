var Class = require('../../utils/Class');
var Data = require('./Data');

var DataStore = new Class({

    initialize:

    function DataStore (scene)
    {
        this.scene = scene;

        this.events = scene.sys.events;

        this.list = {};
    },

    register: function (parent)
    {
        var data = new Data(parent, this.events);

        this.list[parent] = data;

        return data;
    },

    getData: function (gameObject)
    {
        if (!this.list.hasOwnProperty(gameObject))
        {
            this.list[gameObject] = new Data(gameObject, this.events);
        }

        return this.list[gameObject];
    },

    get: function (gameObject, key)
    {
        var data = this.getData(gameObject);

        return data.get(key);
    },

    set: function (gameObject, key, value)
    {
        var data = this.getData(gameObject);

        return data.set(key, value);
    },

    getAll: function (gameObject)
    {
        var data = this.getData(gameObject);

        return data.getAll();
    },

    query: function (gameObject, search)
    {
        var data = this.getData(gameObject);

        return data.query(search);
    },

    before: function (gameObject, key, callback, scope)
    {
        var data = this.getData(gameObject);

        return data.before(key, callback, scope);
    },

    after: function (gameObject, key, callback, scope)
    {
        var data = this.getData(gameObject);

        return data.after(key, callback, scope);
    },

    each: function (gameObject, callback, scope, args)
    {
        var data = this.getData(gameObject);

        return data.each(callback, scope);
    },

    merge: function (gameObject, data, overwrite)
    {
        var data = this.getData(gameObject);

        return data.merge(data, overwrite);
    },

    remove: function (gameObject, key)
    {
        var data = this.getData(gameObject);

        return data.remove(key);
    },

    removeListeners: function (gameObject, key)
    {
        var data = this.getData(gameObject);

        return data.removeListeners(key);
    },

    pop: function (gameObject, key)
    {
        var data = this.getData(gameObject);

        return data.pop(key);
    },

    has: function (gameObject, key)
    {
        var data = this.getData(gameObject);

        return data.has(key);
    },

    reset: function (gameObject)
    {
        var data = this.getData(gameObject);

        return data.reset();
    },

    freeze: function (gameObject)
    {
        var data = this.getData(gameObject);

        data.freeze = true;
    },

    unfreeze: function (gameObject)
    {
        var data = this.getData(gameObject);

        data.freeze = false;
    },

    kill: function (gameObject)
    {
        if (this.list.hasOwnProperty(gameObject))
        {
            var data = this.list[gameObject];

            data.destroy();

            delete this.list[gameObject];
        }
    }

});

module.exports = DataStore;
