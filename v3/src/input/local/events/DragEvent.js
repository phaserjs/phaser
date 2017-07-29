var Class = require('../../../utils/Class');
var Event = require('../../../events/Event');

var DragEvent = new Class({

    Extends: Event,

    initialize:

    function DragEvent (pointer, gameObject)
    {
        Event.call(this, 'DRAG_EVENT');

        //  The Pointer that triggered the event
        this.pointer = pointer;

        //  The native DOM event (MouseEvent, TouchEvent, etc)
        this.event = pointer.event;

        //  The Game Object the event occurred on
        this.gameObject = gameObject;

        //  The camera on which the input event occurred
        this.camera = pointer.camera;

        //  The local x/y coordinates of the event within the Game Object
        this.x = pointer.x;
        this.y = pointer.y;

        //  The local x/y coordinates of the event within the Game Object
        this.dragX = pointer.x - gameObject.input.dragX;
        this.dragY = pointer.y - gameObject.input.dragY;
    }

});

module.exports = DragEvent;
