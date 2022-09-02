/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2022 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Class = require('../../utils/Class');
var EventEmitter = require('eventemitter3');
var Events = require('../events');
var GameObjectCreator = require('../../gameobjects/GameObjectCreator');
var GameObjectFactory = require('../../gameobjects/GameObjectFactory');
var MATH_CONST = require('../../math/const');
var TWEEN_CONST = require('./const');
var TweenData = require('./TweenData');

/**
 * @classdesc
 * A Tween is able to manipulate the properties of one or more objects to any given value, based
 * on a duration and type of ease. They are rarely instantiated directly and instead should be
 * created via the TweenManager.
 *
 * Please note that a Tween will not manipulate any property that begins with an underscore.
 *
 * @class Tween
 * @memberof Phaser.Tweens
 * @extends Phaser.Events.EventEmitter
 * @constructor
 * @since 3.0.0
 *
 * @param {Phaser.Tweens.TweenManager} parent - A reference to the Tween Manager that owns this Tween.
 * @param {array} targets - An array of targets to be tweened.
 */
var Tween = new Class({

    Extends: EventEmitter,

    initialize:

    function Tween (parent, targets)
    {
        EventEmitter.call(this);

        /**
         * A reference to the Tween Manager that owns this Tween.
         *
         * @name Phaser.Tweens.Tween#parent
         * @type {Phaser.Tweens.TweenManager}
         * @since 3.60.0
         */
        this.parent = parent;

        /**
         * An array of TweenData objects, each containing a unique property and target being tweened.
         *
         * @name Phaser.Tweens.Tween#data
         * @type {Phaser.Tweens.TweenData[]}
         * @since 3.60.0
         */
        this.data = [];

        /**
         * The cached size of the data array.
         *
         * @name Phaser.Tweens.Tween#totalData
         * @type {number}
         * @since 3.60.0
         */
        this.totalData = 0;

        /**
         * An array of references to the target/s this Tween is operating on.
         *
         * @name Phaser.Tweens.Tween#targets
         * @type {object[]}
         * @since 3.0.0
         */
        this.targets = targets;

        /**
         * Cached target total (not necessarily the same as the data total)
         *
         * @name Phaser.Tweens.Tween#totalTargets
         * @type {number}
         * @since 3.0.0
         */
        this.totalTargets = targets.length;

        /**
         * Time in ms/frames before the 'onStart' event fires.
         * This is the shortest `delay` value across all of the TweenDatas of this Tween.
         *
         * @name Phaser.Tweens.Tween#startDelay
         * @type {number}
         * @default 0
         * @since 3.19.0
         */
        this.startDelay = 0;

        /**
         * Has this Tween started playback yet?
         * This boolean is toggled when the Tween leaves the 'delayed' state and starts running.
         *
         * @name Phaser.Tweens.Tween#hasStarted
         * @type {boolean}
         * @readonly
         * @since 3.19.0
         */
        this.hasStarted = false;

        /**
         * Is this Tween currently seeking?
         * This boolean is toggled in the `Tween.seek` method.
         * When a tween is seeking it will not dispatch any events or callbacks.
         *
         * @name Phaser.Tweens.Tween#isSeeking
         * @type {boolean}
         * @readonly
         * @since 3.19.0
         */
        this.isSeeking = false;

        /**
         * Scales the time applied to this Tween. A value of 1 runs in real-time. A value of 0.5 runs 50% slower, and so on.
         *
         * The value isn't used when calculating total duration of the tween, it's a run-time delta adjustment only.
         *
         * @name Phaser.Tweens.Tween#timeScale
         * @type {number}
         * @default 1
         * @since 3.60.0
         */
        this.timeScale = 1;

        /**
         * Loop this tween? Can be -1 for an infinite loop, or a positive integer.
         *
         * When enabled it will play through ALL TweenDatas again. Use TweenData.repeat to loop a single element.
         *
         * @name Phaser.Tweens.Tween#loop
         * @type {number}
         * @default 0
         * @since 3.60.0
         */
        this.loop = 0;

        /**
         * Time in ms/frames before the Tween loops.
         *
         * @name Phaser.Tweens.Tween#loopDelay
         * @type {number}
         * @default 0
         * @since 3.60.0
         */
        this.loopDelay = 0;

        /**
         * Internal counter recording how many loops are left to run.
         *
         * @name Phaser.Tweens.Tween#loopCounter
         * @type {number}
         * @default 0
         * @since 3.60.0
         */
        this.loopCounter = 0;

        /**
         * The time in ms/frames before the 'onComplete' event fires.
         *
         * This never fires if loop = -1 (as it never completes)
         *
         * @name Phaser.Tweens.Tween#completeDelay
         * @type {number}
         * @default 0
         * @since 3.60.0
         */
        this.completeDelay = 0;

        /**
         * An internal countdown timer (used by loopDelay and completeDelay)
         *
         * @name Phaser.Tweens.Tween#countdown
         * @type {number}
         * @default 0
         * @since 3.60.0
         */
        this.countdown = 0;

        /**
         * The current state of the Tween.
         *
         * @name Phaser.Tweens.Tween#state
         * @type {Phaser.Types.Tweens.TweenState}
         * @since 3.60.0
         */
        this.state = TWEEN_CONST.PENDING;

        /**
         * Is the Tween paused? If so it needs to be started with `Tween.play` or resumed with `Tween.resume`.
         *
         * @name Phaser.Tweens.Tween#paused
         * @type {boolean}
         * @default false
         * @since 3.60.0
         */
        this.paused = false;

        /**
         * Elapsed time in ms/frames of this run through of the Tween.
         *
         * @name Phaser.Tweens.Tween#elapsed
         * @type {number}
         * @default 0
         * @since 3.60.0
         */
        this.elapsed = 0;

        /**
         * Total elapsed time in ms/frames of the entire Tween, including looping.
         *
         * @name Phaser.Tweens.Tween#totalElapsed
         * @type {number}
         * @default 0
         * @since 3.60.0
         */
        this.totalElapsed = 0;

        /**
         * Time in ms/frames for the whole Tween to play through once, excluding loop amounts and loop delays.
         *
         * @name Phaser.Tweens.Tween#duration
         * @type {number}
         * @default 0
         * @since 3.60.0
         */
        this.duration = 0;

        /**
         * Value between 0 and 1. The amount of progress through the Tween, excluding loops.
         *
         * @name Phaser.Tweens.Tween#progress
         * @type {number}
         * @default 0
         * @since 3.60.0
         */
        this.progress = 0;

        /**
         * Time in ms/frames it takes for the Tween to complete a full playthrough (including looping)
         *
         * @name Phaser.Tweens.Tween#totalDuration
         * @type {number}
         * @default 0
         * @since 3.60.0
         */
        this.totalDuration = 0;

        /**
         * Value between 0 and 1. The amount through the entire Tween, including looping.
         *
         * @name Phaser.Tweens.Tween#totalProgress
         * @type {number}
         * @default 0
         * @since 3.60.0
         */
        this.totalProgress = 0;

        /**
         * An object containing the different Tween callback functions.
         *
         * You can either set these in the Tween config, or by calling the `Tween.setCallback` method.
         *
         * The types available are:
         *
         * `onActive` - When the Tween is first created it moves to an 'active' state when added to the Tween Manager. 'Active' does not mean 'playing'.
         * `onStart` - When the Tween starts playing after a delayed or paused state. This will happen at the same time as `onActive` if the tween has no delay and isn't paused.
         * `onLoop` - When a Tween loops, if it has been set to do so. This happens _after_ the `loopDelay` expires, if set.
         * `onComplete` - When the Tween finishes playback fully. Never invoked if the Tween is set to repeat infinitely.
         * `onStop` - Invoked only if the `Tween.stop` method is called.
         * `onPause` - Invoked only if the `Tween.pause` method is called. Not invoked if the Tween Manager is paused.
         * `onResume` - Invoked only if the `Tween.resume` method is called. Not invoked if the Tween Manager is resumed.
         *
         * The following types are also available and are invoked on a TweenData level, that is per-object, per-property being tweened:
         *
         * `onYoyo` - When a TweenData starts a yoyo. This happens _after_ the `hold` delay expires, if set.
         * `onRepeat` - When a TweenData repeats playback. This happens _after_ the `repeatDelay` expires, if set.
         * `onUpdate` - When a TweenData updates a property on a source target during playback.
         *
         * @name Phaser.Tweens.Tween#callbacks
         * @type {Phaser.Types.Tweens.TweenCallbacks}
         * @since 3.60.0
         */
        this.callbacks = {
            onActive: null,
            onComplete: null,
            onLoop: null,
            onPause: null,
            onRepeat: null,
            onResume: null,
            onStart: null,
            onStop: null,
            onUpdate: null,
            onYoyo: null
        };

        /**
         * Will this Tween persist after playback? A Tween that persists will _not_ be destroyed by the
         * Tween Manager, or when calling `Tween.stop`, and can be re-played as required. You can either
         * set this property when creating the tween in the tween config, or set it _prior_ to playback.
         *
         * However, it's up to you to ensure you destroy persistent tweens when you are finished with them,
         * or they will retain references you may no longer require and waste memory.
         *
         * @name Phaser.Tweens.Tween#persist
         * @type {boolean}
         * @default false
         * @since 3.60.0
         */
        this.persist = false;

        /**
         * If this Tween has been chained to another tween, this contains a reference to that tween.
         *
         * See the `Tween.chain` method for more details.
         *
         * @name Phaser.Tweens.Tween#chainedTween
         * @type {Phaser.Tweens.Tween}
         * @default null
         * @since 3.60.0
         */
        this.chainedTween = null;

        /**
         * The delta used in the current update.
         *
         * @name Phaser.Tweens.Tween#delta
         * @type {number}
         * @default 0
         * @since 3.60.0
         */
        this.delta = 0;
    },

    /**
     * Prepares this Tween for playback.
     *
     * Called automatically by the TweenManager. Should not be called directly.
     *
     * @method Phaser.Tweens.Tween#init
     * @fires Phaser.Tweens.Events#TWEEN_ACTIVE
     * @since 3.0.0
     *
     * @param {boolean} [isChained=false] - Is this Tween chained to another?
     *
     * @return {this} This Tween instance.
     */
    init: function (isChained)
    {
        if (isChained === undefined) { isChained = false; }

        this.initTweenData();

        if (!isChained)
        {
            this.state = TWEEN_CONST.ACTIVE;

            this.dispatchEvent(Events.TWEEN_ACTIVE, this.callbacks.onActive);
        }

        return this;
    },

    add: function (targetIndex, key, getEnd, getStart, getActive, ease, delay, duration, yoyo, hold, repeat, repeatDelay, flipX, flipY, interpolation, interpolationData)
    {
        this.totalData = this.data.push(new TweenData(this, targetIndex, key, getEnd, getStart, getActive, ease, delay, duration, yoyo, hold, repeat, repeatDelay, flipX, flipY, interpolation, interpolationData));
    },

    /**
     * Chain a Tween to be started as soon as this Tween reaches an 'onComplete' state.
     *
     * If this Tween never achieves 'onComplete' (i.e. has been set to loop or repeat forever),
     * then the chained Tween will not be started unless the `Tween.complete` method is called.
     *
     * You cannot chain a Tween that is already in a sequence of Tweens.
     *
     * @method Phaser.Tweens.Tween#chain
     * @since 3.60.0
     *
     * @param {Phaser.Tweens.Tween} [tween] - The Tween to chain to this Tween, or don't pass an argument to remove a chain.
     *
     * @return {this} This Tween instance.
     */
    chain: function (tween)
    {
        var tweens = this.getChainedTweens();

        if (tweens.indexOf(tween) === -1)
        {
            this.chainedTween = tween;

            if (tween)
            {
                //  Needs to be told its a chained tween, or it'll start playing
                tween.state = TWEEN_CONST.CHAINED;
            }
        }

        return this;
    },

    /**
     * Sets the value of the time scale applied to this Tween. A value of 1 runs in real-time.
     * A value of 0.5 runs 50% slower, and so on.
     *
     * The value isn't used when calculating total duration of the tween, it's a run-time delta adjustment only.
     *
     * @method Phaser.Tweens.Tween#setTimeScale
     * @since 3.60.0
     *
     * @param {number} value - The time scale value to set.
     *
     * @return {this} This Tween instance.
     */
    setTimeScale: function (value)
    {
        this.timeScale = value;

        return this;
    },

    /**
     * Gets the value of the time scale applied to this Tween. A value of 1 runs in real-time.
     * A value of 0.5 runs 50% slower, and so on.
     *
     * @method Phaser.Tweens.Tween#getTimeScale
     * @since 3.60.0
     *
     * @return {number} The value of the time scale applied to this Tween.
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
     * @since 3.60.0
     *
     * @return {boolean} `true` if the Tween is playing, otherwise `false`.
     */
    isPlaying: function ()
    {
        return (!this.paused && this.state === TWEEN_CONST.ACTIVE);
    },

    /**
     * Checks if the Tween is currently paused.
     *
     * @method Phaser.Tweens.Tween#isPaused
     * @since 3.60.0
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
     * @fires Phaser.Tweens.Events#TWEEN_PAUSE
     * @since 3.60.0
     *
     * @return {this} This Tween instance.
     */
    pause: function ()
    {
        if (!this.paused)
        {
            this.paused = true;

            this.dispatchEvent(Events.TWEEN_PAUSE, this.callbacks.onPause);
        }

        return this;
    },

    /**
     * Resumes the playback of a previously paused Tween.
     *
     * You can also toggle the `Tween.paused` boolean property, but doing so will not trigger the RESUME event.
     *
     * @method Phaser.Tweens.Tween#resume
     * @fires Phaser.Tweens.Events#TWEEN_RESUME
     * @since 3.60.0
     *
     * @return {this} This Tween instance.
     */
    resume: function ()
    {
        if (this.paused)
        {
            this.paused = false;

            this.dispatchEvent(Events.TWEEN_RESUME, this.callbacks.onResume);
        }

        return this;
    },

    /**
     * Internal method that makes this Tween active within the TweenManager
     * and emits the onActive event and callback.
     *
     * @method Phaser.Tweens.Tween#makeActive
     * @fires Phaser.Tweens.Events#TWEEN_ACTIVE
     * @since 3.60.0
     */
    makeActive: function ()
    {
        this.parent.makeActive(this);

        this.dispatchEvent(Events.TWEEN_ACTIVE, this.callbacks.onActive);
    },

    /**
     * Returns the current value of the specified Tween Data.
     *
     * @method Phaser.Tweens.Tween#getValue
     * @since 3.0.0
     *
     * @param {number} [index=0] - The Tween Data to return the value from.
     *
     * @return {number} The value of the requested Tween Data.
     */
    getValue: function (index)
    {
        if (index === undefined) { index = 0; }

        return this.data[index].current;
    },

    /**
     * See if this Tween is currently acting upon the given target.
     *
     * @method Phaser.Tweens.Tween#hasTarget
     * @since 3.0.0
     *
     * @param {object} target - The target to check against this Tween.
     *
     * @return {boolean} `true` if the given target is a target of this Tween, otherwise `false`.
     */
    hasTarget: function (target)
    {
        return (this.targets.indexOf(target) !== -1);
    },

    /**
     * Updates the 'end' value of the given property across all matching targets.
     *
     * Calling this does not adjust the duration of the tween, or the current progress.
     *
     * You can optionally tell it to set the 'start' value to be the current value (before the change).
     *
     * @method Phaser.Tweens.Tween#updateTo
     * @since 3.0.0
     *
     * @param {string} key - The property to set the new value for.
     * @param {*} value - The new value of the property.
     * @param {boolean} [startToCurrent=false] - Should this change set the start value to be the current value?
     *
     * @return {this} This Tween instance.
     */
    updateTo: function (key, value, startToCurrent)
    {
        if (startToCurrent === undefined) { startToCurrent = false; }

        for (var i = 0; i < this.totalData; i++)
        {
            var tweenData = this.data[i];

            if (tweenData.key === key)
            {
                tweenData.end = value;

                if (startToCurrent)
                {
                    tweenData.start = tweenData.current;
                }
            }
        }

        return this;
    },

    /**
     * Restarts the Tween from the beginning.
     *
     * You can only restart a Tween that is currently playing. If the Tween has already been stopped, restarting
     * it will throw an error.
     *
     * If you wish to restart the Tween from a specific point, use the `Tween.seek` method instead.
     *
     * @method Phaser.Tweens.Tween#restart
     * @since 3.0.0
     *
     * @return {this} This Tween instance.
     */
    restart: function ()
    {
        switch (this.state)
        {
            case TWEEN_CONST.REMOVED:
            case TWEEN_CONST.FINISHED:
                this.seek();
                this.parent.makeActive(this);
                break;

            case TWEEN_CONST.PENDING:
            case TWEEN_CONST.PENDING_REMOVE:
                this.parent.reset(this);
                break;

            case TWEEN_CONST.DESTROYED:
                console.warn('Cannot restart destroyed Tweens');
                break;

            default:
                this.seek();
                break;
        }

        this.paused = false;
        this.hasStarted = false;

        return this;
    },

    /**
     * Internal method that advances to the next state of the Tween during playback.
     *
     * @method Phaser.Tweens.Tween#nextState
     * @fires Phaser.Tweens.Events#TWEEN_COMPLETE
     * @fires Phaser.Tweens.Events#TWEEN_LOOP
     * @since 3.0.0
     *
     * @return {boolean} `true` if this Tween has completed, otherwise `false`.
     */
    nextState: function ()
    {
        if (this.loopCounter > 0)
        {
            this.elapsed = 0;
            this.progress = 0;
            this.loopCounter--;

            this.resetTweenData(true);

            if (this.loopDelay > 0)
            {
                this.countdown = this.loopDelay;
                this.state = TWEEN_CONST.LOOP_DELAY;
            }
            else
            {
                this.state = TWEEN_CONST.ACTIVE;

                this.dispatchEvent(Events.TWEEN_LOOP, this.callbacks.onLoop);
            }
        }
        else if (this.completeDelay > 0)
        {
            this.state = TWEEN_CONST.COMPLETE_DELAY;

            this.countdown = this.completeDelay;
        }
        else
        {
            this.state = TWEEN_CONST.PENDING_REMOVE;

            this.onCompleteHandler();

            return true;
        }

        return false;
    },

    onCompleteHandler: function ()
    {
        //  Additional time overstep may be in 'countdown' or the diff between 'elasped' and 'duration'
        // var diff = this.elapsed - this.duration;

        // if (diff < 0)
        // {
        //     diff = 0;
        // }

        this.progress = 1;
        this.totalProgress = 1;

        this.dispatchEvent(Events.TWEEN_COMPLETE, this.callbacks.onComplete);

        //  Chain ...
        if (this.chainedTween)
        {
            this.chainedTween.state = TWEEN_CONST.ACTIVE;

            // this.chainedTween.delta = diff;
        }

        // console.log('end', performance.now());
        // console.log('elapsed', this.elapsed);
        // console.log('over', this.elapsed - this.duration);

        // console.log('over', (this.elapsed - this.duration) - this.delta);
    },

    /**
     * Starts a Tween playing.
     *
     * You only need to call this method if you have configured the tween to be paused on creation.
     *
     * If the Tween is already playing, calling this method again will have no effect. If you wish to
     * restart the Tween, use `Tween.restart` instead.
     *
     * Calling this method after the Tween has completed will start the Tween playing again from the beginning.
     * This is the same as calling `Tween.seek(0)` and then `Tween.play()`.
     *
     * @method Phaser.Tweens.Tween#play
     * @since 3.0.0
     *
     * @return {this} This Tween instance.
     */
    play: function ()
    {
        var state = this.state;

        if (state === TWEEN_CONST.DESTROYED)
        {
            console.warn('Cannot play destroyed Tween');

            return this;
        }

        if (state === TWEEN_CONST.PENDING_REMOVE || state === TWEEN_CONST.REMOVED)
        {
            //  This makes the tween active as well:
            this.seek();
        }

        this.paused = false;
        this.state = TWEEN_CONST.ACTIVE;

        return this;
    },

    /**
     * Internal method that resets all of the Tween Data, including the progress and elapsed values.
     *
     * @method Phaser.Tweens.Tween#resetTweenData
     * @since 3.0.0
     *
     * @param {boolean} resetFromLoop - Has this method been called as part of a loop?
     */
    resetTweenData: function (resetFromLoop)
    {
        var data = this.data;
        var total = this.totalData;

        for (var i = 0; i < total; i++)
        {
            data[i].reset(resetFromLoop);
        }
    },

    /**
     * Seeks to a specific point in the Tween.
     *
     * **Note:** Be careful when seeking a Tween that repeats or loops forever,
     * or that has an unusually long total duration, as it's possible to hang the browser.
     *
     * The given position is a value between 0 and 1 which represents how far through the Tween to seek to.
     * A value of 0.5 would seek to half-way through the Tween, where-as a value of zero would seek to the start.
     *
     * Note that the seek takes the entire duration of the Tween into account, including delays, loops and repeats.
     * For example, a Tween that lasts for 2 seconds, but that loops 3 times, would have a total duration of 6 seconds,
     * so seeking to 0.5 would seek to 3 seconds into the Tween, as that's half-way through its _entire_ duration.
     *
     * Seeking works by resetting the Tween to its initial values and then iterating through the Tween at `delta`
     * jumps per step. The longer the Tween, the longer this can take.
     *
     * @method Phaser.Tweens.Tween#seek
     * @since 3.0.0
     *
     * @param {number} [toPosition=0] - A value between 0 and 1 which represents the progress point to seek to.
     * @param {number} [delta=16.6] - The size of each step when seeking through the Tween. A higher value completes faster but at the cost of less precision.
     *
     * @return {this} This Tween instance.
     */
    seek: function (toPosition, delta)
    {
        if (toPosition === undefined) { toPosition = 0; }
        if (delta === undefined) { delta = 16.6; }

        if (this.state === TWEEN_CONST.REMOVED || this.state === TWEEN_CONST.FINISHED)
        {
            this.makeActive();
        }

        this.initTweenData(true);

        if (toPosition > 0)
        {
            this.isSeeking = true;

            do
            {
                this.update(delta);

            } while (this.totalProgress <= toPosition);

            this.isSeeking = false;
        }

        return this;
    },

    /**
     * Initialises all of the Tween Data and Tween values.
     *
     * This is called automatically and should not typically be invoked directly.
     *
     * @method Phaser.Tweens.Tween#initTweenData
     * @since 3.60.0
     *
     * @param {boolean} [isSeek=false] - Is this being called as part of a seek, or not?
     */
    initTweenData: function (isSeek)
    {
        if (isSeek === undefined) { isSeek = false; }

        this.elapsed = 0;
        this.progress = 0;
        this.totalElapsed = 0;
        this.totalProgress = 0;

        this.duration = 0;
        this.startDelay = MATH_CONST.MAX_SAFE_INTEGER;

        var data = this.data;

        for (var i = 0; i < this.totalData; i++)
        {
            data[i].init(isSeek);
        }

        //  Excludes loop values

        //  If duration has been set to 0 then we give it a super-low value so that it always
        //  renders at least 1 frame, but no more, without causing divided by zero errors elsewhere.
        this.duration = Math.max(this.duration, 0.001);

        this.loopCounter = (this.loop === -1) ? 999999999999 : this.loop;

        if (this.loopCounter > 0)
        {
            this.totalDuration = this.duration + this.completeDelay + ((this.duration + this.loopDelay) * this.loopCounter);
        }
        else
        {
            this.totalDuration = this.duration + this.completeDelay;
        }
    },

    /**
     * Flags the Tween as being complete, whatever stage of progress it is at.
     *
     * If an `onComplete` callback has been defined it will automatically invoke it, unless a `delay`
     * argument is provided, in which case the Tween will delay for that period of time before calling the callback.
     *
     * If this Tween has a chained Tween, that will now be started.
     *
     * If you don't need a delay, don't have an `onComplete` callback or have a chained tween, then call `Tween.stop` instead.
     *
     * @method Phaser.Tweens.Tween#complete
     * @fires Phaser.Tweens.Events#TWEEN_COMPLETE
     * @since 3.2.0
     *
     * @param {number} [delay=0] - The time to wait before invoking the complete callback. If zero it will fire immediately.
     *
     * @return {this} This Tween instance.
     */
    complete: function (delay)
    {
        if (delay === undefined) { delay = 0; }

        if (delay)
        {
            this.state = TWEEN_CONST.COMPLETE_DELAY;

            this.countdown = delay;
        }
        else
        {
            this.state = TWEEN_CONST.PENDING_REMOVE;

            this.onCompleteHandler();
        }

        return this;
    },

    /**
     * Immediately removes this Tween from the TweenManager and all of its internal arrays,
     * no matter what stage it is at. Then sets the tween state to `REMOVED`.
     *
     * You should dispose of your reference to this tween after calling this method, to
     * free it from memory.
     *
     * @method Phaser.Tweens.Tween#remove
     * @since 3.17.0
     *
     * @return {this} This Tween instance.
     */
    remove: function ()
    {
        this.parent.remove(this);

        return this;
    },

    /**
     * Stops the Tween immediately, whatever stage of progress it is at and flags it for removal by the Tween Manager.
     *
     * If an `onStop` callback has been defined it will automatically invoke it.
     *
     * The Tween will be removed during the next game frame, but should be considered 'destroyed' from this point on.
     *
     * Typically, you cannot play a Tween that has been stopped. If you just wish to pause the tween, not destroy it,
     * then call the `pause` method instead and use `resume` to continue playback. If you wish to restart the Tween,
     * use the `restart` or `seek` methods.
     *
     * @method Phaser.Tweens.Tween#stop
     * @fires Phaser.Tweens.Events#TWEEN_STOP
     * @since 3.0.0
     *
     * @return {this} This Tween instance.
     */
    stop: function ()
    {
        if (this.state !== TWEEN_CONST.REMOVED && this.state !== TWEEN_CONST.PENDING_REMOVE)
        {
            this.dispatchEvent(Events.TWEEN_STOP, this.callbacks.onStop);

            this.state = TWEEN_CONST.PENDING_REMOVE;
        }

        return this;
    },

    /**
     * Internal method that advances the Tween based on the time values.
     *
     * @method Phaser.Tweens.Tween#update
     * @fires Phaser.Tweens.Events#TWEEN_COMPLETE
     * @fires Phaser.Tweens.Events#TWEEN_LOOP
     * @fires Phaser.Tweens.Events#TWEEN_START
     * @since 3.0.0
     *
     * @param {number} delta - The delta time in ms since the last frame. This is a smoothed and capped value based on the FPS rate.
     *
     * @return {boolean} Returns `true` if this Tween has finished and should be removed from the Tween Manager, otherwise returns `false`.
     */
    update: function (delta)
    {
        var state = this.state;

        if (state === TWEEN_CONST.PENDING_REMOVE || state === TWEEN_CONST.DESTROYED)
        {
            return true;
        }
        else if (state === TWEEN_CONST.FINISHED || state === TWEEN_CONST.CHAINED || (this.paused && !this.isSeeking))
        {
            return false;
        }

        delta *= this.timeScale * this.parent.timeScale;

        this.delta = delta;

        this.elapsed += delta;
        this.progress = Math.min(this.elapsed / this.duration, 1);

        this.totalElapsed += delta;
        this.totalProgress = Math.min(this.totalElapsed / this.totalDuration, 1);

        if (state === TWEEN_CONST.LOOP_DELAY)
        {
            this.updateCountdown(TWEEN_CONST.ACTIVE, Events.TWEEN_LOOP, this.callbacks.onLoop);
        }
        else if (state === TWEEN_CONST.COMPLETE_DELAY)
        {
            if (this.updateCountdown(TWEEN_CONST.PENDING_REMOVE))
            {
                this.onCompleteHandler();
            }
        }

        //  Make its own check so the states above can toggle to active on the same frame.
        //  Check 'this.state', not 'state' as it may have been updated by the functions above.
        if (this.state === TWEEN_CONST.ACTIVE)
        {
            this.updateActive(delta);
        }

        var remove = (this.state === TWEEN_CONST.PENDING_REMOVE);

        if (remove && this.persist)
        {
            this.state = TWEEN_CONST.FINISHED;

            remove = false;
        }

        return remove;
    },

    /**
     * Internal method that handles the processing of a countdown timer and
     * the dispatch of related events. Called automatically by `Tween.update`.
     *
     * @method Phaser.Tweens.Tween#updateCountdown
     * @since 3.60.0
     *
     * @param {number} state - The new Tween State to be set.
     * @param {Phaser.Types.Tweens.Event} [event] - The Tween Event to dispatch, if any.
     * @param {function} [callback] - The Tween Callback to invoke, if any.
     *
     * @return {boolean} `true` if the countdown was reached, otherwise `false`.
     */
    updateCountdown: function (state, event, callback)
    {
        this.countdown -= this.delta;

        if (this.countdown <= 0)
        {
            this.state = state;

            if (callback)
            {
                this.dispatchEvent(event, callback);
            }

            return true;
        }

        return false;
    },

    /**
     * Internal method that handles the updating of the Tween Data and
     * related dispatching of events. Called automatically by `Tween.update`.
     *
     * @method Phaser.Tweens.Tween#updateActive
     * @fires Phaser.Tweens.Events#TWEEN_START
     * @since 3.60.0
     *
     * @param {number} delta - The delta time in ms since the last frame. This is a smoothed and capped value based on the FPS rate.
     */
    updateActive: function (delta)
    {
        if (!this.hasStarted && !this.isSeeking)
        {
            this.startDelay -= delta;

            if (this.startDelay <= 0)
            {
                this.hasStarted = true;

                this.dispatchEvent(Events.TWEEN_START, this.callbacks.onStart);

                //  Override the delta to adjust for the time we needed for the startDelay
                delta = Math.max(0, delta - Math.abs(this.startDelay));

                // console.log('onStart', performance.now(), 'delay', this.startDelay, 'delta', delta);
            }
        }

        var data = this.data;
        var stillRunning = false;

        for (var i = 0; i < this.totalData; i++)
        {
            if (data[i].update(delta))
            {
                stillRunning = true;
            }
        }

        //  Anything still running? If not, we're done
        if (!stillRunning)
        {
            //  This calls onCompleteHandler if this tween is over
            this.nextState();
        }
    },

    /**
     * Internal method that will emit a Tween based Event and invoke the given callback.
     *
     * @method Phaser.Tweens.Tween#dispatchEvent
     * @since 3.60.0
     *
     * @param {Phaser.Types.Tweens.Event} event - The Event to be dispatched.
     * @param {function} [callback] - The callback to be invoked. Can be `null` or `undefined` to skip invocation.
     */
    dispatchEvent: function (event, callback)
    {
        if (!this.isSeeking)
        {
            this.emit(event, this, this.targets);

            if (callback)
            {
                callback.func.apply(callback.scope, [ this, this.targets ].concat(callback.params));
            }
        }
    },

    /**
     * Sets an event based callback to be invoked during playback.
     *
     * Calling this method will replace a previously set callback for the given type, if any exists.
     *
     * The types available are:
     *
     * `onActive` - When the Tween is first created it moves to an 'active' state when added to the Tween Manager. 'Active' does not mean 'playing'.
     * `onStart` - When the Tween starts playing after a delayed or paused state. This will happen at the same time as `onActive` if the tween has no delay and isn't paused.
     * `onLoop` - When a Tween loops, if it has been set to do so. This happens _after_ the `loopDelay` expires, if set.
     * `onComplete` - When the Tween finishes playback fully. Never invoked if the Tween is set to repeat infinitely.
     * `onStop` - Invoked only if the `Tween.stop` method is called.
     * `onPause` - Invoked only if the `Tween.pause` method is called. Not invoked if the Tween Manager is paused.
     * `onResume` - Invoked only if the `Tween.resume` method is called. Not invoked if the Tween Manager is resumed.
     *
     * The following types are also available and are invoked on a TweenData level, that is per-target object, per-property, being tweened:
     *
     * `onYoyo` - When a TweenData starts a yoyo. This happens _after_ the `hold` delay expires, if set.
     * `onRepeat` - When a TweenData repeats playback. This happens _after_ the `repeatDelay` expires, if set.
     * `onUpdate` - When a TweenData updates a property on a source target during playback.
     *
     * @method Phaser.Tweens.Tween#setCallback
     * @since 3.60.0
     *
     * @param {Phaser.Types.Tweens.TweenCallbackTypes} type - The type of callback to set. One of: `onActive`, `onComplete`, `onLoop`, `onPause`, `onRepeat`, `onResume`, `onStart`, `onStop`, `onUpdate` or `onYoyo`.
     * @param {function} callback - Your callback that will be invoked.
     * @param {array} [params] - The parameters to pass to the callback. Pass an empty array if you don't want to define any, but do wish to set the scope.
     * @param {object} [scope] - The context scope of the callback. If not given, will use the callback itself as the scope.
     *
     * @return {this} This Tween instance.
     */
    setCallback: function (type, callback, params, scope)
    {
        if (params === undefined) { params = []; }
        if (scope === undefined) { scope = callback; }

        if (this.callbacks.hasOwnProperty(type))
        {
            this.callbacks[type] = { func: callback, scope: scope, params: params };
        }

        return this;
    },

    /**
     * Returns an array containing this Tween and all Tweens chained to it,
     * in the order in which they will be played.
     *
     * If there are no chained Tweens an empty array is returned.
     *
     * @method Phaser.Tweens.Tween#getChainedTweens
     * @since 3.60.0
     *
     * @return {Phaser.Tweens.Tween[]} An array of the chained tweens, or an empty array if there aren't any.
     */
    getChainedTweens: function ()
    {
        var result = [];

        var tween = this.chainedTween;

        do
        {
            //  Safety-check to ensure they didn't chain a Tween to another Tween already in the chain
            if (tween && result.indexOf(tween) === -1)
            {
                result.push(tween);

                tween = tween.chainedTween;
            }
            else
            {
                tween = null;
            }

        } while (tween);

        if (result.length > 0)
        {
            result.unshift(this);
        }

        return result;
    },

    /**
     * Handles the destroy process of this Tween, clearing out the
     * Tween Data and resetting the targets. A Tween that has been
     * destroyed cannot ever be played or used again.
     *
     * @method Phaser.Tweens.Tween#destroy
     * @since 3.60.0
     */
    destroy: function ()
    {
        for (var i = 0; i < this.totalData; i++)
        {
            this.data[i].destroy();
        }

        this.removeAllListeners();

        this.callbacks = null;
        this.data = null;
        this.parent = null;
        this.targets = null;

        this.state = TWEEN_CONST.DESTROYED;
    }

});

