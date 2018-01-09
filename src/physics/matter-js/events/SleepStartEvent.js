var Class = require('../../../utils/Class');
var Event = require('../../../events/Event');

var SleepStartEvent = new Class({

    Extends: Event,

    initialize:

    function SleepStartEvent (event, body)
    {
        Event.call(this, 'SLEEP_START_EVENT');

        this.body = body;

    }

});

module.exports = SleepStartEvent;
