var Class = require('../../utils/Class');
var Event = require('../../events/Event');

var CacheAddEvent = new Class({

    Extends: Event,

    initialize:

    function CacheAddEvent (cache, key, data)
    {
        Event.call(this, 'CACHE_ADD_EVENT');

        this.cache = cache;
        this.key = key;
        this.data = data;
    }

});

module.exports = CacheAddEvent;
