/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Class = require('../../utils/Class');

/**
 * @classdesc
 * Contains information about a specific Gamepad Axis.
 * Axis objects are created automatically by the Gamepad as they are needed.
 *
 * @class Axis
 * @memberof Phaser.Input.Gamepad
 * @constructor
 * @since 3.0.0
 *
 * @param {Phaser.Input.Gamepad.Gamepad} pad - A reference to the Gamepad that this Axis belongs to.
 * @param {integer} index - The index of this Axis.
 */
var Axis = new Class({

    initialize:

    function Axis (pad, index)
    {
        /**
         * A reference to the Gamepad that this Axis belongs to.
         *
         * @name Phaser.Input.Gamepad.Axis#pad
         * @type {Phaser.Input.Gamepad.Gamepad}
         * @since 3.0.0
         */
        this.pad = pad;

        /**
         * An event emitter to use to emit the axis events.
         *
         * @name Phaser.Input.Gamepad.Axis#events
         * @type {Phaser.Events.EventEmitter}
         * @since 3.0.0
         */
        this.events = pad.events;

        /**
         * The index of this Axis.
         *
         * @name Phaser.Input.Gamepad.Axis#index
         * @type {integer}
         * @since 3.0.0
         */
        this.index = index;

        /**
         * The raw axis value, between -1 and 1 with 0 being dead center.
         * Use the method `getValue` to get a normalized value with the threshold applied.
         *
         * @name Phaser.Input.Gamepad.Axis#value
         * @type {number}
         * @default 0
         * @since 3.0.0
         */
        this.value = 0;

        /**
         * Movement tolerance threshold below which axis values are ignored in `getValue`.
         *
         * @name Phaser.Input.Gamepad.Axis#threshold
         * @type {number}
         * @default 0.1
         * @since 3.0.0
         */
        this.threshold = 0.1;
    },

    /**
     * Internal update handler for this Axis.
     * Called automatically by the Gamepad as part of its update.
     *
     * @method Phaser.Input.Gamepad.Axis#update
     * @private
     * @since 3.0.0
     *
     * @param {number} value - The value of the axis movement.
     */
    update: function (value)
    {
        this.value = value;
    },

    /**
     * Applies the `threshold` value to the axis and returns it.
     *
     * @method Phaser.Input.Gamepad.Axis#getValue
     * @since 3.0.0
     *
     * @return {number} The axis value, adjusted for the movement threshold.
     */
    getValue: function ()
    {
        return (Math.abs(this.value) < this.threshold) ? 0 : this.value;
    },

    /**
     * Destroys this Axis instance and releases external references it holds.
     *
     * @method Phaser.Input.Gamepad.Axis#destroy
     * @since 3.10.0
     */
    destroy: function ()
    {
        this.pad = null;
        this.events = null;
    }

});

module.exports = Axis;
