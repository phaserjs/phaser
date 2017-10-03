var Class = require('../utils/Class');
var EventDispatcher = require('../events/EventDispatcher');
var Events = require('./events');
var Map = require('../structs/Map');

//  Phaser.Cache.BaseCache

var BaseCache = new Class({

    initialize:

    function BaseCache ()
    {
        this.entries = new Map();

        this.events = new EventDispatcher();
    },

    add: function (key, data)
    {
        this.entries.set(key, data);

        this.events.dispatch(new Events.CACHE_ADD_EVENT(this, key, data));
    },

    has: function (key)
    {
        return this.entries.has(key);
    },

    get: function (key)
    {
        return this.entries.get(key);
    },

    remove: function (key)
    {
        var entry = this.get(key);

        if (entry)
        {
            this.entries.delete(key);

            this.events.dispatch(new Events.CACHE_REMOVE_EVENT(this, key, entry.data));
        }
    },

    destroy: function ()
    {
        this.entries.clear();
    }

});

module.exports = BaseCache;
