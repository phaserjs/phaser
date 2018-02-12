/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

var Class = require('../../../utils/Class');

/**
 * @classdesc
 * A generic Key object which can be passed to the Process functions (and so on)
 * keycode must be an integer
 *
 * @class Key
 * @memberOf Phaser.Input.Keyboard
 * @constructor
 * @since 3.0.0
 *
 * @param {integer} keyCode - The keycode of this key.
 */
var Key = new Class({

    initialize:

    function Key (keyCode)
    {
        /**
         * The keycode of this key.
         *
         * @property {integer} keyCode
         * @since 3.0.0
         */
        this.keyCode = keyCode;

        /**
         * The original DOM event.
         *
         * @property {KeyboardEvent} originalEvent
         * @since 3.0.0
         */
        this.originalEvent = undefined;

        /**
         * Should this Key prevent event propagation?
         *
         * @property {boolean} preventDefault
         * @default true
         * @since 3.0.0
         */
        this.preventDefault = true;

        /**
         * Can this Key be processed?
         *
         * @property {boolean} enabled
         * @default true
         * @since 3.0.0
         */
        this.enabled = true;

        /**
         * The "down" state of the key. This will remain `true` for as long as the keyboard thinks this key is held down.
         *
         * @property {boolean} isDown
         * @default false
         * @since 3.0.0
         */
        this.isDown = false;

        /**
         * The "up" state of the key. This will remain `true` for as long as the keyboard thinks this key is up.
         *
         * @property {boolean} isUp
         * @default true
         * @since 3.0.0
         */
        this.isUp = true;

        /**
         * The down state of the ALT key, if pressed at the same time as this key.
         *
         * @property {boolean} altKey
         * @default false
         * @since 3.0.0
         */
        this.altKey = false;

        /**
         * The down state of the CTRL key, if pressed at the same time as this key.
         *
         * @property {boolean} ctrlKey
         * @default false
         * @since 3.0.0
         */
        this.ctrlKey = false;

        /**
         * The down state of the SHIFT key, if pressed at the same time as this key.
         *
         * @property {boolean} shiftKey
         * @default false
         * @since 3.0.0
         */
        this.shiftKey = false;

        /**
         * The location of the modifier key. 0 for standard (or unknown), 1 for left, 2 for right, 3 for numpad.
         *
         * @property {number} location
         * @default 0
         * @since 3.0.0
         */
        this.location = 0;

        /**
         * The timestamp when the key was last pressed down.
         *
         * @property {number} timeDown
         * @default 0
         * @since 3.0.0
         */
        this.timeDown = 0;

        /**
         * The number of milliseconds this key has been held down for.
         * If the key is down this value holds the duration of that key press and is constantly updated.
         * If the key is up it holds the duration of the previous down session.
         *
         * @property {number} duration
         * @default 0
         * @since 3.0.0
         */
        this.duration = 0;

        /**
         * The timestamp when the key was last released.
         *
         * @property {number} timeUp
         * @default 0
         * @since 3.0.0
         */
        this.timeUp = 0;

        /**
         * If a key is held down this holds down the number of times the key has 'repeated'.
         *
         * @property {number} repeats
         * @default 0
         * @since 3.0.0
         */
        this.repeats = 0;

        /**
         * True if the key has just been pressed (NOTE: requires to be reset, see justDown getter)
         *
         * @property {boolean} _justDown
         * @private
         * @default false
         * @since 3.0.0
         */
        this._justDown = false;

        /**
         * True if the key has just been pressed (NOTE: requires to be reset, see justDown getter)
         *
         * @property {boolean} _justUp
         * @private
         * @default false
         * @since 3.0.0
         */
        this._justUp = false;
    }

});

module.exports = Key;
