var Class = require('../../../utils/Class');
var Event = require('../../../events/Event');

var BeforeUpdateEvent = new Class({

    Extends: Event,

    initialize:

    function BeforeUpdateEvent (event)
    {
        Event.call(this, 'BEFORE_UPDATE_EVENT');

        this.event = event;
    }

});

module.exports = BeforeUpdateEvent;
