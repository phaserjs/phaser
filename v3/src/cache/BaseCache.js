var CacheEntry = require('./CacheEntry');
var Events = require('./events');
var EventDispatcher = require('../events/EventDispatcher');

var BaseCache = function ()
{
    this.entries = new Map();

    this.events = new EventDispatcher();
};

BaseCache.prototype.constructor = BaseCache;

BaseCache.prototype = {

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

};

module.exports = BaseCache;
