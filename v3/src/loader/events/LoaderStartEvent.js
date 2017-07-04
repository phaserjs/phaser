var Class = require('../../utils/Class');
var Event = require('../../events/Event');

var LoaderStartEvent = new Class({

    Extends: Event,

    initialize:

    function LoaderStartEvent (loader)
    {
        Event.call(this, 'LOADER_START_EVENT');

        this.loader = loader;
    }

});

module.exports = LoaderStartEvent;
