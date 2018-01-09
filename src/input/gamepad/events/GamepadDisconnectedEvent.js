var Class = require('../../../utils/Class');
var Event = require('../../../events/Event');

var GamepadDisconnectedEvent = new Class({

    Extends: Event,

    initialize:

    function GamepadDisconnectedEvent (gamepad, nativeEvent)
    {
        Event.call(this, 'GAMEPAD_DISCONNECTED_EVENT');

        this.data = nativeEvent;

        this.gamepad = gamepad;
    }

});

module.exports = GamepadDisconnectedEvent;
