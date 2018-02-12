/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

var Class = require('../utils/Class');
var GetFastValue = require('../utils/object/GetFastValue');

/**
 * @classdesc
 * [description]
 *
 * @class TimerEvent
 * @memberOf Phaser.Time
 * @constructor
 * @since 3.0.0
 *
 * @param {object} config - [description]
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
         * @readOnly
         * @since 3.0.0
         */
        this.delay = 0;

        /**
         * The total number of times this TimerEvent will repeat before finishing.
         *
         * @name Phaser.Time.TimerEvent#repeat
         * @type {number}
         * @default 0
         * @readOnly
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
         * @readOnly
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
         * [description]
         *
         * @name Phaser.Time.TimerEvent#elapsed
         * @type {number}
         * @default 0
         * @since 3.0.0
         */
        this.elapsed = 0;

        /**
         * [description]
         *
         * @name Phaser.Time.TimerEvent#paused
         * @type {boolean}
         * @default false
         * @since 3.0.0
         */
        this.paused = false;

        /**
         * [description]
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
     * [description]
     *
     * @method Phaser.Time.TimerEvent#reset
     * @since 3.0.0
     *
     * @param {object} config - [description]
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
     * @return {number} [description]
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
     * @return {number} [description]
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
     * [description]
     *
     * @method Phaser.Time.TimerEvent#getRepeatCount
     * @since 3.0.0
     *
     * @return {number} [description]
     */
    getRepeatCount: function ()
    {
        return this.repeatCount;
    },

    /**
     * [description]
     *
     * @method Phaser.Time.TimerEvent#getElapsed
     * @since 3.0.0
     *
     * @return {number} [description]
     */
    getElapsed: function ()
    {
        return this.elapsed;
    },

    /**
     * [description]
     *
     * @method Phaser.Time.TimerEvent#getElapsedSeconds
     * @since 3.0.0
     *
     * @return {number} [description]
     */
    getElapsedSeconds: function ()
    {
        return this.elapsed * 0.001;
    },

    /**
     * [description]
     *
     * @method Phaser.Time.TimerEvent#remove
     * @since 3.0.0
     *
     * @param {function} dispatchCallback - [description]
     */
    remove: function (dispatchCallback)
    {
        if (dispatchCallback === undefined) { dispatchCallback = false; }

        this.elapsed = this.delay;

        this.hasDispatched = !!dispatchCallback;

        this.repeatCount = 0;
    },

    /**
     * [description]
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
