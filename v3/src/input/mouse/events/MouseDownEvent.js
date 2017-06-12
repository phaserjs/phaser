var Event = require('../../../events/Event');

var MouseDownEvent = function (nativeEvent)
{
    Event.call(this, 'MOUSE_DOWN_EVENT');

    this.data = nativeEvent;

    this.x = nativeEvent.clientX;
    this.y = nativeEvent.clientY;
};

MouseDownEvent.prototype = Object.create(Event.prototype);
MouseDownEvent.prototype.constructor = MouseDownEvent;

module.exports = MouseDownEvent;
