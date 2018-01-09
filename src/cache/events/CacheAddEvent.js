var Class = require('../../utils/Class');
var Event = require('../../events/Event');

var CacheAddEvent = new Class({

    Extends: Event,

    initialize:

    /**
     * [description]
     *
     * @event CacheAddEvent
     * @type {Phaser.Event}
     *
     * @param {Phaser.Cache.BaseCache} cache - [description]
     * @param {string} key - [description]
     * @param {any} data - [description]
     */
    function CacheAddEvent (cache, key, data)
    {
        Event.call(this, 'CACHE_ADD_EVENT');

        this.cache = cache;
        this.key = key;
        this.data = data;
    }

});

module.exports = CacheAddEvent;
