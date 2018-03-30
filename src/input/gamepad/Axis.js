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
 * @class Axis
 * @memberOf Phaser.Input.Gamepad
 * @constructor
 * @since 3.0.0
 *
 * @param {Phaser.Input.Gamepad.Gamepad} pad - [description]
 * @param {integer} index - [description]
 */
var Axis = new Class({

    initialize:

    function Axis (pad, index)
    {
        /**
         * [description]
         *
         * @name Phaser.Input.Gamepad.Axis#pad
         * @type {Phaser.Input.Gamepad.Gamepad}
         * @since 3.0.0
         */
        this.pad = pad;

        /**
         * [description]
         *
         * @name Phaser.Input.Gamepad.Axis#events
         * @type {Phaser.Events.EventEmitter}
         * @since 3.0.0
         */
        this.events = pad.events;

        /**
         * [description]
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
         * @type {float}
         * @default 0
         * @since 3.0.0
         */
        this.value = 0;

        /**
         * Movement tolerance threshold below which axis values are ignored in `getValue`.
         *
         * @name Phaser.Input.Gamepad.Axis#threshold
         * @type {float}
         * @default 0.1
         * @since 3.0.0
         */
        this.threshold = 0.1;
    },

    /**
     * [description]
     *
     * @method Phaser.Input.Gamepad.Axis#update
     * @since 3.0.0
     *
     * @param {float} value - [description]
     */
    update: function (value)
    {
        this.value = value;
    },

    /**
     * Applies threshold to the value and returns it.
     *
     * @method Phaser.Input.Gamepad.Axis#getValue
     * @since 3.0.0
     *
     * @return {float} [description]
     */
    getValue: function ()
    {
        return (Math.abs(this.value) < this.threshold) ? 0 : this.value;
    }

});

module.exports = Axis;
