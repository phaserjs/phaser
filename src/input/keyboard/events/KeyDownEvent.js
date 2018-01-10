var Class = require('../../../utils/Class');
var Event = require('../../../events/Event');

var KeyDownEvent = new Class({

    Extends: Event,

    initialize:

    function KeyDownEvent (keyboardEvent)
    {
        Event.call(this, 'KEY_DOWN_EVENT');

        this.data = keyboardEvent;
    }

});

module.exports = KeyDownEvent;
