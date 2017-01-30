var Event = require('../../events/Event');

var CacheAddEvent = function (cache, key, data)
{
    Event.call(this, 'CACHE_ADD_EVENT');

    this.cache = cache;
    this.key = key;
    this.data = data;
};

CacheAddEvent.prototype = Object.create(Event.prototype);
CacheAddEvent.prototype.constructor = CacheAddEvent;

module.exports = CacheAddEvent;
