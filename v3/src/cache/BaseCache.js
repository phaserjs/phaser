var CacheEntry = require('./CacheEntry');

var BaseCache = function ()
{
    this.entries = new Map();
};

BaseCache.prototype.constructor = BaseCache;

BaseCache.prototype = {

    add: function (key, data)
    {
        this.files.set(key, data);
    },

    has: function (key)
    {
        return this.files.has(key);
    },

    get: function (key)
    {
        return this.files.get(key);
    },

    remove: function (key)
    {
        this.files.delete(key);
    },

    destroy: function ()
    {
        this.files.clear();
    }

};

module.exports = BaseCache;
