//  Phaser.Input.Gamepad.Button

var Class = require('../../utils/Class');
var GamepadEvent = require('./events/');

var Button = new Class({

    initialize:

    function Button (pad, index)
    {
        this.pad = pad;

        this.events = pad.events;

        this.index = index;

        this.pressed = false;

        this.value = 0;
    },

    update: function (data)
    {
        if (data.pressed)
        {
            if (!this.pressed)
            {
                this.pressed = true;
                this.value = data.value;
                this.events.dispatch(new GamepadEvent.DOWN(this.pad, this, this.value, data));
            }
        }
        else
        {
            if (this.pressed)
            {
                this.pressed = false;
                this.value = data.value;
                this.events.dispatch(new GamepadEvent.UP(this.pad, this, this.value, data));
            }
        }
    }

});

module.exports = Button;
