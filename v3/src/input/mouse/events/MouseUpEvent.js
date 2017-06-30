var Class = require('../../../utils/Class');
var Event = require('../../../events/Event');

var MouseUpEvent = new Class({

    Extends: Event,

    initialize:

    function MouseUpEvent (nativeEvent)
    {
        Event.call(this, 'MOUSE_UP_EVENT');

        this.data = nativeEvent;

        this.x = nativeEvent.clientX;
        this.y = nativeEvent.clientY;
    }

});

module.exports = MouseUpEvent;
