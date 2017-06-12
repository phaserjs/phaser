var Event = require('../../../events/Event');

var MouseDownEvent = function (nativeEvent)
{
    Event.call(this, 'MOUSE_DOWN_EVENT');

    this.data = nativeEvent;
};

MouseDownEvent.prototype = Object.create(Event.prototype);
MouseDownEvent.prototype.constructor = MouseDownEvent;

module.exports = MouseDownEvent;
