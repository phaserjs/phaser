var Class = require('../../../utils/Class');
var Event = require('../../../events/Event');

var SleepEndEvent = new Class({

    Extends: Event,

    initialize:

    function SleepEndEvent (event, body)
    {
        Event.call(this, 'SLEEP_END_EVENT');

        this.body = body;
    }

});

module.exports = SleepEndEvent;
