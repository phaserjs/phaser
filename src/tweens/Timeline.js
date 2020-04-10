/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Class = require('../utils/Class');
var EventEmitter = require('eventemitter3');
var Events = require('./events');
var TweenBuilder = require('./builders/TweenBuilder');
var TWEEN_CONST = require('./tween/const');

/**
 * @classdesc
 * A Timeline combines multiple Tweens into one. Its overall behavior is otherwise similar to a single Tween.
 *
 * The Timeline updates all of its Tweens simultaneously. Its methods allow you to easily build a sequence
 * of Tweens (each one starting after the previous one) or run multiple Tweens at once during given parts of the Timeline.
 *
 * @class Timeline
 * @memberof Phaser.Tweens
 * @extends Phaser.Events.EventEmitter
 * @constructor
 * @since 3.0.0
 *
 * @param {Phaser.Tweens.TweenManager} manager - The Tween Manager which owns this Timeline.
 */
var Timeline = new Class({

    Extends: EventEmitter,

    initialize:

    function Timeline (manager)
    {
        EventEmitter.call(this);

        /**
         * The Tween Manager which owns this Timeline.
         *
         * @name Phaser.Tweens.Timeline#manager
         * @type {Phaser.Tweens.TweenManager}
         * @since 3.0.0
         */
        this.manager = manager;

        /**
         * A constant value which allows this Timeline to be easily identified as one.
         *
         * @name Phaser.Tweens.Timeline#isTimeline
         * @type {boolean}
         * @default true
         * @since 3.0.0
         */
        this.isTimeline = true;

        /**
         * An array of Tween objects, each containing a unique property and target being tweened.
         *
         * @name Phaser.Tweens.Timeline#data
         * @type {array}
         * @default []
         * @since 3.0.0
         */
        this.data = [];

        /**
         * The cached size of the data array.
         *
         * @name Phaser.Tweens.Timeline#totalData
         * @type {number}
         * @default 0
         * @since 3.0.0
         */
        this.totalData = 0;

        /**
         * If true then duration, delay, etc values are all frame totals, rather than ms.
         *
         * @name Phaser.Tweens.Timeline#useFrames
         * @type {boolean}
         * @default false
         * @since 3.0.0
         */
        this.useFrames = false;

        /**
         * Scales the time applied to this Timeline. A value of 1 runs in real-time. A value of 0.5 runs 50% slower, and so on.
         * Value isn't used when calculating total duration of the Timeline, it's a run-time delta adjustment only.
         *
         * @name Phaser.Tweens.Timeline#timeScale
         * @type {number}
         * @default 1
         * @since 3.0.0
         */
        this.timeScale = 1;

        /**
         * Loop this Timeline? Can be -1 for an infinite loop, or an integer.
         * When enabled it will play through ALL Tweens again (use Tween.repeat to loop a single tween)
         *
         * @name Phaser.Tweens.Timeline#loop
         * @type {number}
         * @default 0
         * @since 3.0.0
         */
        this.loop = 0;

        /**
         * Time in ms/frames before this Timeline loops.
         *
         * @name Phaser.Tweens.Timeline#loopDelay
         * @type {number}
         * @default 0
         * @since 3.0.0
         */
        this.loopDelay = 0;

        /**
         * How many loops are left to run?
         *
         * @name Phaser.Tweens.Timeline#loopCounter
         * @type {number}
         * @default 0
         * @since 3.0.0
         */
        this.loopCounter = 0;

        /**
         * Time in ms/frames before the 'onComplete' event fires. This never fires if loop = true (as it never completes)
         *
         * @name Phaser.Tweens.Timeline#completeDelay
         * @type {number}
         * @default 0
         * @since 3.0.0
         */
        this.completeDelay = 0;

        /**
         * Countdown timer value, as used by `loopDelay` and `completeDelay`.
         *
         * @name Phaser.Tweens.Timeline#countdown
         * @type {number}
         * @default 0
         * @since 3.0.0
         */
        this.countdown = 0;

        /**
         * The current state of the Timeline.
         *
         * @name Phaser.Tweens.Timeline#state
         * @type {integer}
         * @since 3.0.0
         */
        this.state = TWEEN_CONST.PENDING_ADD;

        /**
         * The state of the Timeline when it was paused (used by Resume)
         *
         * @name Phaser.Tweens.Timeline#_pausedState
         * @type {integer}
         * @private
         * @since 3.0.0
         */
        this._pausedState = TWEEN_CONST.PENDING_ADD;

        /**
         * Does the Timeline start off paused? (if so it needs to be started with Timeline.play)
         *
         * @name Phaser.Tweens.Timeline#paused
         * @type {boolean}
         * @default false
         * @since 3.0.0
         */
        this.paused = false;

        /**
         * Elapsed time in ms/frames of this run through of the Timeline.
         *
         * @name Phaser.Tweens.Timeline#elapsed
         * @type {number}
         * @default 0
         * @since 3.0.0
         */
        this.elapsed = 0;

        /**
         * Total elapsed time in ms/frames of the entire Timeline, including looping.
         *
         * @name Phaser.Tweens.Timeline#totalElapsed
         * @type {number}
         * @default 0
         * @since 3.0.0
         */
        this.totalElapsed = 0;

        /**
         * Time in ms/frames for the whole Timeline to play through once, excluding loop amounts and loop delays.
         *
         * @name Phaser.Tweens.Timeline#duration
         * @type {number}
         * @default 0
         * @since 3.0.0
         */
        this.duration = 0;

        /**
         * Value between 0 and 1. The amount of progress through the Timeline, _excluding loops_.
         *
         * @name Phaser.Tweens.Timeline#progress
         * @type {number}
         * @default 0
         * @since 3.0.0
         */
        this.progress = 0;

        /**
         * Time in ms/frames for all Tweens in this Timeline to complete (including looping)
         *
         * @name Phaser.Tweens.Timeline#totalDuration
         * @type {number}
         * @default 0
         * @since 3.0.0
         */
        this.totalDuration = 0;

        /**
         * Value between 0 and 1. The amount through the entire Timeline, including looping.
         *
         * @name Phaser.Tweens.Timeline#totalProgress
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
         * `onComplete` When the Timeline finishes playback fully or `Timeline.stop` is called. Never invoked if timeline is set to repeat infinitely.
         * `onLoop` When a Timeline loops.
         * `onStart` When the Timeline starts playing.
         * `onUpdate` When a Timeline updates a child Tween.
         * `onYoyo` When a Timeline starts a yoyo.
         *
         * @name Phaser.Tweens.Timeline#callbacks
         * @type {object}
         * @since 3.0.0
         */
        this.callbacks = {
            onComplete: null,
            onLoop: null,
            onStart: null,
            onUpdate: null,
            onYoyo: null
        };

        /**
         * The context in which all callbacks are invoked.
         *
         * @name Phaser.Tweens.Timeline#callbackScope
         * @type {any}
         * @since 3.0.0
         */
        this.callbackScope;
    },

    /**
     * Internal method that will emit a Timeline based Event and invoke the given callback.
     *
     * @method Phaser.Tweens.Timeline#dispatchTimelineEvent
     * @since 3.19.0
     *
     * @param {Phaser.Types.Tweens.Event} event - The Event to be dispatched.
     * @param {function} callback - The callback to be invoked. Can be `null` or `undefined` to skip invocation.
     */
    dispatchTimelineEvent: function (event, callback)
    {
        this.emit(event, this);

        if (callback)
        {
            callback.func.apply(callback.scope, callback.params);
        }
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
     * Check whether or not the Timeline is playing.
     *
     * @method Phaser.Tweens.Timeline#isPlaying
     * @since 3.0.0
     *
     * @return {boolean} `true` if this Timeline is active, otherwise `false`.
     */
    isPlaying: function ()
    {
        return (this.state === TWEEN_CONST.ACTIVE);
    },

    /**
     * Creates a new Tween, based on the given Tween Config, and adds it to this Timeline.
     *
     * @method Phaser.Tweens.Timeline#add
     * @since 3.0.0
     *
     * @param {(Phaser.Types.Tweens.TweenBuilderConfig|object)} config - The configuration object for the Tween.
     *
     * @return {this} This Timeline object.
     */
    add: function (config)
    {
        return this.queue(TweenBuilder(this, config));
    },

    /**
     * Adds an existing Tween to this Timeline.
     *
     * @method Phaser.Tweens.Timeline#queue
     * @since 3.0.0
     *
     * @param {Phaser.Tweens.Tween} tween - The Tween to be added to this Timeline.
     *
     * @return {this} This Timeline object.
     */
    queue: function (tween)
    {
        if (!this.isPlaying())
        {
            tween.parent = this;
            tween.parentIsTimeline = true;

            this.data.push(tween);

            this.totalData = this.data.length;
        }

        return this;
    },

    /**
     * Checks whether a Tween has an offset value.
     *
     * @method Phaser.Tweens.Timeline#hasOffset
     * @since 3.0.0
     *
     * @param {Phaser.Tweens.Tween} tween - The Tween to check.
     *
     * @return {boolean} `true` if the tween has a non-null offset.
     */
    hasOffset: function (tween)
    {
        return (tween.offset !== null);
    },

    /**
     * Checks whether the offset value is a number or a directive that is relative to previous tweens.
     *
     * @method Phaser.Tweens.Timeline#isOffsetAbsolute
     * @since 3.0.0
     *
     * @param {number} value - The offset value to be evaluated.
     *
     * @return {boolean} `true` if the result is a number, `false` if it is a directive like " -= 1000".
     */
    isOffsetAbsolute: function (value)
    {
        return (typeof(value) === 'number');
    },

    /**
     * Checks if the offset is a relative value rather than an absolute one.
     * If the value is just a number, this returns false.
     *
     * @method Phaser.Tweens.Timeline#isOffsetRelative
     * @since 3.0.0
     *
     * @param {string} value - The offset value to be evaluated.
     *
     * @return {boolean} `true` if the value is relative, i.e " -= 1000". If `false`, the offset is absolute.
     */
    isOffsetRelative: function (value)
    {
        var t = typeof(value);

        if (t === 'string')
        {
            var op = value[0];

            if (op === '-' || op === '+')
            {
                return true;
            }
        }

        return false;
    },

    /**
     * Parses the relative offset value, returning a positive or negative number.
     *
     * @method Phaser.Tweens.Timeline#getRelativeOffset
     * @since 3.0.0
     *
     * @param {string} value - The relative offset, in the format of '-=500', for example. The first character determines whether it will be a positive or negative number. Spacing matters here.
     * @param {number} base - The value to use as the offset.
     *
     * @return {number} The parsed offset value.
     */
    getRelativeOffset: function (value, base)
    {
        var op = value[0];
        var num = parseFloat(value.substr(2));
        var result = base;

        switch (op)
        {
            case '+':
                result += num;
                break;

            case '-':
                result -= num;
                break;
        }

        //  Cannot ever be < 0
        return Math.max(0, result);
    },

    /**
     * Calculates the total duration of the timeline.
     * 
     * Computes all tween durations and returns the full duration of the timeline.
     * 
     * The resulting number is stored in the timeline, not as a return value.
     *
     * @method Phaser.Tweens.Timeline#calcDuration
     * @since 3.0.0
     */
    calcDuration: function ()
    {
        var prevEnd = 0;
        var totalDuration = 0;
        var offsetDuration = 0;

        for (var i = 0; i < this.totalData; i++)
        {
            var tween = this.data[i];

            tween.init();

            if (this.hasOffset(tween))
            {
                if (this.isOffsetAbsolute(tween.offset))
                {
                    //  An actual number, so it defines the start point from the beginning of the timeline
                    tween.calculatedOffset = tween.offset;

                    if (tween.offset === 0)
                    {
                        offsetDuration = 0;
                    }
                }
                else if (this.isOffsetRelative(tween.offset))
                {
                    //  A relative offset (i.e. '-=1000', so starts at 'offset' ms relative to the PREVIOUS Tweens ending time)
                    tween.calculatedOffset = this.getRelativeOffset(tween.offset, prevEnd);
                }
            }
            else
            {
                //  Sequential
                tween.calculatedOffset = offsetDuration;
            }

            prevEnd = tween.totalDuration + tween.calculatedOffset;

            totalDuration += tween.totalDuration;
            offsetDuration += tween.totalDuration;
        }

        //  Excludes loop values
        this.duration = totalDuration;

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
     * Initializes the timeline, which means all Tweens get their init() called, and the total duration will be computed.
     * Returns a boolean indicating whether the timeline is auto-started or not.
     *
     * @method Phaser.Tweens.Timeline#init
     * @since 3.0.0
     *
     * @return {boolean} `true` if the Timeline is started. `false` if it is paused.
     */
    init: function ()
    {
        this.calcDuration();

        this.progress = 0;
        this.totalProgress = 0;

        if (this.paused)
        {
            this.state = TWEEN_CONST.PAUSED;

            return false;
        }
        else
        {
            return true;
        }
    },

    /**
     * Resets all of the timeline's tweens back to their initial states.
     * The boolean parameter indicates whether tweens that are looping should reset as well, or not.
     *
     * @method Phaser.Tweens.Timeline#resetTweens
     * @since 3.0.0
     *
     * @param {boolean} resetFromLoop - If `true`, resets all looping tweens to their initial values.
     */
    resetTweens: function (resetFromLoop)
    {
        for (var i = 0; i < this.totalData; i++)
        {
            var tween = this.data[i];

            tween.play(resetFromLoop);
        }
    },

    /**
     * Sets a callback for the Timeline.
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
        if (Timeline.TYPES.indexOf(type) !== -1)
        {
            this.callbacks[type] = { func: callback, scope: scope, params: params };
        }

        return this;
    },

    /**
     * Passed a Tween to the Tween Manager and requests it be made active.
     *
     * @method Phaser.Tweens.Timeline#makeActive
     * @since 3.3.0
     *
     * @param {Phaser.Tweens.Tween} tween - The tween object to make active.
     *
     * @return {Phaser.Tweens.TweenManager} The Timeline's Tween Manager reference.
     */
    makeActive: function (tween)
    {
        return this.manager.makeActive(tween);
    },

    /**
     * Starts playing the Timeline.
     *
     * @method Phaser.Tweens.Timeline#play
     * @fires Phaser.Tweens.Events#TIMELINE_START
     * @since 3.0.0
     */
    play: function ()
    {
        if (this.state === TWEEN_CONST.ACTIVE)
        {
            return;
        }

        if (this.paused)
        {
            this.paused = false;

            this.manager.makeActive(this);

            return;
        }
        else
        {
            this.resetTweens(false);

            this.state = TWEEN_CONST.ACTIVE;
        }

        this.dispatchTimelineEvent(Events.TIMELINE_START, this.callbacks.onStart);
    },

    /**
     * Updates the Timeline's `state` and fires callbacks and events.
     *
     * @method Phaser.Tweens.Timeline#nextState
     * @fires Phaser.Tweens.Events#TIMELINE_COMPLETE
     * @fires Phaser.Tweens.Events#TIMELINE_LOOP
     * @since 3.0.0
     *
     * @see Phaser.Tweens.Timeline#update
     */
    nextState: function ()
    {
        if (this.loopCounter > 0)
        {
            //  Reset the elapsed time
            this.elapsed = 0;
            this.progress = 0;

            this.loopCounter--;

            this.resetTweens(true);

            if (this.loopDelay > 0)
            {
                this.countdown = this.loopDelay;

                this.state = TWEEN_CONST.LOOP_DELAY;
            }
            else
            {
                this.state = TWEEN_CONST.ACTIVE;

                this.dispatchTimelineEvent(Events.TIMELINE_LOOP, this.callbacks.onLoop);
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

            this.dispatchTimelineEvent(Events.TIMELINE_COMPLETE, this.callbacks.onComplete);
        }
    },

    /**
     * Returns 'true' if this Timeline has finished and should be removed from the Tween Manager.
     * Otherwise, returns false.
     *
     * @method Phaser.Tweens.Timeline#update
     * @fires Phaser.Tweens.Events#TIMELINE_COMPLETE
     * @fires Phaser.Tweens.Events#TIMELINE_UPDATE
     * @since 3.0.0
     *
     * @param {number} timestamp - The current time. Either a High Resolution Timer value if it comes from Request Animation Frame, or Date.now if using SetTimeout.
     * @param {number} delta - The delta time in ms since the last frame. This is a smoothed and capped value based on the FPS rate.
     *
     * @return {boolean} Returns `true` if this Timeline has finished and should be removed from the Tween Manager.
     */
    update: function (timestamp, delta)
    {
        if (this.state === TWEEN_CONST.PAUSED)
        {
            return;
        }

        if (this.useFrames)
        {
            delta = 1 * this.manager.timeScale;
        }

        delta *= this.timeScale;

        this.elapsed += delta;
        this.progress = Math.min(this.elapsed / this.duration, 1);

        this.totalElapsed += delta;
        this.totalProgress = Math.min(this.totalElapsed / this.totalDuration, 1);

        switch (this.state)
        {
            case TWEEN_CONST.ACTIVE:

                var stillRunning = this.totalData;

                for (var i = 0; i < this.totalData; i++)
                {
                    var tween = this.data[i];

                    if (tween.update(timestamp, delta))
                    {
                        stillRunning--;
                    }
                }

                this.dispatchTimelineEvent(Events.TIMELINE_UPDATE, this.callbacks.onUpdate);

                //  Anything still running? If not, we're done
                if (stillRunning === 0)
                {
                    this.nextState();
                }

                break;

            case TWEEN_CONST.LOOP_DELAY:

                this.countdown -= delta;

                if (this.countdown <= 0)
                {
                    this.state = TWEEN_CONST.ACTIVE;

                    this.dispatchTimelineEvent(Events.TIMELINE_LOOP, this.callbacks.onLoop);
                }

                break;

            case TWEEN_CONST.COMPLETE_DELAY:

                this.countdown -= delta;

                if (this.countdown <= 0)
                {
                    this.state = TWEEN_CONST.PENDING_REMOVE;

                    this.dispatchTimelineEvent(Events.TIMELINE_COMPLETE, this.callbacks.onComplete);
                }

                break;
        }

        return (this.state === TWEEN_CONST.PENDING_REMOVE);
    },

    /**
     * Stops the Timeline immediately, whatever stage of progress it is at and flags it for removal by the TweenManager.
     *
     * @method Phaser.Tweens.Timeline#stop
     * @since 3.0.0
     */
    stop: function ()
    {
        this.state = TWEEN_CONST.PENDING_REMOVE;
    },

    /**
     * Pauses the Timeline, retaining its internal state.
     * 
     * Calling this on a Timeline that is already paused has no effect and fires no event.
     *
     * @method Phaser.Tweens.Timeline#pause
     * @fires Phaser.Tweens.Events#TIMELINE_PAUSE
     * @since 3.0.0
     *
     * @return {this} This Timeline object.
     */
    pause: function ()
    {
        if (this.state === TWEEN_CONST.PAUSED)
        {
            return;
        }

        this.paused = true;

        this._pausedState = this.state;

        this.state = TWEEN_CONST.PAUSED;

        this.emit(Events.TIMELINE_PAUSE, this);

        return this;
    },

    /**
     * Resumes a paused Timeline from where it was when it was paused.
     * 
     * Calling this on a Timeline that isn't paused has no effect and fires no event.
     *
     * @method Phaser.Tweens.Timeline#resume
     * @fires Phaser.Tweens.Events#TIMELINE_RESUME
     * @since 3.0.0
     *
     * @return {this} This Timeline object.
     */
    resume: function ()
    {
        if (this.state === TWEEN_CONST.PAUSED)
        {
            this.paused = false;

            this.state = this._pausedState;

            this.emit(Events.TIMELINE_RESUME, this);
        }

        return this;
    },

    /**
     * Checks if any of the Tweens in this Timeline as operating on the target object.
     * 
     * Returns `false` if no Tweens operate on the target object.
     *
     * @method Phaser.Tweens.Timeline#hasTarget
     * @since 3.0.0
     *
     * @param {object} target - The target to check all Tweens against.
     *
     * @return {boolean} `true` if there is at least a single Tween that operates on the target object, otherwise `false`.
     */
    hasTarget: function (target)
    {
        for (var i = 0; i < this.data.length; i++)
        {
            if (this.data[i].hasTarget(target))
            {
                return true;
            }
        }

        return false;
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
        for (var i = 0; i < this.data.length; i++)
        {
            this.data[i].stop();
        }
    }

});

Timeline.TYPES = [ 'onStart', 'onUpdate', 'onLoop', 'onComplete', 'onYoyo' ];

module.exports = Timeline;
