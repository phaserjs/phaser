/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2022 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var BaseTween = require('./tween/BaseTween');
var Class = require('../utils/Class');
var Events = require('./events');
var TWEEN_CONST = require('./tween/const');
var TweenBuilder = require('./builders/TweenBuilder');

/**
 * @classdesc
 * A Timeline combines multiple Tweens into one. Its overall behavior is otherwise similar to a single Tween.
 *
 * The Timeline updates all of its Tweens simultaneously. Its methods allow you to easily build a sequence
 * of Tweens (each one starting after the previous one) or run multiple Tweens at once during given parts of the Timeline.
 *
 * @class Timeline
 * @memberof Phaser.Tweens
 * @extends Phaser.Tweens.BaseTween
 * @constructor
 * @since 3.0.0
 *
 * @param {Phaser.Tweens.TweenManager} manager - The Tween Manager which owns this Timeline.
 */
var Timeline = new Class({

    Extends: BaseTween,

    initialize:

    function Timeline (manager)
    {
        BaseTween.call(this, manager);
    },

    /**
     * Initializes the timeline, which means all Tweens get their init() called, and the total duration will be computed.
     * Returns a boolean indicating whether the timeline is auto-started or not.
     *
     * @method Phaser.Tweens.Timeline#init
     * @since 3.0.0
     *
     * @return {this} This Tween instance.
     */
    init: function ()
    {
        this.calcDuration();

        this.progress = 0;
        this.totalProgress = 0;

        this.state = TWEEN_CONST.ACTIVE;

        this.dispatchEvent(Events.TWEEN_ACTIVE, this.callbacks.onActive);

        return this;
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

            // tween.state = TWEEN_CONST.OFFSET_DELAY;

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
        return (typeof(value) === 'string' && (value[0] === '-' || value[0] === '+'));
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
        var num = parseFloat(value.substring(2));
        var result = base;

        if (op === '+')
        {
            result += num;
        }
        else if (op === '-')
        {
            result -= num;
        }

        //  Cannot ever be < 0
        return Math.max(0, result);
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
     * Starts playing the Timeline.
     *
     * @method Phaser.Tweens.Timeline#play
     * @fires Phaser.Tweens.Events#TIMELINE_START
     * @since 3.0.0
     */
    play: function ()
    {
        var state = this.state;

        if (state === TWEEN_CONST.DESTROYED)
        {
            console.warn('Cannot play destroyed Timeline');

            return this;
        }

        this.paused = false;
        this.state = TWEEN_CONST.ACTIVE;

        return this;

        // if (this.paused)
        // {
        //     this.paused = false;

        //     this.makeActive(this);

        //     return;
        // }
        // else
        // {
        //     this.resetTweens(false);

        //     this.state = TWEEN_CONST.ACTIVE;
        // }

        // this.dispatchEvent(Events.TIMELINE_START, this.callbacks.onStart);
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

                this.dispatchEvent(Events.TIMELINE_LOOP, this.callbacks.onLoop);
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

            this.dispatchEvent(Events.TIMELINE_COMPLETE, this.callbacks.onComplete);
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
     * @return {boolean} Returns `true` if this Timeline has finished and should be removed from the Tween Manager, otherwise `false`.
     */
    update: function (timestamp, delta)
    {
        var state = this.state;

        if (state === TWEEN_CONST.PENDING_REMOVE || state === TWEEN_CONST.DESTROYED)
        {
            return true;
        }

        if ((this.paused && !this.isSeeking) || state === TWEEN_CONST.FINISHED)
        {
            return false;
        }

        if (this.useFrames)
        {
            delta = 1 * this.parent.timeScale;
        }
        else
        {
            delta *= this.timeScale * this.parent.timeScale;
        }

        this.elapsed += delta;
        this.progress = Math.min(this.elapsed / this.duration, 1);

        this.totalElapsed += delta;
        this.totalProgress = Math.min(this.totalElapsed / this.totalDuration, 1);

        if (state === TWEEN_CONST.LOOP_DELAY)
        {
            this.updateCountdown(delta, TWEEN_CONST.ACTIVE, Events.TIMELINE_LOOP, this.callbacks.onLoop);
        }
        else if (state === TWEEN_CONST.COMPLETE_DELAY)
        {
            this.updateCountdown(delta, TWEEN_CONST.PENDING_REMOVE, Events.TIMELINE_COMPLETE, this.callbacks.onComplete);
        }

        //  Make its own check so the states above can toggle to active on the same frame.
        //  Check 'this.state', not 'state' as it may have been updated by the functions above.
        if (this.state === TWEEN_CONST.ACTIVE)
        {
            this.updateActive(timestamp, delta);
        }

        return (this.state === TWEEN_CONST.PENDING_REMOVE);
    },

    /**
     * Internal method that handles the processing of a countdown timer and
     * the dispatch of related events. Called automatically by `Tween.update`.
     *
     * @method Phaser.Tweens.Timeline#updateCountdown
     * @since 3.60.0
     *
     * @param {number} delta - The delta time in ms since the last frame. This is a smoothed and capped value based on the FPS rate.
     * @param {number} state - The new Tween State to be set.
     * @param {Phaser.Types.Tweens.Event} [event] - The Tween Event to dispatch, if any.
     * @param {function} [callback] - The Tween Callback to invoke, if any.
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
        }
    },

    /**
     * Internal method that handles the updating of the Tween Data and
     * related dispatching of events. Called automatically by `Tween.update`.
     *
     * @method Phaser.Tweens.Timeline#updateActive
     * @fires Phaser.Tweens.Events#TWEEN_START
     * @since 3.60.0
     *
     * @param {number} timestamp - The current time. Either a High Resolution Timer value if it comes from Request Animation Frame, or Date.now if using SetTimeout.
     * @param {number} delta - The delta time in ms since the last frame. This is a smoothed and capped value based on the FPS rate.
     */
    updateActive: function (timestamp, delta)
    {
        if (!this.hasStarted)
        {
            this.hasStarted = true;

            this.dispatchEvent(Events.TIMELINE_START, this.callbacks.onStart);

            // this.startDelay -= delta;

            // if (this.startDelay <= 0)
            // {
            //     this.hasStarted = true;

            //     this.dispatchEvent(Events.TWEEN_START, this.callbacks.onStart);
            // }
        }

        var stillRunning = false;

        // console.log('updateActive', this.totalData);

        for (var i = 0; i < this.totalData; i++)
        {
            var tween = this.data[i];

            // console.log('updateActive', i, tween.state);

            if (!tween.update(timestamp, delta))
            {
                // console.log('tween', i, 'updated');

                //  As long as at least one Tween returns 'false' then we're still running
                stillRunning = true;
            }
        }

        this.dispatchEvent(Events.TIMELINE_UPDATE, this.callbacks.onUpdate);

        //  Anything still running? If not, we're done
        if (!stillRunning)
        {
            console.log('nothing running any more');
            this.nextState();
        }
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
        BaseTween.prototype.destroy.call(this);

        for (var i = 0; i < this.data.length; i++)
        {
            this.data[i].stop();
        }

        this.data = null;
    }

});

module.exports = Timeline;
