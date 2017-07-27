var Class = require('../../../utils/Class');
var Event = require('../../../events/Event');

var DragEndEvent = new Class({

    Extends: Event,

    initialize:

    function DragEndEvent (pointer, gameObject)
    {
        Event.call(this, 'DRAG_END_EVENT');

        //  The Pointer that triggered the event
        this.pointer = pointer;

        //  The native DOM event (MouseEvent, TouchEvent, etc)
        this.event = pointer.event;

        //  The Game Object the event occurred on
        this.gameObject = gameObject;

        //  The local x/y coordinates of the event within the Game Object
        this.x = pointer.x;
        this.y = pointer.y;
    }

});

module.exports = DragEndEvent;
