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
var TWEEN_CONST = require('./const');
var MATH_CONST = require('../../math/const');

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
 * @param {Phaser.Types.Tweens.TweenDataConfig[]} data - An array of TweenData objects, each containing a unique property to be tweened.
 * @param {array} targets - An array of targets to be tweened.
 */
var Tween = new Class({

    Extends: EventEmitter,

    initialize:

    function Tween (parent, data, targets)
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
         * @type {Phaser.Types.Tweens.TweenDataConfig[]}
         * @since 3.60.0
         */
        this.data = data;

        /**
         * The cached size of the data array.
         *
         * @name Phaser.Tweens.Tween#totalData
         * @type {number}
         * @since 3.60.0
         */
        this.totalData = data.length;

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
         * @type {number}
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
         * set this property when creating the tween, or toggle it prior to playback.
         *
         * However, it's up to you to ensure you destroy persistent tweens when you are finished with them,
         * or they will retain references you may no longer require and general waste memory.
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
         * When this Tween updates, any excess time is stored in this property.
         *
         * @name Phaser.Tweens.Tween#overshoot
         * @type {number}
         * @default 0
         * @since 3.60.0
         */
        this.overshoot = 0;

        this.debug = {};
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

        var data = this.data;
        var totalTargets = this.totalTargets;

        for (var i = 0; i < this.totalData; i++)
        {
            var tweenData = data[i];

            var target = tweenData.target;
            var key = tweenData.key;
            var targetIndex = tweenData.index;

            var gen = tweenData.gen;

            //  Function signature: target, key, value, index, total, tween

            tweenData.delay = gen.delay(target, key, 0, targetIndex, totalTargets, this);
            tweenData.duration = Math.max(gen.duration(target, key, 0, targetIndex, totalTargets, this), 0.001);
            tweenData.hold = gen.hold(target, key, 0, targetIndex, totalTargets, this);
            tweenData.repeat = gen.repeat(target, key, 0, targetIndex, totalTargets, this);
            tweenData.repeatDelay = gen.repeatDelay(target, key, 0, targetIndex, totalTargets, this);
            tweenData.repeatCounter = (tweenData.repeat === -1) ? 999999999999 : tweenData.repeat;
            tweenData.state = TWEEN_CONST.PENDING_RENDER;

            if (tweenData.delay > 0)
            {
                tweenData.elapsed = tweenData.delay;
                tweenData.state = TWEEN_CONST.DELAY;
            }

            if (tweenData.getActiveValue)
            {
                target[key] = tweenData.getActiveValue(tweenData.target, tweenData.key, tweenData.start);
            }
        }

        this.calcDuration();

        this.progress = 0;
        this.totalProgress = 0;
        this.elapsed = 0;
        this.totalElapsed = 0;

        if (!isChained)
        {
            this.state = TWEEN_CONST.ACTIVE;

            this.dispatchEvent(Events.TWEEN_ACTIVE, this.callbacks.onActive);
        }

        return this;
    },

    /**
     * Internal method that calculates the overall duration of the Tween.
     *
     * @method Phaser.Tweens.Tween#calcDuration
     * @since 3.0.0
     */
    calcDuration: function ()
    {
        var maxDuration = 0;
        var minDelay = MATH_CONST.MAX_SAFE_INTEGER;

        var data = this.data;

        for (var i = 0; i < this.totalData; i++)
        {
            var tweenData = data[i];

            //  Set t1 (duration + hold + yoyo)
            tweenData.t1 = tweenData.duration + tweenData.hold;

            if (tweenData.yoyo)
            {
                tweenData.t1 += tweenData.duration;
            }

            //  Set t2 (repeatDelay + duration + hold + yoyo)
            tweenData.t2 = tweenData.t1 + tweenData.repeatDelay;

            //  Total Duration
            tweenData.totalDuration = tweenData.delay + tweenData.t1;

            if (tweenData.repeat === -1)
            {
                tweenData.totalDuration += (tweenData.t2 * 999999999999);
            }
            else if (tweenData.repeat > 0)
            {
                tweenData.totalDuration += (tweenData.t2 * tweenData.repeat);
            }

            if (tweenData.totalDuration > maxDuration)
            {
                //  Get the longest TweenData from the Tween, used to calculate the Tween TD
                maxDuration = tweenData.totalDuration;
            }

            if (tweenData.delay < minDelay)
            {
                minDelay = tweenData.delay;
            }
        }

        //  Excludes loop values

        //  If duration has been set to 0 then we give it a super-low value so that it always
        //  renders at least 1 frame, but no more, without causing divided by zero errors elsewhere.
        this.duration = Math.max(maxDuration, 0.001);

        this.loopCounter = (this.loop === -1) ? 999999999999 : this.loop;

        if (this.loopCounter > 0)
        {
            this.totalDuration = this.duration + this.completeDelay + ((this.duration + this.loopDelay) * this.loopCounter);
        }
        else
        {
            this.totalDuration = this.duration + this.completeDelay;
        }

        //  How long before this Tween starts playback?
        this.startDelay = minDelay;
    },

    /**
     * Chain a Tween to be started as soon as this Tween reaches an 'onComplete' state.
     *
     * If this Tween never achieves 'onComplete' (i.e. has been set to loop or repeat forever),
     * then the chained Tween will not be started unless the `Tween.complete` method is called.
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
        this.chainedTween = tween;

        if (tween)
        {
            //  Needs to be told its a chained tween? Or just use the 'paused' property?
            tween.state = TWEEN_CONST.CHAINED;
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
     */
    nextState: function (timestamp)
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

            this.onCompleteHandler(timestamp);
        }
    },

    onCompleteHandler: function (timestamp)
    {
        this.dispatchEvent(Events.TWEEN_COMPLETE, this.callbacks.onComplete);

        this.debug.onComplete = timestamp;
        this.debug.onCompleteNow = performance.now();

        //  Chain ...
        //  Additional time overstep may be in 'countdown' or the diff between 'elasped' and 'duration' ?
        // var overshoot = Math.max(0, this.elapsed - this.duration);
        // var overshoot = Math.max(0, this.elapsed - this.duration);

        // console.log('onComplete', timestamp, 'dn', Date.now(), performance.now());

        // console.log('onCompleteHandler - overshot by', overshoot, 'ms - vs.', this.overshoot);
        // console.log('elapsed / duration =', this.elapsed, '=', this.duration);
        // console.log('completeDelay', this.completeDelay, 'countdown', this.countdown);

        console.log('onStart', this.debug.onStart);
        console.log('onComplete', this.debug.onComplete);
        console.log('duration', this.debug.onComplete - this.debug.onStart, 'overshoot', (this.debug.onComplete - this.debug.onStart) - this.duration);

        console.log('onStartNow', this.debug.onStartNow);
        console.log('onCompleteNow', this.debug.onCompleteNow);
        console.log('duration', this.debug.onCompleteNow - this.debug.onStartNow, 'overshoot', (this.debug.onCompleteNow - this.debug.onStartNow) - this.duration);
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

        this.prevTime = performance.now();

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
        var totalTargets = this.totalTargets;

        for (var i = 0; i < total; i++)
        {
            var tweenData = data[i];

            var target = tweenData.target;
            var key = tweenData.key;
            var targetIndex = tweenData.index;

            tweenData.progress = 0;
            tweenData.elapsed = 0;

            tweenData.repeatCounter = (tweenData.repeat === -1) ? 999999999999 : tweenData.repeat;

            if (resetFromLoop)
            {
                tweenData.start = tweenData.getStartValue(target, key, tweenData.start, targetIndex, totalTargets, this);

                tweenData.end = tweenData.getEndValue(target, key, tweenData.end, targetIndex, totalTargets, this);

                tweenData.current = tweenData.start;

                tweenData.state = TWEEN_CONST.PLAYING_FORWARD;
            }
            else
            {
                tweenData.state = TWEEN_CONST.PENDING_RENDER;
            }

            if (tweenData.delay > 0)
            {
                tweenData.elapsed = tweenData.delay;

                tweenData.state = TWEEN_CONST.DELAY;
            }

            if (tweenData.getActiveValue)
            {
                target[key] = tweenData.getActiveValue(tweenData.target, tweenData.key, tweenData.start);
            }
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

        this.elapsed = 0;
        this.progress = 0;
        this.totalElapsed = 0;
        this.totalProgress = 0;

        var data = this.data;
        var totalTargets = this.totalTargets;

        for (var i = 0; i < this.totalData; i++)
        {
            var tweenData = data[i];
            var target = tweenData.target;
            var gen = tweenData.gen;
            var key = tweenData.key;
            var targetIndex = tweenData.index;

            tweenData.progress = 0;
            tweenData.elapsed = 0;

            tweenData.repeatCounter = (tweenData.repeat === -1) ? 999999999999 : tweenData.repeat;

            //  Function signature: target, key, value, index, total, tween

            tweenData.delay = gen.delay(target, key, 0, targetIndex, totalTargets, this);
            tweenData.duration = Math.max(gen.duration(target, key, 0, targetIndex, totalTargets, this), 0.001);
            tweenData.hold = gen.hold(target, key, 0, targetIndex, totalTargets, this);
            tweenData.repeat = gen.repeat(target, key, 0, targetIndex, totalTargets, this);
            tweenData.repeatDelay = gen.repeatDelay(target, key, 0, targetIndex, totalTargets, this);

            tweenData.current = tweenData.start;
            tweenData.state = TWEEN_CONST.PLAYING_FORWARD;

            this.updateTweenData(this, tweenData, 0, targetIndex, totalTargets);

            if (tweenData.delay > 0)
            {
                tweenData.elapsed = tweenData.delay;
                tweenData.state = TWEEN_CONST.DELAY;
            }
        }

        this.calcDuration();

        if (toPosition > 0)
        {
            this.isSeeking = true;

            do
            {
                this.update(0, delta);

            } while (this.totalProgress < toPosition);

            this.isSeeking = false;
        }

        return this;
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
     * @param {number} timestamp - The current time. Either a High Resolution Timer value if it comes from Request Animation Frame, or Date.now if using SetTimeout.
     * @param {number} delta - The delta time in ms since the last frame. This is a smoothed and capped value based on the FPS rate.
     *
     * @return {boolean} Returns `true` if this Tween has finished and should be removed from the Tween Manager, otherwise returns `false`.
     */
    update: function (timestamp, delta)
    {
        var state = this.state;

        if (state === TWEEN_CONST.PENDING_REMOVE || state === TWEEN_CONST.DESTROYED)
        {
            return true;
        }

        if ((this.paused && !this.isSeeking) || state === TWEEN_CONST.FINISHED || state === TWEEN_CONST.CHAINED)
        {
            return false;
        }

        // timestamp = performance.now();

        // delta = timestamp - this.prevTime;

        // console.log(delta);

        // this.prevTime = timestamp;

        delta *= this.timeScale * this.parent.timeScale;

        this.elapsed += delta;
        this.progress = Math.min(this.elapsed / this.duration, 1);

        this.totalElapsed += delta;
        this.totalProgress = Math.min(this.totalElapsed / this.totalDuration, 1);

        this.overshoot = delta;

        if (state === TWEEN_CONST.LOOP_DELAY)
        {
            this.updateCountdown(delta, TWEEN_CONST.ACTIVE, Events.TWEEN_LOOP, this.callbacks.onLoop);
        }
        else if (state === TWEEN_CONST.COMPLETE_DELAY)
        {
            if (this.updateCountdown(delta, TWEEN_CONST.PENDING_REMOVE))
            {
                this.onCompleteHandler();
            }
        }

        //  Make its own check so the states above can toggle to active on the same frame.
        //  Check 'this.state', not 'state' as it may have been updated by the functions above.
        if (this.state === TWEEN_CONST.ACTIVE)
        {
            this.updateActive(delta, timestamp);
        }

        return (this.state === TWEEN_CONST.PENDING_REMOVE);
    },

    /**
     * Internal method that handles the processing of a countdown timer and
     * the dispatch of related events. Called automatically by `Tween.update`.
     *
     * @method Phaser.Tweens.Tween#updateCountdown
     * @since 3.60.0
     *
     * @param {number} delta - The delta time in ms since the last frame. This is a smoothed and capped value based on the FPS rate.
     * @param {number} state - The new Tween State to be set.
     * @param {Phaser.Types.Tweens.Event} [event] - The Tween Event to dispatch, if any.
     * @param {function} [callback] - The Tween Callback to invoke, if any.
     *
     * @return {boolean} `true` if the countdown was reached, otherwise `false`.
     */
    updateCountdown: function (delta, state, event, callback)
    {
        this.countdown -= delta;

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
    updateActive: function (delta, timestamp)
    {
        if (!this.hasStarted && !this.isSeeking)
        {
            this.startDelay -= delta;

            if (this.startDelay <= 0)
            {
                this.hasStarted = true;

                this.dispatchEvent(Events.TWEEN_START, this.callbacks.onStart);

                this.debug.onStart = timestamp;
                this.debug.onStartNow = performance.now();

                delta = 0;

                // console.log('onStart', timestamp, 'now', performance.now(), 'diff', performance.now() - timestamp);
            }
            else
            {
                return;
            }
        }

        var stillRunning = false;

        for (var i = 0; i < this.totalData; i++)
        {
            if (this.updateTweenData(this, this.data[i], delta))
            {
                stillRunning = true;
            }
        }

        //  Anything still running? If not, we're done
        if (!stillRunning)
        {
            this.nextState(timestamp);
        }
    },

    /**
     * Internal method that will emit a TweenData based Event and invoke the given callback.
     *
     * @method Phaser.Tweens.Tween#dispatchTweenDataEvent
     * @since 3.19.0
     *
     * @param {Phaser.Types.Tweens.Event} event - The Event to be dispatched.
     * @param {function} callback - The callback to be invoked. Can be `null` or `undefined` to skip invocation.
     * @param {Phaser.Types.Tweens.TweenDataConfig} tweenData - The TweenData object that caused this event.
     */
    dispatchTweenDataEvent: function (event, callback, tweenData)
    {
        if (!this.isSeeking)
        {
            this.emit(event, this, tweenData.key, tweenData.target, tweenData.current, tweenData.previous);

            if (callback)
            {
                callback.func.apply(callback.scope, [ this, tweenData.target, tweenData.key, tweenData.current, tweenData.previous ].concat(callback.params));
            }
        }
    },

    /**
     * Internal method that will emit a Tween based Event and invoke the given callback.
     *
     * @method Phaser.Tweens.Tween#dispatchEvent
     * @since 3.60.0
     *
     * @param {Phaser.Types.Tweens.Event} event - The Event to be dispatched.
     * @param {function} callback - The callback to be invoked. Can be `null` or `undefined` to skip invocation.
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
     * @param {string} type - The type of callback to set. One of: `onActive`, `onStart`, `onComplete`, `onLoop`, `onRepeat`, `onStop`, `onUpdate` or  onYoyo`.
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
     * Internal method used as part of the playback process that sets a tween to play in reverse.
     *
     * @method Phaser.Tweens.Tween#setStateFromEnd
     * @fires Phaser.Tweens.Events#TWEEN_REPEAT
     * @fires Phaser.Tweens.Events#TWEEN_YOYO
     * @since 3.0.0
     *
     * @param {Phaser.Tweens.Tween} tween - The Tween to update.
     * @param {Phaser.Types.Tweens.TweenDataConfig} tweenData - The TweenData property to update.
     * @param {number} diff - Any extra time that needs to be accounted for in the elapsed and progress values.
     *
     * @return {number} The state of this Tween.
     */
    setStateFromEnd: function (tween, tweenData, diff)
    {
        if (tweenData.yoyo)
        {
            //  We've hit the end of a Playing Forward TweenData and we have a yoyo

            //  Account for any extra time we got from the previous frame
            tweenData.elapsed = diff;
            tweenData.progress = diff / tweenData.duration;

            if (tweenData.flipX)
            {
                tweenData.target.toggleFlipX();
            }

            if (tweenData.flipY)
            {
                tweenData.target.toggleFlipY();
            }

            this.dispatchTweenDataEvent(Events.TWEEN_YOYO, tween.callbacks.onYoyo, tweenData);

            tweenData.start = tweenData.getStartValue(tweenData.target, tweenData.key, tweenData.start, tweenData.index, tween.totalTargets, tween);

            return TWEEN_CONST.PLAYING_BACKWARD;
        }
        else if (tweenData.repeatCounter > 0)
        {
            //  We've hit the end of a Playing Forward TweenData and we have a Repeat.
            //  So we're going to go right back to the start to repeat it again.

            tweenData.repeatCounter--;

            //  Account for any extra time we got from the previous frame
            tweenData.elapsed = diff;
            tweenData.progress = diff / tweenData.duration;

            if (tweenData.flipX)
            {
                tweenData.target.toggleFlipX();
            }

            if (tweenData.flipY)
            {
                tweenData.target.toggleFlipY();
            }

            tweenData.start = tweenData.getStartValue(tweenData.target, tweenData.key, tweenData.start, tweenData.index, tween.totalTargets, tween);

            tweenData.end = tweenData.getEndValue(tweenData.target, tweenData.key, tweenData.start, tweenData.index, tween.totalTargets, tween);

            //  Delay?
            if (tweenData.repeatDelay > 0)
            {
                tweenData.elapsed = tweenData.repeatDelay - diff;

                tweenData.current = tweenData.start;

                tweenData.target[tweenData.key] = tweenData.current;

                return TWEEN_CONST.REPEAT_DELAY;
            }
            else
            {
                this.dispatchTweenDataEvent(Events.TWEEN_REPEAT, tween.callbacks.onRepeat, tweenData);

                return TWEEN_CONST.PLAYING_FORWARD;
            }
        }

        return TWEEN_CONST.COMPLETE;
    },

    /**
     * Internal method used as part of the playback process that sets a tween to play from the start.
     *
     * @method Phaser.Tweens.Tween#setStateFromStart
     * @fires Phaser.Tweens.Events#TWEEN_REPEAT
     * @since 3.0.0
     *
     * @param {Phaser.Tweens.Tween} tween - The Tween to update.
     * @param {Phaser.Types.Tweens.TweenDataConfig} tweenData - The TweenData property to update.
     * @param {number} diff - Any extra time that needs to be accounted for in the elapsed and progress values.
     *
     * @return {number} The state of this Tween.
     */
    setStateFromStart: function (tween, tweenData, diff)
    {
        if (tweenData.repeatCounter > 0)
        {
            tweenData.repeatCounter--;

            //  Account for any extra time we got from the previous frame
            tweenData.elapsed = diff;
            tweenData.progress = diff / tweenData.duration;

            if (tweenData.flipX)
            {
                tweenData.target.toggleFlipX();
            }

            if (tweenData.flipY)
            {
                tweenData.target.toggleFlipY();
            }

            tweenData.end = tweenData.getEndValue(tweenData.target, tweenData.key, tweenData.start, tweenData.index, tween.totalTargets, tween);

            //  Delay?
            if (tweenData.repeatDelay > 0)
            {
                tweenData.elapsed = tweenData.repeatDelay - diff;

                tweenData.current = tweenData.start;

                tweenData.target[tweenData.key] = tweenData.current;

                return TWEEN_CONST.REPEAT_DELAY;
            }
            else
            {
                this.dispatchTweenDataEvent(Events.TWEEN_REPEAT, tween.callbacks.onRepeat, tweenData);

                return TWEEN_CONST.PLAYING_FORWARD;
            }
        }

        return TWEEN_CONST.COMPLETE;
    },

    /**
     * Internal method that advances the TweenData based on the time value given.
     *
     * @method Phaser.Tweens.Tween#updateTweenData
     * @fires Phaser.Tweens.Events#TWEEN_UPDATE
     * @fires Phaser.Tweens.Events#TWEEN_REPEAT
     * @since 3.0.0
     *
     * @param {Phaser.Tweens.Tween} tween - The Tween to update.
     * @param {Phaser.Types.Tweens.TweenDataConfig} tweenData - The TweenData property to update.
     * @param {number} delta - The elapsed delta time in ms.
     *
     * @return {boolean} True if the tween is not complete (e.g., playing), or false if the tween is complete.
     */
    NEWupdateTweenData: function (tween, tweenData, delta)
    {
        var target = tweenData.target;

        if (tweenData.state === TWEEN_CONST.REPEAT_DELAY)
        {
            tweenData.elapsed -= delta;

            if (tweenData.elapsed <= 0)
            {
                tweenData.elapsed = Math.abs(tweenData.elapsed);

                tweenData.state = TWEEN_CONST.PLAYING_FORWARD;

                //  Adjust the delta for the PLAYING_FORWARD block below
                delta = tweenData.elapsed;

                this.dispatchTweenDataEvent(Events.TWEEN_REPEAT, tween.callbacks.onRepeat, tweenData);
            }
        }

        var forward = (tweenData.state === TWEEN_CONST.PLAYING_FORWARD);
        var backward = (tweenData.state === TWEEN_CONST.PLAYING_BACKWARD);

        if (forward || backward)
        {
            if (!target)
            {
                tweenData.state = TWEEN_CONST.COMPLETE;

                return false;
            }

            var elapsed = tweenData.elapsed;
            var duration = tweenData.duration;
            var diff = 0;

            elapsed += delta;

            if (elapsed > duration)
            {
                diff = elapsed - duration;
                elapsed = duration;
            }

            var progress = elapsed / duration;

            tweenData.elapsed = elapsed;
            tweenData.progress = progress;
            tweenData.previous = tweenData.current;

            if (progress === 1)
            {
                if (forward)
                {
                    tweenData.current = tweenData.end;
                    target[tweenData.key] = tweenData.end;

                    if (tweenData.hold > 0)
                    {
                        tweenData.elapsed = tweenData.hold - diff;

                        tweenData.state = TWEEN_CONST.HOLD_DELAY;
                    }
                    else
                    {
                        tweenData.state = this.setStateFromEnd(tween, tweenData, diff);
                    }
                }
                else
                {
                    tweenData.current = tweenData.start;
                    target[tweenData.key] = tweenData.start;

                    tweenData.state = this.setStateFromStart(tween, tweenData, diff);
                }
            }
            else
            {
                var v = (forward) ? tweenData.ease(progress) : tweenData.ease(1 - progress);

                if (tweenData.interpolation)
                {
                    tweenData.current = tweenData.interpolation(tweenData.interpolationData, v);
                }
                else
                {
                    tweenData.current = tweenData.start + ((tweenData.end - tweenData.start) * v);
                }

                target[tweenData.key] = tweenData.current;
            }

            this.dispatchTweenDataEvent(Events.TWEEN_UPDATE, tween.callbacks.onUpdate, tweenData);
        }

        if (tweenData.state === TWEEN_CONST.DELAY)
        {
            tweenData.elapsed -= delta;

            if (tweenData.elapsed <= 0)
            {
                tweenData.elapsed = Math.abs(tweenData.elapsed);

                tweenData.state = TWEEN_CONST.PENDING_RENDER;
            }
        }

        if (tweenData.state === TWEEN_CONST.HOLD_DELAY)
        {
            tweenData.elapsed -= delta;

            if (tweenData.elapsed <= 0)
            {
                tweenData.state = this.setStateFromEnd(tween, tweenData, Math.abs(tweenData.elapsed));
            }
        }

        if (tweenData.state === TWEEN_CONST.PENDING_RENDER)
        {
            if (target)
            {
                tweenData.start = tweenData.getStartValue(target, tweenData.key, target[tweenData.key], tweenData.index, tween.totalTargets, tween);

                tweenData.end = tweenData.getEndValue(target, tweenData.key, tweenData.start, tweenData.index, tween.totalTargets, tween);

                tweenData.current = tweenData.start;

                target[tweenData.key] = tweenData.start;

                tweenData.state = TWEEN_CONST.PLAYING_FORWARD;
            }
            else
            {
                tweenData.state = TWEEN_CONST.COMPLETE;
            }
        }

        //  Return TRUE if this TweenData still playing, otherwise return FALSE
        return (tweenData.state !== TWEEN_CONST.COMPLETE);
    },

    /**
     * Internal method that advances the TweenData based on the time value given.
     *
     * @method Phaser.Tweens.Tween#updateTweenData
     * @fires Phaser.Tweens.Events#TWEEN_UPDATE
     * @fires Phaser.Tweens.Events#TWEEN_REPEAT
     * @since 3.0.0
     *
     * @param {Phaser.Tweens.Tween} tween - The Tween to update.
     * @param {Phaser.Types.Tweens.TweenDataConfig} tweenData - The TweenData property to update.
     * @param {number} delta - The elapsed delta time in ms.
     *
     * @return {boolean} True if the tween is not complete (e.g., playing), or false if the tween is complete.
     */
    updateTweenData: function (tween, tweenData, delta)
    {
        var target = tweenData.target;

        switch (tweenData.state)
        {
            case TWEEN_CONST.PLAYING_FORWARD:
            case TWEEN_CONST.PLAYING_BACKWARD:

                if (!target)
                {
                    tweenData.state = TWEEN_CONST.COMPLETE;
                    break;
                }

                var elapsed = tweenData.elapsed;
                var duration = tweenData.duration;
                var diff = 0;

                elapsed += delta;

                if (elapsed > duration)
                {
                    diff = elapsed - duration;
                    elapsed = duration;
                }

                var forward = (tweenData.state === TWEEN_CONST.PLAYING_FORWARD);
                var progress = elapsed / duration;

                tweenData.elapsed = elapsed;
                tweenData.progress = progress;
                tweenData.previous = tweenData.current;

                if (progress === 1)
                {
                    if (forward)
                    {
                        tweenData.current = tweenData.end;
                        target[tweenData.key] = tweenData.end;

                        if (tweenData.hold > 0)
                        {
                            tweenData.elapsed = tweenData.hold - diff;

                            tweenData.state = TWEEN_CONST.HOLD_DELAY;
                        }
                        else
                        {
                            tweenData.state = this.setStateFromEnd(tween, tweenData, diff);
                        }
                    }
                    else
                    {
                        tweenData.current = tweenData.start;
                        target[tweenData.key] = tweenData.start;

                        tweenData.state = this.setStateFromStart(tween, tweenData, diff);
                    }
                }
                else
                {
                    var v = (forward) ? tweenData.ease(progress) : tweenData.ease(1 - progress);

                    if (tweenData.interpolation)
                    {
                        tweenData.current = tweenData.interpolation(tweenData.interpolationData, v);
                    }
                    else
                    {
                        tweenData.current = tweenData.start + ((tweenData.end - tweenData.start) * v);
                    }

                    target[tweenData.key] = tweenData.current;
                }

                this.dispatchTweenDataEvent(Events.TWEEN_UPDATE, tween.callbacks.onUpdate, tweenData);

                break;

            case TWEEN_CONST.DELAY:

                tweenData.elapsed -= delta;

                if (tweenData.elapsed <= 0)
                {
                    tweenData.elapsed = Math.abs(tweenData.elapsed);

                    tweenData.state = TWEEN_CONST.PENDING_RENDER;
                }

                break;

            case TWEEN_CONST.REPEAT_DELAY:

                tweenData.elapsed -= delta;

                if (tweenData.elapsed <= 0)
                {
                    tweenData.elapsed = Math.abs(tweenData.elapsed);

                    tweenData.state = TWEEN_CONST.PLAYING_FORWARD;

                    this.dispatchTweenDataEvent(Events.TWEEN_REPEAT, tween.callbacks.onRepeat, tweenData);
                }

                break;

            case TWEEN_CONST.HOLD_DELAY:

                tweenData.elapsed -= delta;

                if (tweenData.elapsed <= 0)
                {
                    tweenData.state = this.setStateFromEnd(tween, tweenData, Math.abs(tweenData.elapsed));
                }

                break;

            case TWEEN_CONST.PENDING_RENDER:

                if (target)
                {
                    tweenData.start = tweenData.getStartValue(target, tweenData.key, target[tweenData.key], tweenData.index, tween.totalTargets, tween);

                    tweenData.end = tweenData.getEndValue(target, tweenData.key, tweenData.start, tweenData.index, tween.totalTargets, tween);

                    tweenData.current = tweenData.start;

                    target[tweenData.key] = tweenData.start;

                    tweenData.state = TWEEN_CONST.PLAYING_FORWARD;
                }
                else
                {
                    tweenData.state = TWEEN_CONST.COMPLETE;
                }

                break;
        }

        //  Return TRUE if this TweenData still playing, otherwise return FALSE
        return (tweenData.state !== TWEEN_CONST.COMPLETE);
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
            var data = this.data[i];

            data.target = null;
            data.getActiveValue = null;
            data.getEndValue = null;
            data.getStartValue = null;
            data.ease = null;
            data.gen = null;
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
