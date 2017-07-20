var Class = require('../../utils/Class');
var Event = require('../../events/Event');

var PointerOutEvent = new Class({

    Extends: Event,

    initialize:

    function PointerOutEvent (pointer, topObject, gameObjects)
    {
        Event.call(this, 'POINTER_OUT_EVENT');

        this.pointer = pointer;

        this.x = pointer.x;
        this.y = pointer.y;

        //  An array of all the game objects the pointer event occurred on
        this.list = gameObjects;

        //  A reference to the top-most game object in the list (based on display list order)
        this.gameObject = topObject;
    }

});

module.exports = PointerOutEvent;
