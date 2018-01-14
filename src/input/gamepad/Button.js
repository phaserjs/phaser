//  Phaser.Input.Gamepad.Button

var Class = require('../../utils/Class');

var Button = new Class({

    initialize:

    function Button (pad, index)
    {
        this.pad = pad;

        this.events = pad.events;

        this.index = index;

        //  Between 0 and 1
        this.value = 0;

        //  Can be set for Analogue buttons to enable a 'pressure' threshold before considered as 'pressed'
        this.threshold = 0;

        this.pressed = false;
    },

    update: function (data)
    {
        this.value = data.value;

        if (this.value >= this.threshold)
        {
            if (!this.pressed)
            {
                this.pressed = true;
                this.events.emit('down', this.pad, this, this.value, data);
            }
        }
        else if (this.pressed)
        {
            this.pressed = false;
            this.events.emit('up', this.pad, this, this.value, data);
        }
    }

});

module.exports = Button;
