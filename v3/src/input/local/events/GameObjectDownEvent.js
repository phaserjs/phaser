var Class = require('../../../utils/Class');
var Event = require('../../../events/Event');

var GameObjectDownEvent = new Class({

    Extends: Event,

    initialize:

    function GameObjectDownEvent (pointer, interactiveObject)
    {
        Event.call(this, 'GAME_OBJECT_DOWN_EVENT');

        //  The Pointer that triggered the event
        this.pointer = pointer;

        //  The native DOM event (MouseEvent, TouchEvent, etc)
        this.event = pointer.event;

        //  The button that was used. This is read directly from the DOM event.
        this.button = pointer.event.button;

        //  The Game Object the event occurred on
        this.gameObject = interactiveObject.gameObject;

        //  The local x/y coordinates of the event within the Game Object
        this.x = interactiveObject.localX;
        this.y = interactiveObject.localY;
    }

});

module.exports = GameObjectDownEvent;
