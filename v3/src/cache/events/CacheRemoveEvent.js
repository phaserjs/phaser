var Class = require('../../utils/Class');
var Event = require('../../events/Event');

var CacheRemoveEvent = new Class({

    Extends: Event,

    initialize:

    function CacheRemoveEvent (cache, key, data)
    {
        Event.call(this, 'CACHE_REMOVE_EVENT');

        this.cache = cache;
        this.key = key;
        this.data = data;
    }

});

module.exports = CacheRemoveEvent;
