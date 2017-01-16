var CacheEntry = require('./CacheEntry');

var BaseCache = function ()
{
    this.entries = new Map();
};

BaseCache.prototype.constructor = BaseCache;

BaseCache.prototype = {

    add: function (key, data)
    {
        this.entries.set(key, data);
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
        this.entries.delete(key);
    },

    destroy: function ()
    {
        this.entries.clear();
    }

};

module.exports = BaseCache;
