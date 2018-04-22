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
         * @name Phaser.Input.Keyboard.Key#keyCode
         * @type {integer}
         * @since 3.0.0
         */
        this.keyCode = keyCode;

        /**
         * The original DOM event.
         *
         * @name Phaser.Input.Keyboard.Key#originalEvent
         * @type {KeyboardEvent}
         * @since 3.0.0
         */
        this.originalEvent = undefined;

        /**
         * Should this Key prevent event propagation?
         *
         * @name Phaser.Input.Keyboard.Key#preventDefault
         * @type {boolean}
         * @default true
         * @since 3.0.0
         */
        this.preventDefault = true;

        /**
         * Can this Key be processed?
         *
         * @name Phaser.Input.Keyboard.Key#enabled
         * @type {boolean}
         * @default true
         * @since 3.0.0
         */
        this.enabled = true;

        /**
         * The "down" state of the key. This will remain `true` for as long as the keyboard thinks this key is held down.
         *
         * @name Phaser.Input.Keyboard.Key#isDown
         * @type {boolean}
         * @default false
         * @since 3.0.0
         */
        this.isDown = false;

        /**
         * The "up" state of the key. This will remain `true` for as long as the keyboard thinks this key is up.
         *
         * @name Phaser.Input.Keyboard.Key#isUp
         * @type {boolean}
         * @default true
         * @since 3.0.0
         */
        this.isUp = true;

        /**
         * The down state of the ALT key, if pressed at the same time as this key.
         *
         * @name Phaser.Input.Keyboard.Key#altKey
         * @type {boolean}
         * @default false
         * @since 3.0.0
         */
        this.altKey = false;

        /**
         * The down state of the CTRL key, if pressed at the same time as this key.
         *
         * @name Phaser.Input.Keyboard.Key#ctrlKey
         * @type {boolean}
         * @default false
         * @since 3.0.0
         */
        this.ctrlKey = false;

        /**
         * The down state of the SHIFT key, if pressed at the same time as this key.
         *
         * @name Phaser.Input.Keyboard.Key#shiftKey
         * @type {boolean}
         * @default false
         * @since 3.0.0
         */
        this.shiftKey = false;

        /**
         * The location of the modifier key. 0 for standard (or unknown), 1 for left, 2 for right, 3 for numpad.
         *
         * @name Phaser.Input.Keyboard.Key#location
         * @type {number}
         * @default 0
         * @since 3.0.0
         */
        this.location = 0;

        /**
         * The timestamp when the key was last pressed down.
         *
         * @name Phaser.Input.Keyboard.Key#timeDown
         * @type {number}
         * @default 0
         * @since 3.0.0
         */
        this.timeDown = 0;

        /**
         * The number of milliseconds this key has been held down for.
         * If the key is down this value holds the duration of that key press and is constantly updated.
         * If the key is up it holds the duration of the previous down session.
         *
         * @name Phaser.Input.Keyboard.Key#duration
         * @type {number}
         * @default 0
         * @since 3.0.0
         */
        this.duration = 0;

        /**
         * The timestamp when the key was last released.
         *
         * @name Phaser.Input.Keyboard.Key#timeUp
         * @type {number}
         * @default 0
         * @since 3.0.0
         */
        this.timeUp = 0;

        /**
         * If a key is held down this holds down the number of times the key has 'repeated'.
         *
         * @name Phaser.Input.Keyboard.Key#repeats
         * @type {number}
         * @default 0
         * @since 3.0.0
         */
        this.repeats = 0;

        /**
         * True if the key has just been pressed (NOTE: requires to be reset, see justDown getter)
         *
         * @name Phaser.Input.Keyboard.Key#_justDown
         * @type {boolean}
         * @private
         * @default false
         * @since 3.0.0
         */
        this._justDown = false;

        /**
         * True if the key has just been pressed (NOTE: requires to be reset, see justDown getter)
         *
         * @name Phaser.Input.Keyboard.Key#_justUp
         * @type {boolean}
         * @private
         * @default false
         * @since 3.0.0
         */
        this._justUp = false;
    },

    /**
     * Resets this Key object back to its default un-pressed state.
     *
     * @method Phaser.Input.Keyboard.Key.reset
     * @since 3.6.0
     * 
     * @return {Phaser.Input.Keyboard.Key} This Key instance.
     */
    reset: function ()
    {
        this.preventDefault = true;
        this.enabled = true;
        this.isDown = false;
        this.isUp = true;
        this.altKey = false;
        this.ctrlKey = false;
        this.shiftKey = false;
        this.timeDown = 0;
        this.duration = 0;
        this.timeUp = 0;
        this.repeats = 0;
        this._justDown = false;
        this._justUp = false;

        return this;
    }

});

module.exports = Key;
