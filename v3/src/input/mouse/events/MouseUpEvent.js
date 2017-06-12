var Event = require('../../../events/Event');

var MouseUpEvent = function (nativeEvent)
{
    Event.call(this, 'MOUSE_UP_EVENT');

    this.data = nativeEvent;
};

MouseUpEvent.prototype = Object.create(Event.prototype);
MouseUpEvent.prototype.constructor = MouseUpEvent;

module.exports = MouseUpEvent;
