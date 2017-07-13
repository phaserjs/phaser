var Class = require('../../utils/Class');
var Event = require('../../events/Event');

var PointerUpEvent = new Class({

    Extends: Event,

    initialize:

    function PointerUpEvent (pointer, gameObject)
    {
        Event.call(this, 'POINTER_UP_EVENT');

        this.pointer = pointer;
        this.gameObject = gameObject;

        // this.x;
        // this.y;
    }

});

module.exports = PointerUpEvent;
