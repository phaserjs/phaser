/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

var Class = require('../../utils/Class');

/**
 * @classdesc
 * [description]
 *
 * @class Button
 * @memberOf Phaser.Input.Gamepad
 * @constructor
 * @since 3.0.0
 *
 * @param {Phaser.Input.Gamepad.Gamepad} pad - [description]
 * @param {integer} index - [description]
 */
var Button = new Class({

    initialize:

    function Button (pad, index)
    {
        /**
         * [description]
         *
         * @name Phaser.Input.Gamepad.Button#pad
         * @type {Phaser.Input.Gamepad.Gamepad}
         * @since 3.0.0
         */
        this.pad = pad;

        /**
         * [description]
         *
         * @name Phaser.Input.Gamepad.Button#events
         * @type {EventEmitter}
         * @since 3.0.0
         */
        this.events = pad.events;

        /**
         * [description]
         *
         * @name Phaser.Input.Gamepad.Button#index
         * @type {integer}
         * @since 3.0.0
         */
        this.index = index;

        /**
         * Between 0 and 1.
         *
         * @name Phaser.Input.Gamepad.Button#value
         * @type {float}
         * @default 0
         * @since 3.0.0
         */
        this.value = 0;

        /**
         * Can be set for Analogue buttons to enable a 'pressure' threshold before considered as 'pressed'.
         *
         * @name Phaser.Input.Gamepad.Button#threshold
         * @type {float}
         * @default 1
         * @since 3.0.0
         */
        this.threshold = 1;

        /**
         * Is the Button being pressed down or not?
         *
         * @name Phaser.Input.Gamepad.Button#pressed
         * @type {boolean}
         * @default false
         * @since 3.0.0
         */
        this.pressed = false;
    },

    /**
     * [description]
     *
     * @method Phaser.Input.Gamepad.Button#update
     * @since 3.0.0
     *
     * @param {GamepadButton} data - [description]
     */
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
