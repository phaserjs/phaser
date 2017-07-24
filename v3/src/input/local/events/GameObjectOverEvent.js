var Class = require('../../../utils/Class');
var Event = require('../../../events/Event');

var GameObjectOverEvent = new Class({

    Extends: Event,

    initialize:

    function GameObjectOverEvent (pointer, interactiveObject)
    {
        Event.call(this, 'GAME_OBJECT_OVER_EVENT');

        //  The Pointer that triggered the event
        this.pointer = pointer;

        //  The native DOM event (MouseEvent, TouchEvent, etc)
        this.event = pointer.event;

        //  The Game Object the event occurred on
        this.gameObject = interactiveObject.gameObject;

        //  The local x/y coordinates of the event within the Game Object
        this.x = interactiveObject.localX;
        this.y = interactiveObject.localY;
    }

});

module.exports = GameObjectOverEvent;
