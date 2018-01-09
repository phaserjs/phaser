var Class = require('../../../utils/Class');
var Event = require('../../../events/Event');

var MouseDownEvent = new Class({

    Extends: Event,

    initialize:

    function MouseDownEvent (nativeEvent)
    {
        Event.call(this, 'MOUSE_DOWN_EVENT');

        this.data = nativeEvent;

        this.x = nativeEvent.clientX;
        this.y = nativeEvent.clientY;
    }

});

module.exports = MouseDownEvent;
