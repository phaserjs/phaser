var Event = require('../../../events/Event');
var KeyCodes = require('./../keys/KeyCodes');

var events = {
    KEY_DOWN_EVENT: require('./KeyDownEvent'),
    KEY_UP_EVENT: require('./KeyUpEvent'),
    _UP: [],
    _DOWN: []
};

function createKeyEvent (type)
{
    var KeyEvent = function (keyboardEvent)
    {
        Event.call(this, type);

        this.data = keyboardEvent;
    };

    KeyEvent.prototype = Object.create(Event.prototype);
    KeyEvent.prototype.constructor = KeyEvent;

    return KeyEvent;
}

//  Inject the KeyCode events

for (var code in KeyCodes)
{
    //  The Key Down Event Types

    var downType = 'KEY_DOWN_' + code;
    var upType = 'KEY_UP_' + code;

    events._DOWN[KeyCodes[code]] = createKeyEvent(downType);
    events._UP[KeyCodes[code]] = createKeyEvent(upType);

    //  More friendly aliases to the main events
    events[downType] = events._DOWN[KeyCodes[code]];
    events[upType] = events._UP[KeyCodes[code]];
}

module.exports = events;
