//  Phaser.Input.Gamepad.Gamepad

var Axis = require('./Axis');
var Button = require('./Button');
var Class = require('../../utils/Class');
var GamepadEvent = require('./events/');

var Gamepad = new Class({

    initialize:

    function Gamepad (manager, id, index)
    {
        this.manager = manager;

        this.events = manager.events;

        this.id = id;

        this.index = index;

        this.connected = true;

        this.timestamp = 0;

        this.buttons = [];
        this.axes = [];
    },

    update: function (data)
    {
        this.timestamp = data.timestamp;
        this.connected = data.connected;

        //  Buttons

        for (var i = 0; i < data.buttons.length; i++)
        {
            var buttonData = data.buttons[i];

            if (this.buttons[i] === undefined)
            {
                this.buttons[i] = new Button(this, i);
            }

            this.buttons[i].update(buttonData);
        }

        //  Axes
        for (var i = 0; i < data.axes.length; i++)
        {
            var axisData = data.axes[i];

            if (this.axes[i] === undefined)
            {
                this.axes[i] = new Axis(this, i);
            }

            this.axes[i].update(axisData);
        }
    }

});

module.exports = Gamepad;
