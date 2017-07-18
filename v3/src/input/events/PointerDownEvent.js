var Class = require('../../utils/Class');
var Event = require('../../events/Event');

var PointerDownEvent = new Class({

    Extends: Event,

    initialize:

    function PointerDownEvent (pointer, interactiveObject)
    {
        Event.call(this, 'POINTER_DOWN_EVENT');

        this.pointer = pointer;
        this.gameObject = interactiveObject.gameObject;

        this.x = interactiveObject.localX;
        this.y = interactiveObject.localY;
    }

});

module.exports = PointerDownEvent;
