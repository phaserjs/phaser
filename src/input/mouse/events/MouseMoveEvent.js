var Class = require('../../../utils/Class');
var Event = require('../../../events/Event');

var MouseMoveEvent = new Class({

    Extends: Event,

    initialize:

    function MouseMoveEvent (nativeEvent)
    {
        Event.call(this, 'MOUSE_MOVE_EVENT');

        this.data = nativeEvent;

        this.x = nativeEvent.clientX;
        this.y = nativeEvent.clientY;
    }

});

module.exports = MouseMoveEvent;
