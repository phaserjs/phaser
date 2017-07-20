var Class = require('../../utils/Class');
var Event = require('../../events/Event');

var PointerOverEvent = new Class({

    Extends: Event,

    initialize:

    function PointerOverEvent (pointer, topObject, gameObjects)
    {
        Event.call(this, 'POINTER_OVER_EVENT');

        this.pointer = pointer;

        this.x = pointer.x;
        this.y = pointer.y;

        //  An array of all the game objects the pointer event occurred on
        this.gameObjects = gameObjects;

        //  A reference to the top-most game object in the list (based on display list order)
        this.top = topObject;
    }

});

module.exports = PointerOverEvent;