/**
 * Creates a new Tween object.
 *
 * Note: This method will only be available if Tweens have been built into Phaser.
 *
 * @method Phaser.GameObjects.GameObjectFactory#tween
 * @since 3.0.0
 *
 * @param {Phaser.Types.Tweens.TweenBuilderConfig|object} config - The Tween configuration.
 *
 * @return {Phaser.Tweens.Tween} The Tween that was created.
 */
GameObjectFactory.register('tween', function (config)
{
    return this.scene.sys.tweens.add(config);
});

/**
 * Creates a new Tween object and returns it.
 *
 * Note: This method will only be available if Tweens have been built into Phaser.
 *
 * @method Phaser.GameObjects.GameObjectCreator#tween
 * @since 3.0.0
 *
 * @param {Phaser.Types.Tweens.TweenBuilderConfig|object} config - The Tween configuration.
 *
 * @return {Phaser.Tweens.Tween} The Tween that was created.
 */
GameObjectCreator.register('tween', function (config)
{
    return this.scene.sys.tweens.create(config);
});

Tween.TYPES = [
    'onActive',
    'onComplete',
    'onLoop',
    'onPause',
    'onRepeat',
    'onResume',
    'onStart',
    'onStop',
    'onUpdate',
    'onYoyo'
];

module.exports = Tween;
