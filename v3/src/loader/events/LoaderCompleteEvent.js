var Class = require('../../utils/Class');
var Event = require('../../events/Event');

var LoaderCompleteEvent = new Class({

    Extends: Event,

    initialize:

    function LoaderCompleteEvent (loader)
    {
        Event.call(this, 'LOADER_COMPLETE_EVENT');

        this.loader = loader;
    }

});

module.exports = LoaderCompleteEvent;
