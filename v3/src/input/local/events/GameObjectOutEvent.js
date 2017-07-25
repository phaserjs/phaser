var Class = require('../../../utils/Class');
var Event = require('../../../events/Event');

var GameObjectOutEvent = new Class({

    Extends: Event,

    initialize:

    function GameObjectOutEvent (pointer, gameObject)
    {
        Event.call(this, 'GAME_OBJECT_OUT_EVENT');

        //  The Pointer that triggered the event
        this.pointer = pointer;

        //  The native DOM event (MouseEvent, TouchEvent, etc)
        this.event = pointer.event;

        //  The Game Object the event occurred on
        this.gameObject = gameObject;
    }

});

module.exports = GameObjectOutEvent;
