var Class = require('../../../utils/Class');
var Event = require('../../../events/Event');

var AfterUpdateEvent = new Class({

    Extends: Event,

    initialize:

    function AfterUpdateEvent (event)
    {
        Event.call(this, 'AFTER_UPDATE_EVENT');

        this.event = event;
    }

});

module.exports = AfterUpdateEvent;
