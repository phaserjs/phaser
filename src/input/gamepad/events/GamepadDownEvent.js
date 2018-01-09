var Class = require('../../../utils/Class');
var Event = require('../../../events/Event');

var GamepadDownEvent = new Class({

    Extends: Event,

    initialize:

    function GamepadDownEvent (gamepad, button, value, nativeEvent)
    {
        Event.call(this, 'GAMEPAD_DOWN_EVENT');

        this.data = nativeEvent;

        this.gamepad = gamepad;
        this.button = button;
        this.value = value;
    }

});

module.exports = GamepadDownEvent;
