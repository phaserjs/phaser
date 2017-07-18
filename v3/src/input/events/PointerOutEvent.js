var Class = require('../../utils/Class');
var Event = require('../../events/Event');

var PointerOutEvent = new Class({

    Extends: Event,

    initialize:

    function PointerOutEvent (pointer, interactiveObject)
    {
        Event.call(this, 'POINTER_OUT_EVENT');

        this.pointer = pointer;
        this.gameObject = interactiveObject.gameObject;

        this.x = interactiveObject.localX;
        this.y = interactiveObject.localY;
    }

});

module.exports = PointerOutEvent;
