var Axis = require('./Axis');
var Button = require('./Button');
var Class = require('../../utils/Class');

/**
 * @classdesc
 * [description]
 *
 * @class Gamepad
 * @memberOf Phaser.Input.Gamepad
 * @constructor
 * @since 3.0.0
 *
 * @param {Phaser.Input.Gamepad.GamepadManager} manager - [description]
 * @param {[type]} id - [description]
 * @param {[type]} index - [description]
 */
var Gamepad = new Class({

    initialize:

    function Gamepad (manager, id, index)
    {
        /**
         * [description]
         *
         * @property {Phaser.Input.Gamepad.GamepadManager} manager
         * @since 3.0.0
         */
        this.manager = manager;

        /**
         * [description]
         *
         * @property {[type]} events
         * @since 3.0.0
         */
        this.events = manager.events;

        /**
         * [description]
         *
         * @property {[type]} id
         * @since 3.0.0
         */
        this.id = id;

        /**
         * [description]
         *
         * @property {[type]} index
         * @since 3.0.0
         */
        this.index = index;

        /**
         * [description]
         *
         * @property {boolean} connected
         * @default true
         * @since 3.0.0
         */
        this.connected = true;

        /**
         * [description]
         *
         * @property {number} timestamp
         * @default 0
         * @since 3.0.0
         */
        this.timestamp = 0;

        /**
         * [description]
         *
         * @property {array} buttons
         * @default []
         * @since 3.0.0
         */
        this.buttons = [];

        /**
         * [description]
         *
         * @property {array} axes
         * @default []
         * @since 3.0.0
         */
        this.axes = [];
    },

    /**
     * [description]
     *
     * @method Phaser.Input.Gamepad.Gamepad#update
     * @since 3.0.0
     *
     * @param {[type]} data - [description]
     */
    update: function (data)
    {
        this.timestamp = data.timestamp;
        this.connected = data.connected;

        var i;

        var axes = this.axes;
        var buttons = this.buttons;

        for (i = 0; i < data.buttons.length; i++)
        {
            var buttonData = data.buttons[i];

            if (buttons[i] === undefined)
            {
                buttons[i] = new Button(this, i);
            }

            buttons[i].update(buttonData);
        }

        //  Axes
        for (i = 0; i < data.axes.length; i++)
        {
            var axisData = data.axes[i];

            if (axes[i] === undefined)
            {
                axes[i] = new Axis(this, i);
            }

            axes[i].update(axisData);
        }
    }

});

module.exports = Gamepad;
