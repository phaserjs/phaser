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

        this.x = gameObject.input.localX;
        this.y = gameObject.input.localY;
    }

});

module.exports = PointerUpEvent;
