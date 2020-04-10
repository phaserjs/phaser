/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Class = require('../utils/Class');
var GetFastValue = require('../utils/object/GetFastValue');

/**
 * @classdesc
 * A Timer Event represents a delayed function call. It's managed by a Scene's {@link Clock} and will call its function after a set amount of time has passed. The Timer Event can optionally repeat - i.e. call its function multiple times before finishing, or loop indefinitely.
 *
 * Because it's managed by a Clock, a Timer Event is based on game time, will be affected by its Clock's time scale, and will pause if its Clock pauses.
 *
 * @class TimerEvent
 * @memberof Phaser.Time
 * @constructor
 * @since 3.0.0
 *
 * @param {Phaser.Types.Time.TimerEventConfig} config - The configuration for the Timer Event, including its delay and callback.
 */
var TimerEvent = new Class({

    initialize:

    function TimerEvent (config)
    {
        /**
         * The delay in ms at which this TimerEvent fires.
         *
         * @name Phaser.Time.TimerEvent#delay
         * @type {number}
         * @default 0
         * @readonly
         * @since 3.0.0
         */
        this.delay = 0;

        /**
         * The total number of times this TimerEvent will repeat before finishing.
         *
         * @name Phaser.Time.TimerEvent#repeat
         * @type {number}
         * @default 0
         * @readonly
         * @since 3.0.0
         */
        this.repeat = 0;

        /**
         * If repeating this contains the current repeat count.
         *
         * @name Phaser.Time.TimerEvent#repeatCount
         * @type {number}
         * @default 0
         * @since 3.0.0
         */
        this.repeatCount = 0;

        /**
         * True if this TimerEvent loops, otherwise false.
         *
         * @name Phaser.Time.TimerEvent#loop
         * @type {boolean}
         * @default false
         * @readonly
         * @since 3.0.0
         */
        this.loop = false;

        /**
         * The callback that will be called when the TimerEvent occurs.
         *
         * @name Phaser.Time.TimerEvent#callback
         * @type {function}
         * @since 3.0.0
         */
        this.callback;

        /**
         * The scope in which the callback will be called.
         *
         * @name Phaser.Time.TimerEvent#callbackScope
         * @type {object}
         * @since 3.0.0
         */
        this.callbackScope;

        /**
         * Additional arguments to be passed to the callback.
         *
         * @name Phaser.Time.TimerEvent#args
         * @type {array}
         * @since 3.0.0
         */
        this.args;

        /**
         * Scale the time causing this TimerEvent to update.
         *
         * @name Phaser.Time.TimerEvent#timeScale
         * @type {number}
         * @default 1
         * @since 3.0.0
         */
        this.timeScale = 1;

        /**
         * Start this many MS into the elapsed (useful if you want a long duration with repeat, but for the first loop to fire quickly)
         *
         * @name Phaser.Time.TimerEvent#startAt
         * @type {number}
         * @default 0
         * @since 3.0.0
         */
        this.startAt = 0;

        /**
         * The time in milliseconds which has elapsed since the Timer Event's creation.
         *
         * This value is local for the Timer Event and is relative to its Clock. As such, it's influenced by the Clock's time scale and paused state, the Timer Event's initial {@link #startAt} property, and the Timer Event's {@link #timeScale} and {@link #paused} state.
         *
         * @name Phaser.Time.TimerEvent#elapsed
         * @type {number}
         * @default 0
         * @since 3.0.0
         */
        this.elapsed = 0;

        /**
         * Whether or not this timer is paused.
         *
         * @name Phaser.Time.TimerEvent#paused
         * @type {boolean}
         * @default false
         * @since 3.0.0
         */
        this.paused = false;

        /**
         * Whether the Timer Event's function has been called.
         *
         * When the Timer Event fires, this property will be set to `true` before the callback function is invoked and will be reset immediately afterward if the Timer Event should repeat. The value of this property does not directly influence whether the Timer Event will be removed from its Clock, but can prevent it from firing.
         *
         * @name Phaser.Time.TimerEvent#hasDispatched
         * @type {boolean}
         * @default false
         * @since 3.0.0
         */
        this.hasDispatched = false;

        this.reset(config);
    },

    /**
     * Completely reinitializes the Timer Event, regardless of its current state, according to a configuration object.
     *
     * @method Phaser.Time.TimerEvent#reset
     * @since 3.0.0
     *
     * @param {Phaser.Types.Time.TimerEventConfig} config - The new state for the Timer Event.
     *
     * @return {Phaser.Time.TimerEvent} This TimerEvent object.
     */
    reset: function (config)
    {
        this.delay = GetFastValue(config, 'delay', 0);

        //  Can also be set to -1 for an infinite loop (same as setting loop: true)
        this.repeat = GetFastValue(config, 'repeat', 0);

        this.loop = GetFastValue(config, 'loop', false);

        this.callback = GetFastValue(config, 'callback', undefined);

        this.callbackScope = GetFastValue(config, 'callbackScope', this.callback);

        this.args = GetFastValue(config, 'args', []);

        this.timeScale = GetFastValue(config, 'timeScale', 1);

        this.startAt = GetFastValue(config, 'startAt', 0);

        this.paused = GetFastValue(config, 'paused', false);

        this.elapsed = this.startAt;
        this.hasDispatched = false;
        this.repeatCount = (this.repeat === -1 || this.loop) ? 999999999999 : this.repeat;

        return this;
    },

    /**
     * Gets the progress of the current iteration, not factoring in repeats.
     *
     * @method Phaser.Time.TimerEvent#getProgress
     * @since 3.0.0
     *
     * @return {number} A number between 0 and 1 representing the current progress.
     */
    getProgress: function ()
    {
        return (this.elapsed / this.delay);
    },

    /**
     * Gets the progress of the timer overall, factoring in repeats.
     *
     * @method Phaser.Time.TimerEvent#getOverallProgress
     * @since 3.0.0
     *
     * @return {number} The overall progress of the Timer Event, between 0 and 1.
     */
    getOverallProgress: function ()
    {
        if (this.repeat > 0)
        {
            var totalDuration = this.delay + (this.delay * this.repeat);
            var totalElapsed = this.elapsed + (this.delay * (this.repeat - this.repeatCount));

            return (totalElapsed / totalDuration);
        }
        else
        {
            return this.getProgress();
        }
    },

    /**
     * Returns the number of times this Timer Event will repeat before finishing.
     *
     * This should not be confused with the number of times the Timer Event will fire before finishing. A return value of 0 doesn't indicate that the Timer Event has finished running - it indicates that it will not repeat after the next time it fires.
     *
     * @method Phaser.Time.TimerEvent#getRepeatCount
     * @since 3.0.0
     *
     * @return {number} How many times the Timer Event will repeat.
     */
    getRepeatCount: function ()
    {
        return this.repeatCount;
    },

    /**
     * Returns the local elapsed time for the current iteration of the Timer Event.
     *
     * @method Phaser.Time.TimerEvent#getElapsed
     * @since 3.0.0
     *
     * @return {number} The local elapsed time in milliseconds.
     */
    getElapsed: function ()
    {
        return this.elapsed;
    },

    /**
     * Returns the local elapsed time for the current iteration of the Timer Event in seconds.
     *
     * @method Phaser.Time.TimerEvent#getElapsedSeconds
     * @since 3.0.0
     *
     * @return {number} The local elapsed time in seconds.
     */
    getElapsedSeconds: function ()
    {
        return this.elapsed * 0.001;
    },

    /**
     * Forces the Timer Event to immediately expire, thus scheduling its removal in the next frame.
     *
     * @method Phaser.Time.TimerEvent#remove
     * @since 3.0.0
     *
     * @param {boolean} [dispatchCallback=false] - If `true`, the function of the Timer Event will be called before its removal.
     */
    remove: function (dispatchCallback)
    {
        if (dispatchCallback === undefined) { dispatchCallback = false; }

        this.elapsed = this.delay;

        this.hasDispatched = !dispatchCallback;

        this.repeatCount = 0;
    },

    /**
     * Destroys all object references in the Timer Event, i.e. its callback, scope, and arguments.
     *
     * Normally, this method is only called by the Clock when it shuts down. As such, it doesn't stop the Timer Event. If called manually, the Timer Event will still be updated by the Clock, but it won't do anything when it fires.
     *
     * @method Phaser.Time.TimerEvent#destroy
     * @since 3.0.0
     */
    destroy: function ()
    {
        this.callback = undefined;
        this.callbackScope = undefined;
        this.args = [];
    }

});

module.exports = TimerEvent;
