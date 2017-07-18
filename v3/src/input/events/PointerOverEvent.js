var Class = require('../../utils/Class');
var Event = require('../../events/Event');

var PointerOverEvent = new Class({

    Extends: Event,

    initialize:

    function PointerOverEvent (pointer, interactiveObject)
    {
        Event.call(this, 'POINTER_OVER_EVENT');

        this.pointer = pointer;
        this.gameObject = interactiveObject.gameObject;

        this.x = interactiveObject.localX;
        this.y = interactiveObject.localY;
    }

});

module.exports = PointerOverEvent;
