var Class = require('../../../utils/Class');
var Event = require('../../../events/Event');

var PointerUpEvent = new Class({

    Extends: Event,

    initialize:

    function PointerUpEvent (pointer, gameObjects)
    {
        Event.call(this, 'POINTER_UP_EVENT');

        //  The Pointer that triggered the event
        this.pointer = pointer;

        //  The native DOM event (MouseEvent, TouchEvent, etc)
        this.event = pointer.event;

        //  The button that was released. This is read directly from the DOM event.
        this.button = pointer.event.button;

        //  The x/y coordinates of the event
        this.x = pointer.x;
        this.y = pointer.y;

        //  An array of all the game objects the pointer event occurred on in display list order.
        //  Will be empty if no objects were interacted with.
        //  If populated, the bottom element (list[0]) is the highest object on the display list.
        //  If InputManager.topOnly is true this array will only contain one element.
        this.list = gameObjects;

        //  A reference to the top-most object on the display list (same as event.list[0])
        this.gameObject = (gameObjects.length > 0) ? gameObjects[gameObjects.length - 1].gameObject : undefined;
    }

});

module.exports = PointerUpEvent;
