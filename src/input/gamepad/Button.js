/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

var Class = require('../../utils/Class');

/**
 * @classdesc
 * Contains information about a specific button on a Gamepad.
 * Button objects are created automatically by the Gamepad as they are needed.
 *
 * @class Button
 * @memberOf Phaser.Input.Gamepad
 * @constructor
 * @since 3.0.0
 *
 * @param {Phaser.Input.Gamepad.Gamepad} pad - A reference to the Gamepad that this Button belongs to.
 * @param {integer} index - The index of this Button.
 */
var Button = new Class({

    initialize:

    function Button (pad, index)
    {
        /**
         * A reference to the Gamepad that this Button belongs to.
         *
         * @name Phaser.Input.Gamepad.Button#pad
         * @type {Phaser.Input.Gamepad.Gamepad}
         * @since 3.0.0
         */
        this.pad = pad;

        /**
         * An event emitter to use to emit the button events.
         *
         * @name Phaser.Input.Gamepad.Button#events
         * @type {Phaser.Events.EventEmitter}
         * @since 3.0.0
         */
        this.events = pad.manager;

        /**
         * The index of this Button.
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
         * Can be set for analogue buttons to enable a 'pressure' threshold,
         * before a button is considered as being 'pressed'.
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
     * Internal update handler for this Button.
     * Called automatically by the Gamepad as part of its update.
     *
     * @method Phaser.Input.Gamepad.Button#update
     * @private
     * @since 3.0.0
     *
     * @param {number} value - The GamepadButton value.
     */
    update: function (value)
    {
        this.value = value;

        var pad = this.pad;
        var index = this.index;

        if (value >= this.threshold)
        {
            if (!this.pressed)
            {
                this.pressed = true;
                this.events.emit('down', pad, this, value);
                this.pad.emit('down', index, value, this);
            }
        }
        else if (this.pressed)
        {
            this.pressed = false;
            this.events.emit('up', pad, this, value);
            this.pad.emit('up', index, value, this);
        }
    },

    /**
     * Destroys this Button instance and releases external references it holds.
     *
     * @method Phaser.Input.Gamepad.Button#destroy
     * @since 3.10.0
     */
    destroy: function ()
    {
        this.pad = null;
        this.events = null;
    }

});

module.exports = Button;
