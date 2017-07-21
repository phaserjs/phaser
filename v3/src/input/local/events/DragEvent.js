var Class = require('../../../utils/Class');
var Event = require('../../../events/Event');

var DragEvent = new Class({

    Extends: Event,

    initialize:

    function DragEvent (pointer, gameObject)
    {
        Event.call(this, 'DRAG_EVENT');

        this.pointer = pointer;
        this.gameObject = gameObject;
        this.input = gameObject.input;

        this.x = gameObject.input.localX;
        this.y = gameObject.input.localY;
    }

});

module.exports = DragEvent;
