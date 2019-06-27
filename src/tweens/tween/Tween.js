/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2019 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Class = require('../../utils/Class');
var EventEmitter = require('eventemitter3');
var Events = require('../events');
var GameObjectCreator = require('../../gameobjects/GameObjectCreator');
var GameObjectFactory = require('../../gameobjects/GameObjectFactory');
var TWEEN_CONST = require('./const');

/**
 * @classdesc
 * A Tween is able to manipulate the properties of one or more objects to any given value, based
 * on a duration and type of ease. They are rarely instantiated directly and instead should be
 * created via the TweenManager.
 *
 * @class Tween
 * @memberof Phaser.Tweens
 * @extends Phaser.Events.EventEmitter
 * @constructor
 * @since 3.0.0
 *
 * @param {(Phaser.Tweens.TweenManager|Phaser.Tweens.Timeline)} parent - A reference to the parent of this Tween. Either the Tween Manager or a Tween Timeline instance.
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
         * A reference to the parent of this Tween.
         * Either the Tween Manager or a Tween Timeline instance.
         *
         * @name Phaser.Tweens.Tween#parent
         * @type {(Phaser.Tweens.TweenManager|Phaser.Tweens.Timeline)}
         * @since 3.0.0
         */
        this.parent = parent;

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
         * The cached length of the data array.
         *
         * @name Phaser.Tweens.Tween#totalData
         * @type {integer}
         * @since 3.0.0
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
         * @type {integer}
         * @since 3.0.0
         */
        this.totalTargets = targets.length;

        /**
         * If `true` then duration, delay, etc values are all frame totals.
         *
         * @name Phaser.Tweens.Tween#useFrames
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
         * @since 3.19.0
         */
        this.hasStarted = false;

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
         * Set only if this Tween is part of a Timeline.
         *
         * @name Phaser.Tweens.Tween#offset
         * @type {number}
         * @default 0
         * @since 3.0.0
         */
        this.offset = 0;

        /**
         * Set only if this Tween is part of a Timeline. The calculated offset amount.
         *
         * @name Phaser.Tweens.Tween#calculatedOffset
         * @type {number}
         * @default 0
         * @since 3.0.0
         */
        this.calculatedOffset = 0;

        /**
         * The current state of the tween
         *
         * @name Phaser.Tweens.Tween#state
         * @type {integer}
         * @since 3.0.0
         */
        this.state = TWEEN_CONST.PENDING_ADD;

        /**
         * The state of the tween when it was paused (used by Resume)
         *
         * @name Phaser.Tweens.Tween#_pausedState
         * @type {integer}
         * @private
         * @since 3.0.0
         */
        this._pausedState = TWEEN_CONST.PENDING_ADD;

        /**
         * Does the Tween start off paused? (if so it needs to be started with Tween.play)
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
         * Value between 0 and 1. The amount through the Tween, excluding loops.
         *
         * @name Phaser.Tweens.Tween#progress
         * @type {number}
         * @default 0
         * @since 3.0.0
         */
        this.progress = 0;

        /**
         * Time in ms/frames for the Tween to complete (including looping)
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
         * An object containing the various Tween callback references.
         *
         * @name Phaser.Tweens.Tween#callbacks
         * @type {object}
         * @default 0
         * @since 3.0.0
         */
        this.callbacks = {
            onActive: null,
            onComplete: null,
            onLoop: null,
            onRepeat: null,
            onStart: null,
            onUpdate: null,
            onYoyo: null
        };

        /**
         * The context in which all callbacks are invoked.
         *
         * @name Phaser.Tweens.Tween#callbackScope
         * @type {any}
         * @default 0
         * @since 3.0.0
         */
        this.callbackScope;
    },

    /**
     * Returns the current value of the Tween.
     *
     * @method Phaser.Tweens.Tween#getValue
     * @since 3.0.0
     *
     * @return {number} The value of the Tween.
     */
    getValue: function ()
    {
        return this.data[0].current;
    },

    /**
     * Set the scale the time applied to this Tween. A value of 1 runs in real-time. A value of 0.5 runs 50% slower, and so on.
     *
     * @method Phaser.Tweens.Tween#setTimeScale
     * @since 3.0.0
     *
     * @param {number} value - The scale factor for timescale.
     *
     * @return {this} - This Tween instance.
     */
    setTimeScale: function (value)
    {
        this.timeScale = value;

        return this;
    },

    /**
     * Returns the scale of the time applied to this Tween.
     *
     * @method Phaser.Tweens.Tween#getTimeScale
     * @since 3.0.0
     *
     * @return {number} The timescale of this tween (between 0 and 1)
     */
    getTimeScale: function ()
    {
        return this.timeScale;
    },

    /**
     * Checks if the Tween is currently active.
     *
     * @method Phaser.Tweens.Tween#isPlaying
     * @since 3.0.0
     *
     * @return {boolean} `true` if the Tween is active, otherwise `false`.
     */
    isPlaying: function ()
    {
        return (this.state === TWEEN_CONST.ACTIVE);
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
        return (this.state === TWEEN_CONST.PAUSED);
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
     * Updates the value of a property of this Tween to a new value, without adjusting the
     * Tween duration or current progress.
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
     * @return {this} - This Tween instance.
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

                break;
            }
        }

        return this;
    },

    /**
     * Restarts the tween from the beginning.
     *
     * @method Phaser.Tweens.Tween#restart
     * @since 3.0.0
     *
     * @return {this} This Tween instance.
     */
    restart: function ()
    {
        //  Reset these so they're ready for the next update
        this.elapsed = 0;
        this.progress = 0;
        this.totalElapsed = 0;
        this.totalProgress = 0;

        if (this.state === TWEEN_CONST.ACTIVE)
        {
            return this.seek(0);
        }
        else if (this.state === TWEEN_CONST.REMOVED)
        {
            this.seek(0);
            this.parent.makeActive(this);

            return this;
        }
        else if (this.state === TWEEN_CONST.PENDING_ADD)
        {
            return this;
        }
        else
        {
            return this.play();
        }
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
        var minDelay = Number.MAX_SAFE_INTEGER;

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
     * Called by TweenManager.preUpdate as part of its loop to check pending and active tweens.
     * Should not be called directly.
     *
     * @method Phaser.Tweens.Tween#init
     * @since 3.0.0
     *
     * @return {boolean} Returns `true` if this Tween should be moved from the pending list to the active list by the Tween Manager.
     */
    init: function ()
    {
        //  You can't have a paused Tween if it's part of a Timeline
        if (this.paused && !this.parentIsTimeline)
        {
            this.state = TWEEN_CONST.PENDING_ADD;
            this._pausedState = TWEEN_CONST.INIT;

            return false;
        }

        var data = this.data;
        var totalTargets = this.totalTargets;

        for (var i = 0; i < this.totalData; i++)
        {
            var tweenData = data[i];
            var target = tweenData.target;
            var gen = tweenData.gen;

            tweenData.delay = gen.delay(i, totalTargets, target);
            tweenData.duration = Math.max(gen.duration(i, totalTargets, target), 0.001);
            tweenData.hold = gen.hold(i, totalTargets, target);
            tweenData.repeat = gen.repeat(i, totalTargets, target);
            tweenData.repeatDelay = gen.repeatDelay(i, totalTargets, target);
        }

        this.calcDuration();

        this.progress = 0;
        this.totalProgress = 0;
        this.elapsed = 0;
        this.totalElapsed = 0;

        this.state = TWEEN_CONST.INIT;

        return true;
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

        //  When the Tween is moved from the pending to the active list in the manager, even if playback delayed
        this.emit(Events.TWEEN_ACTIVE, this);

        var onActive = this.callbacks.onActive;

        if (onActive)
        {
            onActive.params[1] = this.targets;

            onActive.func.apply(onActive.scope, onActive.params);
        }
    },

    /**
     * Internal method that advances to the next state of the Tween during playback.
     *
     * @method Phaser.Tweens.Tween#nextState
     * @fires Phaser.Tweens.Events#TWEEN_LOOP
     * @fires Phaser.Tweens.Events#TWEEN_COMPLETE
     * @since 3.0.0
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
                this.emit(Events.TWEEN_LOOP, this, this.targets);

                var onLoop = this.callbacks.onLoop;
    
                if (onLoop)
                {
                    onLoop.params[1] = this.targets;
    
                    onLoop.func.apply(onLoop.scope, onLoop.params);
                }

                this.state = TWEEN_CONST.ACTIVE;
            }
        }
        else if (this.completeDelay > 0)
        {
            this.countdown = this.completeDelay;
            this.state = TWEEN_CONST.COMPLETE_DELAY;
        }
        else
        {
            this.emit(Events.TWEEN_COMPLETE, this, this.targets);

            var onComplete = this.callbacks.onComplete;

            if (onComplete)
            {
                onComplete.params[1] = this.targets;

                onComplete.func.apply(onComplete.scope, onComplete.params);
            }

            this.state = TWEEN_CONST.PENDING_REMOVE;
        }
    },

    /**
     * Pauses the Tween immediately. Use `resume` to continue playback.
     *
     * @method Phaser.Tweens.Tween#pause
     * @since 3.0.0
     *
     * @return {this} - This Tween instance.
     */
    pause: function ()
    {
        if (this.state === TWEEN_CONST.PAUSED)
        {
            return this;
        }

        this.paused = true;

        this._pausedState = this.state;

        this.state = TWEEN_CONST.PAUSED;

        return this;
    },

    /**
     * Starts a Tween playing.
     * 
     * You only need to call this method if you have configured the tween to be paused on creation.
     * 
     * If the Tween is already playing, calling this method again will have no effect. If you wish to
     * restart the Tween, use `Tween.restart` instead.
     * 
     * Calling this method after the Tween has completed will start the Tween playing again from the start.
     * This is the same as calling `Tween.seek(0)` and then `Tween.play()`.
     *
     * @method Phaser.Tweens.Tween#play
     * @since 3.0.0
     *
     * @param {boolean} [resetFromTimeline=false] - Is this Tween being played as part of a Timeline?
     *
     * @return {this} This Tween instance.
     */
    play: function (resetFromTimeline)
    {
        if (resetFromTimeline === undefined) { resetFromTimeline = false; }

        var state = this.state;

        if (state === TWEEN_CONST.INIT && !this.parentIsTimeline)
        {
            this.resetTweenData(false);

            this.state = TWEEN_CONST.ACTIVE;

            return this;
        }
        else if (state === TWEEN_CONST.ACTIVE || (state === TWEEN_CONST.PENDING_ADD && this._pausedState === TWEEN_CONST.PENDING_ADD))
        {
            return this;
        }
        else if (!this.parentIsTimeline && (state === TWEEN_CONST.PENDING_REMOVE || state === TWEEN_CONST.REMOVED))
        {
            this.seek(0);
            this.parent.makeActive(this);

            return this;
        }

        if (this.parentIsTimeline)
        {
            this.resetTweenData(resetFromTimeline);

            if (this.calculatedOffset === 0)
            {
                this.state = TWEEN_CONST.ACTIVE;
            }
            else
            {
                this.countdown = this.calculatedOffset;

                this.state = TWEEN_CONST.OFFSET_DELAY;
            }
        }
        else if (this.paused)
        {
            this.paused = false;

            this.makeActive();
        }
        else
        {
            this.resetTweenData(resetFromTimeline);

            this.state = TWEEN_CONST.ACTIVE;

            this.makeActive();
        }

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

        for (var i = 0; i < this.totalData; i++)
        {
            var tweenData = data[i];

            tweenData.progress = 0;
            tweenData.elapsed = 0;

            tweenData.repeatCounter = (tweenData.repeat === -1) ? 999999999999 : tweenData.repeat;

            if (resetFromLoop)
            {
                tweenData.start = tweenData.getStartValue(tweenData.target, tweenData.key, tweenData.start);

                tweenData.end = tweenData.getEndValue(tweenData.target, tweenData.key, tweenData.end);

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
        }
    },

    /**
     * Resumes the playback of a previously paused Tween.
     *
     * @method Phaser.Tweens.Tween#resume
     * @since 3.0.0
     *
     * @return {this} - This Tween instance.
     */
    resume: function ()
    {
        if (this.state === TWEEN_CONST.PAUSED)
        {
            this.paused = false;

            this.state = this._pausedState;
        }
        else
        {
            this.play();
        }

        return this;
    },

    /**
     * Seeks to a specific point in the Tween.
     * 
     * **Note:** You cannot seek a Tween that repeats or loops forever, or that has an unusually long total duration.
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
     * @param {number} toPosition - A value between 0 and 1 which represents the progress point to seek to.
     * @param {number} [delta=16.6] - The size of each step when seeking through the Tween. A higher value completes faster but at a cost of less precision.
     *
     * @return {this} This Tween instance.
     */
    seek: function (toPosition, delta)
    {
        if (delta === undefined) { delta = 16.6; }

        if (this.totalDuration >= 3600000)
        {
            console.warn('Cannot Tween.seek - duration too long or infinite repeat');

            return this;
        }

        if (this.state === TWEEN_CONST.REMOVED)
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

            tweenData.progress = 0;
            tweenData.elapsed = 0;

            tweenData.repeatCounter = (tweenData.repeat === -1) ? 999999999999 : tweenData.repeat;

            tweenData.delay = gen.delay(i, totalTargets, target);
            tweenData.duration = Math.max(gen.duration(i, totalTargets, target), 0.001);
            tweenData.hold = gen.hold(i, totalTargets, target);
            tweenData.repeat = gen.repeat(i, totalTargets, target);
            tweenData.repeatDelay = gen.repeatDelay(i, totalTargets, target);

            tweenData.current = tweenData.start;
            tweenData.state = TWEEN_CONST.PLAYING_FORWARD;

            this.updateTweenData(this, tweenData, 0);

            if (tweenData.delay > 0)
            {
                tweenData.elapsed = tweenData.delay;
                tweenData.state = TWEEN_CONST.DELAY;
            }
        }

        this.calcDuration();

        var wasPaused = false;

        if (this.state === TWEEN_CONST.PAUSED)
        {
            wasPaused = true;

            this.state = TWEEN_CONST.ACTIVE;
        }

        do
        {
            this.update(0, delta);

        } while (this.totalProgress < toPosition);

        if (wasPaused)
        {
            this.state = TWEEN_CONST.PAUSED;
        }

        return this;
    },

    /**
     * Sets an event based callback to be invoked during playback.
     * 
     * The `type` can be: 'onActive', 'onComplete', 'onLoop', 'onRepeat', 'onStart',
     * 'onUpdate' or 'onYoyo'.
     * 
     * Calling this method will replace a previously set callback for the
     * given type, if any exists.
     *
     * @method Phaser.Tweens.Tween#setCallback
     * @since 3.0.0
     *
     * @param {string} type - Type of the callback.
     * @param {function} callback - Callback function.
     * @param {array} [params] - An array of parameters for specified callbacks types.
     * @param {any} [scope] - The context the callback will be invoked in.
     *
     * @return {this} This Tween instance.
     */
    setCallback: function (type, callback, params, scope)
    {
        this.callbacks[type] = { func: callback, scope: scope, params: params };

        return this;
    },

    /**
     * Flags the Tween as being complete, whatever stage of progress it is at.
     *
     * If an onComplete callback has been defined it will automatically invoke it, unless a `delay`
     * argument is provided, in which case the Tween will delay for that period of time before calling the callback.
     *
     * If you don't need a delay, or have an onComplete callback, then call `Tween.stop` instead.
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
            this.countdown = delay;
            this.state = TWEEN_CONST.COMPLETE_DELAY;
        }
        else
        {
            this.emit(Events.TWEEN_COMPLETE, this, this.targets);

            var onComplete = this.callbacks.onComplete;

            if (onComplete)
            {
                onComplete.params[1] = this.targets;

                onComplete.func.apply(onComplete.scope, onComplete.params);
            }

            this.state = TWEEN_CONST.PENDING_REMOVE;
        }

        return this;
    },

    /**
     * Immediately removes this Tween from the TweenManager and all of its internal arrays,
     * no matter what stage it as it. Then sets the tween state to `REMOVED`.
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
     * Stops the Tween immediately, whatever stage of progress it is at and flags it for removal by the TweenManager.
     *
     * @method Phaser.Tweens.Tween#stop
     * @since 3.0.0
     *
     * @param {number} [resetTo] - If you want to seek the tween, provide a value between 0 and 1.
     *
     * @return {this} This Tween instance.
     */
    stop: function (resetTo)
    {
        if (this.state === TWEEN_CONST.ACTIVE)
        {
            if (resetTo !== undefined)
            {
                this.seek(resetTo);
            }
        }

        if (this.state !== TWEEN_CONST.REMOVED)
        {
            if (this.state === TWEEN_CONST.PAUSED || this.state === TWEEN_CONST.PENDING_ADD)
            {
                if (this.parentIsTimeline)
                {
                    this.parent.manager._destroy.push(this);
                    this.parent.manager._toProcess++;
                }
                else
                {
                    this.parent._destroy.push(this);
                    this.parent._toProcess++;
                }
            }

            this.removeAllListeners();

            this.state = TWEEN_CONST.PENDING_REMOVE;
        }

        return this;
    },

    /**
     * Internal method that advances the Tween based on the time values.
     *
     * @method Phaser.Tweens.Tween#update
     * @fires Phaser.Tweens.Events#TWEEN_COMPLETE
     * @fires Phaser.Tweens.Events#TWEEN_START
     * @fires Phaser.Tweens.Events#TWEEN_LOOP
     * @since 3.0.0
     *
     * @param {number} timestamp - The current time. Either a High Resolution Timer value if it comes from Request Animation Frame, or Date.now if using SetTimeout.
     * @param {number} delta - The delta time in ms since the last frame. This is a smoothed and capped value based on the FPS rate.
     *
     * @return {boolean} Returns `true` if this Tween has finished and should be removed from the Tween Manager, otherwise returns `false`.
     */
    update: function (timestamp, delta)
    {
        if (this.state === TWEEN_CONST.PAUSED)
        {
            return false;
        }

        if (this.useFrames)
        {
            delta = 1 * this.parent.timeScale;
        }

        delta *= this.timeScale;

        this.elapsed += delta;
        this.progress = Math.min(this.elapsed / this.duration, 1);

        this.totalElapsed += delta;
        this.totalProgress = Math.min(this.totalElapsed / this.totalDuration, 1);

        switch (this.state)
        {
            case TWEEN_CONST.ACTIVE:

                if (!this.hasStarted)
                {
                    this.startDelay -= delta;
        
                    if (this.startDelay <= 0)
                    {
                        this.hasStarted = true;

                        this.emit(Events.TWEEN_START, this, this.targets);

                        var onStart = this.callbacks.onStart;

                        if (onStart)
                        {
                            onStart.params[1] = this.targets;

                            onStart.func.apply(onStart.scope, onStart.params);
                        }
                    }
                }

                var stillRunning = false;

                for (var i = 0; i < this.totalData; i++)
                {
                    var tweenData = this.data[i];

                    if (this.updateTweenData(this, tweenData, delta))
                    {
                        stillRunning = true;
                    }
                }

                //  Anything still running? If not, we're done
                if (!stillRunning)
                {
                    this.nextState();
                }

                break;

            case TWEEN_CONST.LOOP_DELAY:

                this.countdown -= delta;

                if (this.countdown <= 0)
                {
                    this.emit(Events.TWEEN_LOOP, this, this.targets);

                    var onLoop = this.callbacks.onLoop;
        
                    if (onLoop)
                    {
                        onLoop.params[1] = this.targets;
        
                        onLoop.func.apply(onLoop.scope, onLoop.params);
                    }

                    this.state = TWEEN_CONST.ACTIVE;
                }

                break;

            case TWEEN_CONST.OFFSET_DELAY:

                this.countdown -= delta;

                if (this.countdown <= 0)
                {
                    this.state = TWEEN_CONST.ACTIVE;
                }

                break;

            case TWEEN_CONST.COMPLETE_DELAY:

                this.countdown -= delta;

                if (this.countdown <= 0)
                {
                    this.emit(Events.TWEEN_COMPLETE, this, this.targets);

                    var onComplete = this.callbacks.onComplete;

                    if (onComplete)
                    {
                        onComplete.func.apply(onComplete.scope, onComplete.params);
                    }

                    this.state = TWEEN_CONST.PENDING_REMOVE;
                }

                break;
        }

        return (this.state === TWEEN_CONST.PENDING_REMOVE);
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
     * @return {integer} The state of this Tween.
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

            this.emit(Events.TWEEN_YOYO, this, tweenData.key, tweenData.target);

            var onYoyo = tween.callbacks.onYoyo;

            if (onYoyo)
            {
                //  Element 1 is reserved for the target of the yoyo (and needs setting here)
                onYoyo.params[1] = tweenData.target;

                onYoyo.func.apply(onYoyo.scope, onYoyo.params);
            }

            tweenData.start = tweenData.getStartValue(tweenData.target, tweenData.key, tweenData.start);

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

            tweenData.start = tweenData.getStartValue(tweenData.target, tweenData.key, tweenData.start);

            tweenData.end = tweenData.getEndValue(tweenData.target, tweenData.key, tweenData.start);

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
                this.emit(Events.TWEEN_REPEAT, this, tweenData.key, tweenData.target);

                var onRepeat = tween.callbacks.onRepeat;
    
                if (onRepeat)
                {
                    //  Element 1 is reserved for the target of the repeat (and needs setting here)
                    onRepeat.params[1] = tweenData.target;
    
                    onRepeat.func.apply(onRepeat.scope, onRepeat.params);
                }

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
     * @return {integer} The state of this Tween.
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

            tweenData.end = tweenData.getEndValue(tweenData.target, tweenData.key, tweenData.start);

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
                this.emit(Events.TWEEN_REPEAT, this, tweenData.key, tweenData.target);

                var onRepeat = tween.callbacks.onRepeat;
    
                if (onRepeat)
                {
                    //  Element 1 is reserved for the target of the repeat (and needs setting here)
                    onRepeat.params[1] = tweenData.target;
    
                    onRepeat.func.apply(onRepeat.scope, onRepeat.params);
                }

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
     * @param {number} delta - Either a value in ms, or 1 if Tween.useFrames is true
     *
     * @return {boolean} True if the tween is not complete (e.g., playing), or false if the tween is complete.
     */
    updateTweenData: function (tween, tweenData, delta)
    {
        switch (tweenData.state)
        {
            case TWEEN_CONST.PLAYING_FORWARD:
            case TWEEN_CONST.PLAYING_BACKWARD:

                if (!tweenData.target)
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

                var v;

                if (forward)
                {
                    v = tweenData.ease(progress);
                }
                else
                {
                    v = tweenData.ease(1 - progress);
                }

                tweenData.current = tweenData.start + ((tweenData.end - tweenData.start) * v);

                tweenData.target[tweenData.key] = tweenData.current;

                tweenData.elapsed = elapsed;
                tweenData.progress = progress;

                this.emit(Events.TWEEN_UPDATE, this, tweenData.key, tweenData.target);

                var onUpdate = tween.callbacks.onUpdate;

                if (onUpdate)
                {
                    onUpdate.params[1] = tweenData.target;

                    onUpdate.func.apply(onUpdate.scope, onUpdate.params);
                }

                if (progress === 1)
                {
                    if (forward)
                    {
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
                        tweenData.state = this.setStateFromStart(tween, tweenData, diff);
                    }
                }

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
                    this.emit(Events.TWEEN_REPEAT, this, tweenData.key, tweenData.target);

                    var onRepeat = tween.callbacks.onRepeat;
        
                    if (onRepeat)
                    {
                        //  Element 1 is reserved for the target of the repeat (and needs setting here)
                        onRepeat.params[1] = tweenData.target;
        
                        onRepeat.func.apply(onRepeat.scope, onRepeat.params);
                    }

                    tweenData.elapsed = Math.abs(tweenData.elapsed);

                    tweenData.state = TWEEN_CONST.PLAYING_FORWARD;
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

                if (tweenData.target)
                {
                    tweenData.start = tweenData.getStartValue(tweenData.target, tweenData.key, tweenData.target[tweenData.key]);

                    tweenData.end = tweenData.getEndValue(tweenData.target, tweenData.key, tweenData.start);

                    tweenData.current = tweenData.start;

                    tweenData.target[tweenData.key] = tweenData.start;

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
    }

});

//  onActive = 'active' event = When the Tween is moved from the pending to the active list in the manager, even if playback delayed
//  onStart = 'start' event = When the Tween starts playing from a delayed state (will happen same time as onActive if no delay)
//  onYoyo = 'yoyo' event = When the Tween starts a yoyo
//  onRepeat = 'repeat' event = When a TweenData repeats playback (if any)
//  onComplete = 'complete' event = When the Tween finishes all playback (can sometimes never happen if repeat -1), also when 'stop' called
//  onUpdate = 'update' event = When the Tween updates a TweenData during playback (expensive!)
//  onLoop = 'loop' event = Used to loop ALL TweenDatas in a Tween

Tween.TYPES = [
    'onActive',
    'onComplete',
    'onLoop',
    'onRepeat',
    'onStart',
    'onUpdate',
    'onYoyo'
];

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

//  When registering a factory function 'this' refers to the GameObjectFactory context.
//
//  There are several properties available to use:
//
//  this.scene - a reference to the Scene that owns the GameObjectFactory
//  this.displayList - a reference to the Display List the Scene owns
//  this.updateList - a reference to the Update List the Scene owns

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

//  When registering a factory function 'this' refers to the GameObjectCreator context.

module.exports = Tween;
