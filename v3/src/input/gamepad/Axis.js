//  Phaser.Input.Gamepad.Axis

var Class = require('../../utils/Class');
var GamepadEvent = require('./events/');

var Axis = new Class({

    initialize:

    function Axis (pad, index)
    {
        this.pad = pad;

        this.events = pad.events;

        this.index = index;

        //  Between -1 and 1 with 0 being dead center
        this.value = 0;

        this.threshold = 0.05;
    },

    update: function (value)
    {
        this.value = value;
    },

    //  Applies threshold to the value and returns it
    getValue: function ()
    {
        var percentage = (Math.abs(this.value) - this.threshold) / (1 - this.threshold);

        if (percentage < 0)
        {
            percentage = 0;
        }

       return percentage * (this.value > 0 ? 1 : -1);
    }

});

module.exports = Axis;
