var Class = require('../../utils/Class');
var Event = require('../../events/Event');

var PointerOutEvent = new Class({

    Extends: Event,

    initialize:

    function PointerOutEvent (pointer, gameObject)
    {
        Event.call(this, 'POINTER_OUT_EVENT');

        this.pointer = pointer;
        this.gameObject = gameObject;
        this.input = gameObject.input;

        this.x = gameObject.input.localX;
        this.y = gameObject.input.localY;
    }

});

module.exports = PointerOutEvent;
