var Event = require('../../../events/Event');

var KeyDownEvent = function (keyboardEvent)
{
    Event.call(this, 'KEY_DOWN_EVENT');

    this.data = keyboardEvent;
};

KeyDownEvent.prototype = Object.create(Event.prototype);
KeyDownEvent.prototype.constructor = KeyDownEvent;

module.exports = KeyDownEvent;
