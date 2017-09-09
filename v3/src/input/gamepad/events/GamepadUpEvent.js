var Class = require('../../../utils/Class');
var Event = require('../../../events/Event');

var GamepadUpEvent = new Class({

    Extends: Event,

    initialize:

    function GamepadUpEvent (gamepad, button, value, nativeEvent)
    {
        Event.call(this, 'GAMEPAD_UP_EVENT');

        this.data = nativeEvent;

        this.gamepad = gamepad;
        this.button = button;
        this.value = value;
    }

});

module.exports = GamepadUpEvent;
