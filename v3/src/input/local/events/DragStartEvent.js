var Class = require('../../utils/Class');
var Event = require('../../events/Event');

var DragStartEvent = new Class({

    Extends: Event,

    initialize:

    function DragStartEvent (pointer, gameObject)
    {
        Event.call(this, 'DRAG_START_EVENT');

        this.pointer = pointer;
        this.gameObject = gameObject;
        this.input = gameObject.input;

        this.x = gameObject.input.localX;
        this.y = gameObject.input.localY;
    }

});

module.exports = DragStartEvent;
