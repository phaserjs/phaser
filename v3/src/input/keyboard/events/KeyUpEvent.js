var Event = require('../../../events/Event');

var KeyUpEvent = function (keyboardEvent)
{
    Event.call(this, 'KEY_UP_EVENT');

    this.data = keyboardEvent;
};

KeyUpEvent.prototype = Object.create(Event.prototype);
KeyUpEvent.prototype.constructor = KeyUpEvent;

module.exports = KeyUpEvent;
