/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

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
 * @param {string} id - [description]
 * @param {number} index - [description]
 */
var Gamepad = new Class({

    initialize:

    function Gamepad (manager, id, index)
    {
        /**
         * [description]
         *
         * @name Phaser.Input.Gamepad.Gamepad#manager
         * @type {Phaser.Input.Gamepad.GamepadManager}
         * @since 3.0.0
         */
        this.manager = manager;

        /**
         * [description]
         *
         * @name Phaser.Input.Gamepad.Gamepad#id
         * @type {string}
         * @since 3.0.0
         */
        this.id = id;

        /**
         * [description]
         *
         * @name Phaser.Input.Gamepad.Gamepad#index
         * @type {number}
         * @since 3.0.0
         */
        this.index = index;

        /**
         * [description]
         *
         * @name Phaser.Input.Gamepad.Gamepad#connected
         * @type {boolean}
         * @default true
         * @since 3.0.0
         */
        this.connected = true;

        /**
         * [description]
         *
         * @name Phaser.Input.Gamepad.Gamepad#timestamp
         * @type {number}
         * @default 0
         * @since 3.0.0
         */
        this.timestamp = 0;

        /**
         * [description]
         *
         * @name Phaser.Input.Gamepad.Gamepad#buttons
         * @type {Phaser.Input.Gamepad.Button[]}
         * @default []
         * @since 3.0.0
         */
        this.buttons = [];

        /**
         * [description]
         *
         * @name Phaser.Input.Gamepad.Gamepad#axes
         * @type {Phaser.Input.Gamepad.Axis[]}
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
     * @param {Gamepad} data - [description]
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
            else
            {
                axes[i].update(axisData);
            }
        }
    }

});

module.exports = Gamepad;
