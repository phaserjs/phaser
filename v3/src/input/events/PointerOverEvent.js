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

        // this.x;
        // this.y;
    }

});

module.exports = PointerOverEvent;
