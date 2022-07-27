/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2022 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Class = require('../../utils/Class');
var EventEmitter = require('eventemitter3');
var Events = require('../events');
var TWEEN_CONST = require('./const');

/**
 * @classdesc
 *
 * @class BaseTween
 * @memberof Phaser.Tweens
 * @extends Phaser.Events.EventEmitter
 * @constructor
 * @since 3.60.0
 *
 * @param {(Phaser.Tweens.TweenManager|Phaser.Tweens.Timeline)} parent - A reference to the parent of this Tween. Either the Tween Manager or a Tween Timeline instance.
 */
var BaseTween = new Class({

    Extends: EventEmitter,

    initialize:

    function BaseTween (parent, data)
    {
        if (data === undefined) { data = []; }

        EventEmitter.call(this);

        /**
         * A reference to the parent of this Tween.
         *
         * This is either a Tween Manager, or a Tween Timeline instance.
         *
         * @name Phaser.Tweens.Tween#parent
         * @type {(Phaser.Tweens.TweenManager|Phaser.Tweens.Timeline)}
         * @since 3.0.0
         */
        this.parent = parent;

        /**
         * A constant value which allows this Timeline to be easily identified as one.
         *
         * @name Phaser.Tweens.Timeline#isTimeline
         * @type {boolean}
         * @default true
         * @since 3.0.0
         */
        this.isTimeline = false;

        /**
         * Is the parent of this Tween a Timeline?
         *
         * @name Phaser.Tweens.Tween#parentIsTimeline
         * @type {boolean}
         * @since 3.0.0
         */
        this.parentIsTimeline = parent.hasOwnProperty('isTimeline');

        /**
         * An array of TweenData objects, each containing a unique property and target being tweened.
         *
         * @name Phaser.Tweens.Tween#data
         * @type {Phaser.Types.Tweens.TweenDataConfig[]}
         * @since 3.0.0
         */
        this.data = data;

        /**
         * The cached size of the data array.
         *
         * @name Phaser.Tweens.Timeline#totalData
         * @type {number}
         * @default 0
         * @since 3.0.0
         */
        this.totalData = data.length;

        /**
         * If `true` then the Tween is timed based on the number of elapsed frames, rather than time.
         *
         * @name Phaser.Tweens.Timeline#useFrames
         * @type {boolean}
         * @default false
         * @since 3.0.0
         */
        this.useFrames = false;

        /**
         * Scales the time applied to this Tween. A value of 1 runs in real-time. A value of 0.5 runs 50% slower, and so on.
         * Value isn't used when calculating total duration of the tween, it's a run-time delta adjustment only.
         *
         * @name Phaser.Tweens.Tween#timeScale
         * @type {number}
         * @default 1
         * @since 3.0.0
         */
        this.timeScale = 1;

        /**
         * Loop this tween? Can be -1 for an infinite loop, or an integer.
         * When enabled it will play through ALL TweenDatas again. Use TweenData.repeat to loop a single element.
         *
         * @name Phaser.Tweens.Tween#loop
         * @type {number}
         * @default 0
         * @since 3.0.0
         */
        this.loop = 0;

        /**
         * Time in ms/frames before the tween loops.
         *
         * @name Phaser.Tweens.Tween#loopDelay
         * @type {number}
         * @default 0
         * @since 3.0.0
         */
        this.loopDelay = 0;

        /**
         * How many loops are left to run?
         *
         * @name Phaser.Tweens.Tween#loopCounter
         * @type {number}
         * @default 0
         * @since 3.0.0
         */
        this.loopCounter = 0;

        /**
         * Time in ms/frames before the 'onComplete' event fires. This never fires if loop = -1 (as it never completes)
         *
         * @name Phaser.Tweens.Tween#completeDelay
         * @type {number}
         * @default 0
         * @since 3.0.0
         */
        this.completeDelay = 0;

        /**
         * Countdown timer (used by timeline offset, loopDelay and completeDelay)
         *
         * @name Phaser.Tweens.Tween#countdown
         * @type {number}
         * @default 0
         * @since 3.0.0
         */
        this.countdown = 0;

        /**
         * The current state of the tween.
         *
         * @name Phaser.Tweens.Tween#state
         * @type {number}
         * @since 3.0.0
         */
        this.state = TWEEN_CONST.PENDING;

        /**
         * Is the Tween paused? If so it needs to be started, or resumed, with Tween.play.
         *
         * @name Phaser.Tweens.Tween#paused
         * @type {boolean}
         * @default false
         * @since 3.0.0
         */
        this.paused = false;

        /**
         * Elapsed time in ms/frames of this run through the Tween.
         *
         * @name Phaser.Tweens.Tween#elapsed
         * @type {number}
         * @default 0
         * @since 3.0.0
         */
        this.elapsed = 0;

        /**
         * Total elapsed time in ms/frames of the entire Tween, including looping.
         *
         * @name Phaser.Tweens.Tween#totalElapsed
         * @type {number}
         * @default 0
         * @since 3.0.0
         */
        this.totalElapsed = 0;

        /**
         * Time in ms/frames for the whole Tween to play through once, excluding loop amounts and loop delays.
         *
         * @name Phaser.Tweens.Tween#duration
         * @type {number}
         * @default 0
         * @since 3.0.0
         */
        this.duration = 0;

        /**
         * Value between 0 and 1. The amount of progress through the Tween, excluding loops.
         *
         * @name Phaser.Tweens.Tween#progress
         * @type {number}
         * @default 0
         * @since 3.0.0
         */
        this.progress = 0;

        /**
         * Time in ms/frames it takes for the Tween to complete a full playthrough (including looping)
         *
         * @name Phaser.Tweens.Tween#totalDuration
         * @type {number}
         * @default 0
         * @since 3.0.0
         */
        this.totalDuration = 0;

        /**
         * Value between 0 and 1. The amount through the entire Tween, including looping.
         *
         * @name Phaser.Tweens.Tween#totalProgress
         * @type {number}
         * @default 0
         * @since 3.0.0
         */
        this.totalProgress = 0;

        /**
         * An object containing the different Tween callback functions.
         *
         * You can either set these in the Tween config, or by calling the `Tween.setCallback` method.
         *
         * `onActive` When the Tween is moved from the pending to the active list in the Tween Manager, even if playback paused.
         * `onStart` When the Tween starts playing after a delayed state. Will happen at the same time as `onActive` if it has no delay.
         * `onYoyo` When a TweenData starts a yoyo. This happens _after_ the `hold` delay expires, if set.
         * `onRepeat` When a TweenData repeats playback. This happens _after_ the `repeatDelay` expires, if set.
         * `onComplete` When the Tween finishes playback fully. Never invoked if tween is set to repeat infinitely.
         * `onUpdate` When a TweenData updates a property on a source target during playback.
         * `onLoop` When a Tween loops. This happens _after_ the `loopDelay` expires, if set.
         *
         * @name Phaser.Tweens.Tween#callbacks
         * @type {object}
         * @since 3.0.0
         */
        this.callbacks = {
            onActive: null,
            onComplete: null,
            onLoop: null,
            onRepeat: null,
            onStart: null,
            onStop: null,
            onUpdate: null,
            onYoyo: null
        };

        /**
         * The context in which all callbacks are invoked.
         *
         * @name Phaser.Tweens.Tween#callbackScope
         * @type {any}
         * @since 3.0.0
         */
        this.callbackScope;
    },

    /**
     * Sets the value of the time scale applied to this Timeline. A value of 1 runs in real-time.
     * A value of 0.5 runs 50% slower, and so on.
     *
     * The value isn't used when calculating total duration of the tween, it's a run-time delta adjustment only.
     *
     * @method Phaser.Tweens.Timeline#setTimeScale
     * @since 3.0.0
     *
     * @param {number} value - The time scale value to set.
     *
     * @return {this} This Timeline object.
     */
    setTimeScale: function (value)
    {
        this.timeScale = value;

        return this;
    },

    /**
     * Gets the value of the time scale applied to this Timeline. A value of 1 runs in real-time.
     * A value of 0.5 runs 50% slower, and so on.
     *
     * @method Phaser.Tweens.Timeline#getTimeScale
     * @since 3.0.0
     *
     * @return {number} The value of the time scale applied to this Timeline.
     */
    getTimeScale: function ()
    {
        return this.timeScale;
    },

    /**
     * Checks if this Tween is currently playing.
     *
     * If this Tween is paused, this method will return false.
     *
     * @method Phaser.Tweens.Tween#isPlaying
     * @since 3.0.0
     *
     * @return {boolean} `true` if the Tween is playing, otherwise `false`.
     */
    isPlaying: function ()
    {
        return (this.state === TWEEN_CONST.PLAYING && !this.paused);
    },

    /**
     * Checks if the Tween is currently paused.
     *
     * @method Phaser.Tweens.Tween#isPaused
     * @since 3.0.0
     *
     * @return {boolean} `true` if the Tween is paused, otherwise `false`.
     */
    isPaused: function ()
    {
        return this.paused;
    },

    /**
     * Pauses the Tween immediately. Use `resume` to continue playback.
     *
     * You can also toggle the `Tween.paused` boolean property, but doing so will not trigger the PAUSE event.
     *
     * @method Phaser.Tweens.Tween#pause
     * @fires Phaser.Tweens.Events#TIMELINE_PAUSE
     * @since 3.0.0
     *
     * @return {this} This Tween instance.
     */
    pause: function ()
    {
        if (!this.paused)
        {
            this.paused = true;

            this.emit(Events.TIMELINE_PAUSE, this);
        }

        return this;
    },

    /**
     * Resumes the playback of a previously paused Tween.
     *
     * You can also toggle the `Tween.paused` boolean property, but doing so will not trigger the RESUME event.
     *
     * @method Phaser.Tweens.Tween#resume
     * @fires Phaser.Tweens.Events#TIMELINE_RESUME
     * @since 3.0.0
     *
     * @return {this} This Tween instance.
     */
    resume: function ()
    {
        if (this.paused)
        {
            this.paused = false;

            this.emit(Events.TIMELINE_RESUME, this);
        }

        return this;
    },

    /**
     * Internal method that makes this Tween active within the TweenManager
     * and emits the onActive event and callback.
     *
     * @method Phaser.Tweens.Tween#makeActive
     * @fires Phaser.Tweens.Events#TWEEN_ACTIVE
     * @since 3.19.0
     */
    makeActive: function ()
    {
        this.parent.makeActive(this);

        this.dispatchEvent(Events.TWEEN_ACTIVE, this.callbacks.onActive);
    },

    /**
     * Internal method that will emit a Timeline based Event and invoke the given callback.
     *
     * @method Phaser.Tweens.Timeline#dispatchEvent
     * @since 3.60.0
     *
     * @param {Phaser.Types.Tweens.Event} event - The Event to be dispatched.
     * @param {function} callback - The callback to be invoked. Can be `null` or `undefined` to skip invocation.
     */
    dispatchEvent: function (event, callback)
    {
        this.emit(event, this);

        if (callback)
        {
            callback.func.apply(callback.scope, callback.params);
        }
    },

    /**
     * Sets an event based callback to be invoked during playback.
     *
     * Calling this method will replace a previously set callback for the given type, if any exists.
     *
     * The types available are:
     *
     * `onActive` When the Tween is moved from the pending to the active list in the Tween Manager, even if playback paused.
     * `onStart` When the Tween starts playing after a delayed state. Will happen at the same time as `onActive` if it has no delay.
     * `onYoyo` When a TweenData starts a yoyo. This happens _after_ the `hold` delay expires, if set.
     * `onRepeat` When a TweenData repeats playback. This happens _after_ the `repeatDelay` expires, if set.
     * `onComplete` When the Tween finishes playback fully or `Tween.stop` is called. Never invoked if tween is set to repeat infinitely.
     * `onUpdate` When a TweenData updates a property on a source target during playback.
     * `onLoop` When a Tween loops. This happens _after_ the `loopDelay` expires, if set.
     *
     * @method Phaser.Tweens.Timeline#setCallback
     * @since 3.0.0
     *
     * @param {string} type - The internal type of callback to set.
     * @param {function} callback - Timeline allows multiple tweens to be linked together to create a streaming sequence.
     * @param {array} [params] - The parameters to pass to the callback.
     * @param {object} [scope] - The context scope of the callback.
     *
     * @return {this} This Timeline object.
     */
    setCallback: function (type, callback, params, scope)
    {
        if (params === undefined) { params = []; }

        if (BaseTween.TYPES.indexOf(type) !== -1)
        {
            this.callbacks[type] = { func: callback, scope: scope, params: [ this ].concat(params) };
        }

        return this;
    },

    /**
     * Stops all the Tweens in the Timeline immediately, whatever stage of progress they are at and flags
     * them for removal by the TweenManager.
     *
     * @method Phaser.Tweens.Timeline#destroy
     * @since 3.0.0
     */
    destroy: function ()
    {
        this.state = TWEEN_CONST.DESTROYED;

        this.parent = null;
        this.callbacks = null;
    }

});

BaseTween.TYPES = [
    'onActive',
    'onStart',
    'onUpdate',
    'onLoop',
    'onRepeat',
    'onYoyo',
    'onStop',
    'onComplete',
    'onRemoved'
];

module.exports = BaseTween;
