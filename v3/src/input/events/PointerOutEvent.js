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

        // this.x;
        // this.y;
    }

});

module.exports = PointerOutEvent;
