var Class = require('../../../utils/Class');
var Event = require('../../../events/Event');

var GamepadConnectedEvent = new Class({

    Extends: Event,

    initialize:

    function GamepadConnectedEvent (gamepad, nativeEvent)
    {
        Event.call(this, 'GAMEPAD_CONNECTED_EVENT');

        this.data = nativeEvent;

        this.gamepad = gamepad;
    }

});

module.exports = GamepadConnectedEvent;
