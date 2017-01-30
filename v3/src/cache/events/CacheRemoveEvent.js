var Event = require('../../events/Event');

var CacheRemoveEvent = function (cache, key, data)
{
    Event.call(this, 'CACHE_ADD_EVENT');

    this.cache = cache;
    this.key = key;
    this.data = data;
};

CacheRemoveEvent.prototype = Object.create(Event.prototype);
CacheRemoveEvent.prototype.constructor = CacheRemoveEvent;

module.exports = CacheRemoveEvent;
