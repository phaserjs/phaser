var Class = require('../../utils/Class');
var Event = require('../../events/Event');

var PointerUpEvent = new Class({

    Extends: Event,

    initialize:

    function PointerUpEvent (pointer, interactiveObject)
    {
        Event.call(this, 'POINTER_UP_EVENT');

        this.pointer = pointer;
        this.gameObject = interactiveObject.gameObject;

        this.x = interactiveObject.localX;
        this.y = interactiveObject.localY;
    }

});

module.exports = PointerUpEvent;
