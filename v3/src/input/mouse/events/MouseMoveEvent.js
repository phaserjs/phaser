var Event = require('../../../events/Event');

var MouseMoveEvent = function (nativeEvent)
{
    Event.call(this, 'MOUSE_MOVE_EVENT');

    this.data = nativeEvent;

    this.x = nativeEvent.clientX;
    this.y = nativeEvent.clientY;
};

MouseMoveEvent.prototype = Object.create(Event.prototype);
MouseMoveEvent.prototype.constructor = MouseMoveEvent;

module.exports = MouseMoveEvent;
