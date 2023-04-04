/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2013-2023 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var BaseTween = require('./BaseTween');
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
 * @param {object[]} targets - An array of targets to be tweened.
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
         * This array should not be manipulated outside of this Tween.
         *
         * @name Phaser.Tweens.Tween#targets
         * @type {object[]}
         * @since 3.0.0
         */
        this.targets = targets;

        /**
         * Cached target total.
         *
         * Used internally and should be treated as read-only.
         *
         * This is not necessarily the same as the data total.
         *
         * @name Phaser.Tweens.Tween#totalTargets
         * @type {number}
         * @since 3.0.0
         */
        this.totalTargets = targets.length;

        /**
         * Is this Tween currently seeking?
         *
         * This boolean is toggled in the `Tween.seek` method.
         *
         * When a tween is seeking, by default it will not dispatch any events or callbacks.
         *
         * @name Phaser.Tweens.Tween#isSeeking
         * @type {boolean}
         * @readonly
         * @since 3.19.0
         */
        this.isSeeking = false;

        /**
         * Does this Tween loop or repeat infinitely?
         *
         * @name Phaser.Tweens.Tween#isInfinite
         * @type {boolean}
         * @readonly
         * @since 3.60.0
         */
        this.isInfinite = false;

        /**
         * Elapsed time in milliseconds of this run through of the Tween.
         *
         * @name Phaser.Tweens.Tween#elapsed
         * @type {number}
         * @default 0
         * @since 3.60.0
         */
        this.elapsed = 0;

        /**
         * Total elapsed time in milliseconds of the entire Tween, including looping.
         *
         * @name Phaser.Tweens.Tween#totalElapsed
         * @type {number}
         * @default 0
         * @since 3.60.0
         */
        this.totalElapsed = 0;

        /**
         * Time in milliseconds for the whole Tween to play through once, excluding loop amounts and loop delays.
         *
         * This value is set in the `Tween.initTweenData` method and is zero before that point.
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
         * Time in milliseconds it takes for the Tween to complete a full playthrough (including looping)
         *
         * For an infinite Tween, this value is a very large integer.
         *
         * @name Phaser.Tweens.Tween#totalDuration
         * @type {number}
         * @default 0
         * @since 3.60.0
         */
        this.totalDuration = 0;

        /**
         * The amount of progress that has been made through the entire Tween, including looping.
         *
         * A value between 0 and 1.
         *
         * @name Phaser.Tweens.Tween#totalProgress
         * @type {number}
         * @default 0
         * @since 3.60.0
         */
        this.totalProgress = 0;
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
     * @param {function} delay - Function that returns the time in milliseconds before tween will start.
     * @param {number} duration - The duration of the tween in milliseconds.
     * @param {boolean} yoyo - Determines whether the tween should return back to its start value after hold has expired.
     * @param {number} hold - Function that returns the time in milliseconds the tween will pause before repeating or returning to its starting value if yoyo is set to true.
     * @param {number} repeat - Function that returns the number of times to repeat the tween. The tween will always run once regardless, so a repeat value of '1' will play the tween twice.
     * @param {number} repeatDelay - Function that returns the time in milliseconds before the repeat will start.
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
     * @param {function} delay - Function that returns the time in milliseconds before tween will start.
     * @param {number} duration - The duration of the tween in milliseconds.
     * @param {number} hold - Function that returns the time in milliseconds the tween will pause before repeating or returning to its starting value if yoyo is set to true.
     * @param {number} repeat - Function that returns the number of times to repeat the tween. The tween will always run once regardless, so a repeat value of '1' will play the tween twice.
     * @param {number} repeatDelay - Function that returns the time in milliseconds before the repeat will start.
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
     * If this Tween has been destroyed, it will return `null`.
     *
     * @method Phaser.Tweens.Tween#getValue
     * @since 3.0.0
     *
     * @param {number} [index=0] - The Tween Data to return the value from.
     *
     * @return {number} The value of the requested Tween Data, or `null` if this Tween has been destroyed.
     */
    getValue: function (index)
    {
        if (index === undefined) { index = 0; }

        var value = null;

        if (this.data)
        {
            value = this.data[index].current;
        }

        return value;
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
     * Updates the 'end' value of the given property across all matching targets, as long
     * as this Tween is currently playing (either forwards or backwards).
     *
     * Calling this does not adjust the duration of the Tween, or the current progress.
     *
     * You can optionally tell it to set the 'start' value to be the current value.
     *
     * If this Tween is in any other state other than playing then calling this method has no effect.
     *
     * Additionally, if the Tween repeats, is reset, or is seeked, it will revert to the original
     * starting and ending values.
     *
     * @method Phaser.Tweens.Tween#updateTo
     * @since 3.0.0
     *
     * @param {string} key - The property to set the new value for. You cannot update the 'texture' property via this method.
     * @param {number} value - The new value of the property.
     * @param {boolean} [startToCurrent=false] - Should this change set the start value to be the current value?
     *
     * @return {this} This Tween instance.
     */
    updateTo: function (key, value, startToCurrent)
    {
        if (startToCurrent === undefined) { startToCurrent = false; }

        if (key !== 'texture')
        {
            for (var i = 0; i < this.totalData; i++)
            {
                var tweenData = this.data[i];

                if (tweenData.key === key && (tweenData.isPlayingForward() || tweenData.isPlayingBackward()))
                {
                    tweenData.end = value;

                    if (startToCurrent)
                    {
                        tweenData.start = tweenData.current;
                    }
                }
            }
        }

        return this;
    },

    /**
     * Restarts the Tween from the beginning.
     *
     * If the Tween has already finished and been destroyed, restarting it will throw an error.
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

            this.initTweenData(true);

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

        if (this.isPendingRemove() || this.isFinished())
        {
            this.seek();
        }

        this.paused = false;

        this.setActiveState();

        return this;
    },

    /**
     * Seeks to a specific point in the Tween.
     *
     * The given amount is a value in milliseconds that represents how far into the Tween
     * you wish to seek, based on the start of the Tween.
     *
     * Note that the seek amount takes the entire duration of the Tween into account, including delays, loops and repeats.
     * For example, a Tween that lasts for 2 seconds, but that loops 3 times, would have a total duration of 6 seconds,
     * so seeking to 3000 ms would seek to the Tweens half-way point based on its _entire_ duration.
     *
     * Prior to Phaser 3.60 this value was given as a number between 0 and 1 and didn't
     * work for Tweens had an infinite repeat. This new method works for all Tweens.
     *
     * Seeking works by resetting the Tween to its initial values and then iterating through the Tween at `delta`
     * jumps per step. The longer the Tween, the longer this can take. If you need more precision you can
     * reduce the delta value. If you need a faster seek, you can increase it. When the Tween is
     * reset it will refresh the starting and ending values. If these are coming from a dynamic function,
     * or a random array, it will be called for each seek.
     *
     * While seeking the Tween will _not_ emit any of its events or callbacks unless
     * the 3rd parameter is set to `true`.
     *
     * If this Tween is paused, seeking will not change this fact. It will advance the Tween
     * to the desired point and then pause it again.
     *
     * @method Phaser.Tweens.Tween#seek
     * @since 3.0.0
     *
     * @param {number} [amount=0] - The number of milliseconds to seek into the Tween from the beginning.
     * @param {number} [delta=16.6] - The size of each step when seeking through the Tween. A higher value completes faster but at the cost of less precision.
     * @param {boolean} [emit=false] - While seeking, should the Tween emit any of its events or callbacks? The default is 'false', i.e. to seek silently.
     *
     * @return {this} This Tween instance.
     */
    seek: function (amount, delta, emit)
    {
        if (amount === undefined) { amount = 0; }
        if (delta === undefined) { delta = 16.6; }
        if (emit === undefined) { emit = false; }

        if (this.isDestroyed())
        {
            console.warn('Cannot seek destroyed Tween', this);

            return this;
        }

        if (!emit)
        {
            this.isSeeking = true;
        }

        this.reset(true);

        this.initTweenData(true);

        this.setActiveState();

        this.dispatchEvent(Events.TWEEN_ACTIVE, 'onActive');

        var isPaused = this.paused;

        this.paused = false;

        if (amount > 0)
        {
            var iterations = Math.floor(amount / delta);
            var remainder = amount - (iterations * delta);

            for (var i = 0; i < iterations; i++)
            {
                this.update(delta);
            }

            if (remainder > 0)
            {
                this.update(remainder);
            }
        }

        this.paused = isPaused;

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
     *
     * @param {boolean} [isSeeking=false] - Is the Tween Data being reset as part of a seek?
     */
    initTweenData: function (isSeeking)
    {
        if (isSeeking === undefined) { isSeeking = false; }

        //  These two values are updated directly during TweenData.reset:
        this.duration = 0;
        this.startDelay = MATH_CONST.MAX_SAFE_INTEGER;

        var data = this.data;

        for (var i = 0; i < this.totalData; i++)
        {
            data[i].reset(isSeeking);
        }

        //  Clamp duration to ensure we never divide by zero
        this.duration = Math.max(this.duration, 0.01);

        var duration = this.duration;
        var completeDelay = this.completeDelay;
        var loopCounter = this.loopCounter;
        var loopDelay = this.loopDelay;

        if (loopCounter > 0)
        {
            this.totalDuration = duration + completeDelay + ((duration + loopDelay) * loopCounter);
        }
        else
        {
            this.totalDuration = duration + completeDelay;
        }
    },

    /**
     * Resets this Tween ready for another play-through.
     *
     * This is called automatically from the Tween Manager, or from the parent TweenChain,
     * and should not typically be invoked directly.
     *
     * If you wish to restart this Tween, use the `Tween.restart` or `Tween.seek` methods instead.
     *
     * @method Phaser.Tweens.Tween#reset
     * @fires Phaser.Tweens.Events#TWEEN_ACTIVE
     * @since 3.60.0
     *
     * @param {boolean} [skipInit=false] - Skip resetting the TweenData and Active State?
     *
     * @return {this} This Tween instance.
     */
    reset: function (skipInit)
    {
        if (skipInit === undefined) { skipInit = false; }

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

        if (!skipInit)
        {
            this.initTweenData();

            this.setActiveState();

            this.dispatchEvent(Events.TWEEN_ACTIVE, 'onActive');
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
        if (this.isPendingRemove() || this.isDestroyed())
        {
            return true;
        }
        else if (this.paused || this.isFinished())
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

    /**
     * Moves this Tween forward by the given amount of milliseconds.
     *
     * It will only advance through the current loop of the Tween. For example, if the
     * Tween is set to repeat or yoyo, it can only fast forward through a single
     * section of the sequence. Use `Tween.seek` for more complex playhead control.
     *
     * If the Tween is paused or has already finished, calling this will have no effect.
     *
     * @method Phaser.Tweens.Tween#forward
     * @since 3.60.0
     *
     * @param {number} ms - The number of milliseconds to advance this Tween by.
     *
     * @return {this} This Tween instance.
     */
    forward: function (ms)
    {
        this.update(ms);

        return this;
    },

    /**
     * Moves this Tween backward by the given amount of milliseconds.
     *
     * It will only rewind through the current loop of the Tween. For example, if the
     * Tween is set to repeat or yoyo, it can only fast forward through a single
     * section of the sequence. Use `Tween.seek` for more complex playhead control.
     *
     * If the Tween is paused or has already finished, calling this will have no effect.
     *
     * @method Phaser.Tweens.Tween#rewind
     * @since 3.60.0
     *
     * @param {number} ms - The number of milliseconds to rewind this Tween by.
     *
     * @return {this} This Tween instance.
     */
    rewind: function (ms)
    {
        this.update(-ms);

        return this;
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
 * @param {Phaser.Types.Tweens.TweenBuilderConfig|Phaser.Types.Tweens.TweenChainBuilderConfig|Phaser.Tweens.Tween|Phaser.Tweens.TweenChain} config - A Tween Configuration object, or a Tween or TweenChain instance.
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
 * @param {Phaser.Types.Tweens.TweenBuilderConfig|Phaser.Types.Tweens.TweenChainBuilderConfig|Phaser.Tweens.Tween|Phaser.Tweens.TweenChain} config - A Tween Configuration object, or a Tween or TweenChain instance.
 *
 * @return {Phaser.Tweens.Tween} The Tween that was created.
 */
GameObjectCreator.register('tween', function (config)
{
    return this.scene.sys.tweens.create(config);
});

module.exports = Tween;
