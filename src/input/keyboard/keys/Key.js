/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2019 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Class = require('../../../utils/Class');
var EventEmitter = require('eventemitter3');
var Events = require('../events');

/**
 * @classdesc
 * A generic Key object which can be passed to the Process functions (and so on)
 * keycode must be an integer
 *
 * @class Key
 * @extends Phaser.Events.EventEmitter
 * @memberof Phaser.Input.Keyboard
 * @constructor
 * @since 3.0.0
 *
 * @param {Phaser.Input.Keyboard.KeyboardPlugin} plugin - The Keyboard Plugin instance that owns this Key object.
 * @param {integer} keyCode - The keycode of this key.
 */
var Key = new Class({

    Extends: EventEmitter,

    initialize:

    function Key (plugin, keyCode)
    {
        EventEmitter.call(this);

        /**
         * The Keyboard Plugin instance that owns this Key object.
         *
         * @name Phaser.Input.Keyboard.Key#plugin
         * @type {Phaser.Input.Keyboard.KeyboardPlugin}
         * @since 3.17.0
         */
        this.plugin = plugin;

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
         * The down state of the Meta key, if pressed at the same time as this key.
         * On a Mac the Meta Key is the Command key. On Windows keyboards, it's the Windows key.
         *
         * @name Phaser.Input.Keyboard.Key#metaKey
         * @type {boolean}
         * @default false
         * @since 3.16.0
         */
        this.metaKey = false;

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
         * The number of milliseconds this key was held down for in the previous down - up sequence.
         * This value isn't updated every game step, only when the Key changes state.
         * To get the current duration use the `getDuration` method.
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
         * When a key is held down should it continuously fire the `down` event each time it repeats?
         * 
         * By default it will emit the `down` event just once, but if you wish to receive the event
         * for each repeat as well, enable this property.
         *
         * @name Phaser.Input.Keyboard.Key#emitOnRepeat
         * @type {boolean}
         * @default false
         * @since 3.16.0
         */
        this.emitOnRepeat = false;

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

        /**
         * Internal tick counter.
         *
         * @name Phaser.Input.Keyboard.Key#_tick
         * @type {number}
         * @private
         * @since 3.11.0
         */
        this._tick = -1;
    },

    /**
     * Controls if this Key will continuously emit a `down` event while being held down (true),
     * or emit the event just once, on first press, and then skip future events (false).
     *
     * @method Phaser.Input.Keyboard.Key#setEmitOnRepeat
     * @since 3.16.0
     * 
     * @param {boolean} value - Emit `down` events on repeated key down actions, or just once?
     * 
     * @return {Phaser.Input.Keyboard.Key} This Key instance.
     */
    setEmitOnRepeat: function (value)
    {
        this.emitOnRepeat = value;

        return this;
    },

    /**
     * Processes the Key Down action for this Key.
     * Called automatically by the Keyboard Plugin.
     *
     * @method Phaser.Input.Keyboard.Key#onDown
     * @fires Phaser.Input.Keyboard.Events#DOWN
     * @since 3.16.0
     * 
     * @param {KeyboardEvent} event - The native DOM Keyboard event.
     */
    onDown: function (event)
    {
        this.originalEvent = event;

        if (!this.enabled)
        {
            return;
        }

        this.altKey = event.altKey;
        this.ctrlKey = event.ctrlKey;
        this.shiftKey = event.shiftKey;
        this.metaKey = event.metaKey;
        this.location = event.location;
    
        this.repeats++;

        if (!this.isDown)
        {
            this.isDown = true;
            this.isUp = false;
            this.timeDown = event.timeStamp;
            this.duration = 0;
            this._justDown = true;
            this._justUp = false;

            this.emit(Events.DOWN, this, event);
        }
        else if (this.emitOnRepeat)
        {
            this.emit(Events.DOWN, this, event);
        }
    },

    /**
     * Processes the Key Up action for this Key.
     * Called automatically by the Keyboard Plugin.
     *
     * @method Phaser.Input.Keyboard.Key#onUp
     * @fires Phaser.Input.Keyboard.Events#UP
     * @since 3.16.0
     * 
     * @param {KeyboardEvent} event - The native DOM Keyboard event.
     */
    onUp: function (event)
    {
        this.originalEvent = event;

        if (!this.enabled)
        {
            return;
        }
    
        this.isDown = false;
        this.isUp = true;
        this.timeUp = event.timeStamp;
        this.duration = this.timeUp - this.timeDown;
        this.repeats = 0;
    
        this._justDown = false;
        this._justUp = true;
        this._tick = -1;
        
        this.emit(Events.UP, this, event);
    },

    /**
     * Resets this Key object back to its default un-pressed state.
     *
     * @method Phaser.Input.Keyboard.Key#reset
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
        this.metaKey = false;
        this.timeDown = 0;
        this.duration = 0;
        this.timeUp = 0;
        this.repeats = 0;
        this._justDown = false;
        this._justUp = false;
        this._tick = -1;

        return this;
    },

    /**
     * Returns the duration, in ms, that the Key has been held down for.
     * 
     * If the key is not currently down it will return zero.
     * 
     * The get the duration the Key was held down for in the previous up-down cycle,
     * use the `Key.duration` property value instead.
     *
     * @method Phaser.Input.Keyboard.Key#getDuration
     * @since 3.17.0
     * 
     * @return {number} The duration, in ms, that the Key has been held down for if currently down.
     */
    getDuration: function ()
    {
        if (this.isDown)
        {
            return (this.plugin.game.loop.time - this.timeDown);
        }
        else
        {
            return 0;
        }
    },

    /**
     * Removes any bound event handlers and removes local references.
     *
     * @method Phaser.Input.Keyboard.Key#destroy
     * @since 3.16.0
     */
    destroy: function ()
    {
        this.removeAllListeners();

        this.originalEvent = null;

        this.plugin = null;
    }

});

module.exports = Key;
