var Class = require('../../../utils/Class');
var Event = require('../../../events/Event');

var KeyUpEvent = new Class({

    Extends: Event,

    initialize:

    function KeyUpEvent (keyboardEvent)
    {
        Event.call(this, 'KEY_UP_EVENT');

        this.data = keyboardEvent;
    }

});

module.exports = KeyUpEvent;
