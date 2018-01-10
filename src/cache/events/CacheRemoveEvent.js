var Class = require('../../utils/Class');
var Event = require('../../events/Event');

var CacheRemoveEvent = new Class({

    Extends: Event,

    initialize:

    /**
     * [description]
     *
     * @event CacheRemoveEvent
     * @type {Phaser.Event}
     *
     * @param {Phaser.Cache.BaseCache} cache - [description]
     * @param {string} key - [description]
     * @param {any} data - [description]
     */
    function CacheRemoveEvent (cache, key, data)
    {
        Event.call(this, 'CACHE_REMOVE_EVENT');

        this.cache = cache;
        this.key = key;
        this.data = data;
    }

});

module.exports = CacheRemoveEvent;
