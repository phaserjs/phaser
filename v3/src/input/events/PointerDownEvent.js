var Class = require('../../utils/Class');
var Event = require('../../events/Event');

var PointerDownEvent = new Class({

    Extends: Event,

    initialize:

    function PointerDownEvent (pointer, gameObject)
    {
        Event.call(this, 'POINTER_DOWN_EVENT');

        this.pointer = pointer;
        this.gameObject = gameObject;
        this.input = gameObject.input;

        this.x = gameObject.input.localX;
        this.y = gameObject.input.localY;
    }

});

module.exports = PointerDownEvent;
