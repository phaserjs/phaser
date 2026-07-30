/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Class = require('../../utils/Class');
var Events = require('./events');

/**
 * @classdesc
 * Represents a single button on a Gamepad controller. Each Button has a `value` between 0 and 1
 * (supporting analog pressure for triggers) and a `pressed` boolean state. When the value exceeds
 * the configurable `threshold`, the button emits `BUTTON_DOWN` and `GAMEPAD_BUTTON_DOWN` events.
 * Button objects are created automatically by the Gamepad as they are needed.
 *
 * @class Button
 * @memberof Phaser.Input.Gamepad
 * @constructor
 * @since 3.0.0
 *
 * @param {Phaser.Input.Gamepad.Gamepad} pad - A reference to the Gamepad that this Button belongs to.
 * @param {number} index - The index of this Button.
 * @param {boolean} [isPressed=false] - Whether or not the button is already being pressed at creation time.  This prevents the Button from emitting spurious 'down' events at first update.
 */
var Button = new Class({

    initialize:

    function Button (pad, index, isPressed)
    {
        if (isPressed === undefined) { isPressed = false; }

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
         * @type {number}
         * @since 3.0.0
         */
        this.index = index;

        /**
         * The current value of the button, between 0 (fully released) and 1 (fully pressed).
         * For analog buttons like triggers, this reflects the pressure applied.
         *
         * @name Phaser.Input.Gamepad.Button#value
         * @type {number}
         * @default 0
         * @since 3.0.0
         */
        this.value = 0;

        /**
         * The minimum value the button must reach before it is considered as being pressed.
         * The value is between 0 and 1. The default of 1 requires the button to be fully pressed.
         * For analog buttons such as triggers, you can lower this threshold to detect partial presses.
         *
         * @name Phaser.Input.Gamepad.Button#threshold
         * @type {number}
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
        this.pressed = isPressed;
    },

    /**
     * Internal update handler for this Button.
     * Called automatically by the Gamepad as part of its update.
     *
     * @method Phaser.Input.Gamepad.Button#update
     * @fires Phaser.Input.Gamepad.Events#BUTTON_DOWN
     * @fires Phaser.Input.Gamepad.Events#BUTTON_UP
     * @fires Phaser.Input.Gamepad.Events#GAMEPAD_BUTTON_DOWN
     * @fires Phaser.Input.Gamepad.Events#GAMEPAD_BUTTON_UP
     * @private
     * @since 3.0.0
     *
     * @param {number} value - The value of the button. Between 0 and 1.
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
                this.events.emit(Events.BUTTON_DOWN, pad, this, value);
                this.pad.emit(Events.GAMEPAD_BUTTON_DOWN, index, value, this);
            }
        }
        else if (this.pressed)
        {
            this.pressed = false;
            this.events.emit(Events.BUTTON_UP, pad, this, value);
            this.pad.emit(Events.GAMEPAD_BUTTON_UP, index, value, this);
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
