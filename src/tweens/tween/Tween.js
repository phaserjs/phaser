/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2022 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var BaseTween = require('./BaseTween');
var Clamp = require('../../math/Clamp');
var Class = require('../../utils/Class');
var Events = require('../events');
var GameObjectCreator = require('../../gameobjects/GameObjectCreator');
var GameObjectFactory = require('../../gameobjects/GameObjectFactory');
var MATH_CONST = require('../../math/const');
var TWEEN_CONST = require('./const');
var TweenData = require('./TweenData');
var TweenFrameData = require('./TweenFrameData');

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
 * @extends Phaser.Tweens.BaseTween
 * @constructor
 * @since 3.0.0
 *
 * @param {Phaser.Tweens.TweenManager} parent - A reference to the Tween Manager that owns this Tween.
 * @param {array} targets - An array of targets to be tweened.
 */
var Tween = new Class({

    Extends: BaseTween,

    initialize:

    function Tween (parent, targets)
    {
        BaseTween.call(this, parent);

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
         * Does this Tween loop infinitely?
         *
         * @name Phaser.Tweens.Tween#isInfinite
         * @type {boolean}
         * @readonly
         * @since 3.60.0
         */
        this.isInfinite = false;

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
     * Adds a new TweenData to this Tween. Typically, this method is called
     * automatically by the TweenBuilder, however you can also invoke it
     * yourself.
     *
     * @method Phaser.Tweens.Tween#add
     * @since 3.60.0
     *
     * @param {number} targetIndex - The target index within the Tween targets array.
     * @param {string} key - The property of the target to tween.
     * @param {Phaser.Types.Tweens.GetEndCallback} getEnd - What the property will be at the END of the Tween.
     * @param {Phaser.Types.Tweens.GetStartCallback} getStart - What the property will be at the START of the Tween.
     * @param {?Phaser.Types.Tweens.GetActiveCallback} getActive - If not null, is invoked _immediately_ as soon as the TweenData is running, and is set on the target property.
     * @param {function} ease - The ease function this tween uses.
     * @param {function} delay - Function that returns the time in ms/frames before tween will start.
     * @param {number} duration - The duration of the tween in ms/frames.
     * @param {boolean} yoyo - Determines whether the tween should return back to its start value after hold has expired.
     * @param {number} hold - Function that returns the time in ms/frames the tween will pause before repeating or returning to its starting value if yoyo is set to true.
     * @param {number} repeat - Function that returns the number of times to repeat the tween. The tween will always run once regardless, so a repeat value of '1' will play the tween twice.
     * @param {number} repeatDelay - Function that returns the time in ms/frames before the repeat will start.
     * @param {boolean} flipX - Should toggleFlipX be called when yoyo or repeat happens?
     * @param {boolean} flipY - Should toggleFlipY be called when yoyo or repeat happens?
     * @param {?function} interpolation - The interpolation function to be used for arrays of data. Defaults to 'null'.
     * @param {?number[]} interpolationData - The array of interpolation data to be set. Defaults to 'null'.
     *
     * @return {Phaser.Tweens.TweenData} The TweenData instance that was added.
     */
    add: function (targetIndex, key, getEnd, getStart, getActive, ease, delay, duration, yoyo, hold, repeat, repeatDelay, flipX, flipY, interpolation, interpolationData)
    {
        var tweenData = new TweenData(this, targetIndex, key, getEnd, getStart, getActive, ease, delay, duration, yoyo, hold, repeat, repeatDelay, flipX, flipY, interpolation, interpolationData);

        this.totalData = this.data.push(tweenData);

        return tweenData;
    },

    /**
     * Adds a new TweenFrameData to this Tween. Typically, this method is called
     * automatically by the TweenBuilder, however you can also invoke it
     * yourself.
     *
     * @method Phaser.Tweens.Tween#addFrame
     * @since 3.60.0
     *
     * @param {number} targetIndex - The target index within the Tween targets array.
     * @param {string} texture - The texture to set on the target at the end of the tween.
     * @param {string|number} frame - The texture frame to set on the target at the end of the tween.
     * @param {function} delay - Function that returns the time in ms/frames before tween will start.
     * @param {number} duration - The duration of the tween in ms/frames.
     * @param {number} hold - Function that returns the time in ms/frames the tween will pause before repeating or returning to its starting value if yoyo is set to true.
     * @param {number} repeat - Function that returns the number of times to repeat the tween. The tween will always run once regardless, so a repeat value of '1' will play the tween twice.
     * @param {number} repeatDelay - Function that returns the time in ms/frames before the repeat will start.
     * @param {boolean} flipX - Should toggleFlipX be called when yoyo or repeat happens?
     * @param {boolean} flipY - Should toggleFlipY be called when yoyo or repeat happens?
     *
     * @return {Phaser.Tweens.TweenFrameData} The TweenFrameData instance that was added.
     */
    addFrame: function (targetIndex, texture, frame, delay, duration, hold, repeat, repeatDelay, flipX, flipY)
    {
        var tweenData = new TweenFrameData(this, targetIndex, texture, frame, delay, duration, hold, repeat, repeatDelay, flipX, flipY);

        this.totalData = this.data.push(tweenData);

        return tweenData;
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
        return (this.targets && this.targets.indexOf(target) !== -1);
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
                console.warn('Cannot restart destroyed Tween', this);
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

                this.setLoopDelayState();
            }
            else
            {
                this.setActiveState();

                this.dispatchEvent(Events.TWEEN_LOOP, 'onLoop');
            }
        }
        else if (this.completeDelay > 0)
        {
            this.countdown = this.completeDelay;

            this.setCompleteDelayState();
        }
        else
        {
            this.onCompleteHandler();

            return true;
        }

        return false;
    },

    /**
     * Internal method that handles this tween completing and starting
     * the next tween in the chain, if any.
     *
     * @method Phaser.Tweens.Tween#onCompleteHandler
     * @since 3.60.0
     */
    onCompleteHandler: function ()
    {
        this.progress = 1;
        this.totalProgress = 1;

        BaseTween.prototype.onCompleteHandler.call(this);
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
        if (this.isDestroyed())
        {
            console.warn('Cannot play destroyed Tween', this);

            return this;
        }

        if (this.isPendingRemove() || this.isPending())
        {
            //  This makes the tween active as well:
            this.seek();
        }

        this.paused = false;

        this.setActiveState();

        return this;
    },

    /**
     * Internal method that resets all of the Tween Data, including the progress and elapsed values.
     *
     * @method Phaser.Tweens.Tween#resetTweenData
     * @since 3.0.0
     *
     * @param {boolean} resetFromLoop - Has this method been called as part of a loop?
    resetTweenData: function (resetFromLoop)
    {
        var data = this.data;
        var total = this.totalData;

        for (var i = 0; i < total; i++)
        {
            data[i].reset(resetFromLoop);
        }
    },
     */

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

        if (this.isInfinite || this.isDestroyed())
        {
            console.warn('Cannot seek destroyed or infinite Tween', this);

            return this;
        }

        this.isSeeking = true;

        //  Calls 'initTweenData' and 'setActiveState'
        this.init();

        if (this.paused)
        {
            this.paused = false;
        }

        toPosition = Clamp(toPosition, 0, 1);

        if (toPosition > 0)
        {
            if (this.isInfinite)
            {
                console.warn('Cannot seek infinite Tween', this);
            }
            else
            {
                do
                {
                    this.update(delta);

                } while (this.totalProgress < toPosition);
            }
        }

        this.isSeeking = false;

        return this;
    },

    /**
     * Initialises all of the Tween Data and Tween values.
     *
     * This is called automatically and should not typically be invoked directly.
     *
     * @method Phaser.Tweens.Tween#initTweenData
     * @since 3.60.0
     */
    initTweenData: function ()
    {
        this.reset();

        //  These two values are set directly during TweenData.init:
        this.duration = 0;
        this.startDelay = MATH_CONST.MAX_SAFE_INTEGER;

        var data = this.data;

        for (var i = 0; i < this.totalData; i++)
        {
            data[i].reset();
        }

        //  Clamp duration to ensure we never divide by zero
        this.duration = Math.max(this.duration, 0.01);

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
     * Resets this Tween ready for another play-through from the parent TweenChain.
     *
     * This is called automatically and should not typically be invoked directly.
     *
     * If you wish to restart this Tween, see `Tween.restart` or `Tween.seek` instead.
     *
     * @method Phaser.Tweens.Tween#reset
     * @since 3.60.0
     *
     * @param {boolean} [skipReset=false] - Skip resetting the TweenData and Active State?
     */
    reset: function (skipReset)
    {
        if (skipReset === undefined) { skipReset = false; }

        this.elapsed = 0;
        this.totalElapsed = 0;
        this.progress = 0;
        this.totalProgress = 0;
        this.loopCounter = this.loop;

        if (this.loop === -1)
        {
            this.isInfinite = true;
            this.loopCounter = TWEEN_CONST.MAX;
        }

        // if (!skipReset)
        // {
        //     this.resetTweenData(true);

        //     this.setActiveState();

        //     this.dispatchEvent(Events.TWEEN_ACTIVE, 'onActive');
        // }
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
        if (this.isPendingRemove() || this.isDestroyed())
        {
            return true;
        }
        else if (this.isFinished() || (this.paused && !this.isSeeking))
        {
            return false;
        }

        delta *= this.timeScale * this.parent.timeScale;

        if (this.isLoopDelayed())
        {
            this.updateLoopCountdown(delta);

            return false;
        }
        else if (this.isCompleteDelayed())
        {
            this.updateCompleteDelay(delta);

            return false;
        }
        else if (!this.hasStarted)
        {
            this.startDelay -= delta;

            if (this.startDelay <= 0)
            {
                this.hasStarted = true;

                this.dispatchEvent(Events.TWEEN_START, 'onStart');

                //  Reset the delta so we always start progress from zero
                delta = 0;
            }
        }

        var stillRunning = false;

        if (this.isActive())
        {
            var data = this.data;

            for (var i = 0; i < this.totalData; i++)
            {
                if (data[i].update(delta))
                {
                    stillRunning = true;
                }
            }
        }

        this.delta = delta;

        this.elapsed += delta;
        this.progress = Math.min(this.elapsed / this.duration, 1);

        this.totalElapsed += delta;
        this.totalProgress = Math.min(this.totalElapsed / this.totalDuration, 1);

        //  Anything still running? If not, we're done
        if (!stillRunning)
        {
            //  This calls onCompleteHandler if this tween is over
            this.nextState();
        }

        //  if nextState called onCompleteHandler then we're ready to be removed, unless we persist
        var remove = this.isPendingRemove();

        if (remove && this.persist)
        {
            this.setFinishedState();

            remove = false;
        }

        return remove;
    },

    forward: function (ms)
    {
        this.update(ms);
    },

    rewind: function (ms)
    {
        this.update(-ms);
    },

    /**
     * Internal method that will emit a Tween based Event and invoke the given callback.
     *
     * @method Phaser.Tweens.Tween#dispatchEvent
     * @since 3.60.0
     *
     * @param {Phaser.Types.Tweens.Event} event - The Event to be dispatched.
     * @param {Phaser.Types.Tweens.TweenCallbackTypes} [callback] - The name of the callback to be invoked. Can be `null` or `undefined` to skip invocation.
     */
    dispatchEvent: function (event, callback)
    {
        if (!this.isSeeking)
        {
            this.emit(event, this, this.targets);

            var handler = this.callbacks[callback];

            if (handler)
            {
                handler.func.apply(this.callbackScope, [ this, this.targets ].concat(handler.params));
            }
        }
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
        BaseTween.prototype.destroy.call(this);

        this.targets = null;
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

module.exports = Tween;
