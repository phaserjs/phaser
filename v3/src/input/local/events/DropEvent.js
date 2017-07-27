var Class = require('../../../utils/Class');
var Event = require('../../../events/Event');

var DropEvent = new Class({

    Extends: Event,

    initialize:

    function DropEvent (pointer, gameObject, dropZone)
    {
        Event.call(this, 'DROP_EVENT');

        //  The Pointer that triggered the event
        this.pointer = pointer;

        //  The native DOM event (MouseEvent, TouchEvent, etc)
        this.event = pointer.event;

        //  The Game Object the event occurred on
        this.gameObject = gameObject;

        //  The drop zone the game object was dropped on
        this.dropZone = dropZone;

        //  The local x/y coordinates of the event within the Game Object
        // this.x = pointer.x;
        // this.y = pointer.y;

        // this.dragX = gameObject.input.dragX;
        // this.dragY = gameObject.input.dragY;

        //  The local x/y coordinates of the event within the Game Object
        // this.dragX = pointer.x - gameObject.input.dragX;
        // this.dragY = pointer.y - gameObject.input.dragY;
    }

});

module.exports = DropEvent;
