var Class = require('../../utils/Class');
var Event = require('../../events/Event');

var PointerOverEvent = new Class({

    Extends: Event,

    initialize:

    function PointerOverEvent (pointer, gameObject)
    {
        Event.call(this, 'POINTER_OVER_EVENT');

        this.pointer = pointer;
        this.gameObject = gameObject;
        this.input = gameObject.input;

        this.x = gameObject.input.localX;
        this.y = gameObject.input.localY;
    }

});

module.exports = PointerOverEvent;
