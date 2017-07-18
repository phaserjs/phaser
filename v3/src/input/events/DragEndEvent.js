var Class = require('../../utils/Class');
var Event = require('../../events/Event');

var DragEndEvent = new Class({

    Extends: Event,

    initialize:

    function DragEndEvent (pointer, gameObject)
    {
        Event.call(this, 'DRAG_END_EVENT');

        this.pointer = pointer;
        this.gameObject = gameObject;
        this.input = gameObject.input;

        this.x = gameObject.input.localX;
        this.y = gameObject.input.localY;
    }

});

module.exports = DragEndEvent;
