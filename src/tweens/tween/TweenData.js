/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2022 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Class = require('../../utils/Class');
var Events = require('../events');
var TWEEN_CONST = require('./const');

/**
 * The TweenData is a class that contains a single target and property that is being tweened.
 *
 * Tweens create TweenData instances when they are created, with one TweenData instance per
 * target and/or property. A Tween can own multiple TweenData instances, but a TweenData only
 * ever belongs to a single Tween.
 *
 * You should not typically create these yourself, but rather use the TweenBuilder,
 * or the `Tween.add` method.
 *
 * Prior to Phaser 3.60 the TweenData was just an object, but was refactored to make
 * it responsible for its own state and updating.
 *
 * @class TweenData
 * @memberof Phaser.Tweens
 * @constructor
 * @since 3.60.0
 *
 * @param {Phaser.Tweens.Tween} tween - The tween this TweenData instance belongs to.
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
 */
var TweenData = new Class({

    initialize:

    function TweenData (tween, targetIndex, key, getEnd, getStart, getActive, ease, delay, duration, yoyo, hold, repeat, repeatDelay, flipX, flipY, interpolation, interpolationData)
    {
        /**
         * A reference to the Tween that this TweenData instance belongs to.
         *
         * @name Phaser.Tweens.TweenData#tween
         * @type {Phaser.Tweens.Tween}
         * @since 3.60.0
         */
        this.tween = tween;

        /**
         * The index of the target within the Tween `targets` array.
         *
         * @name Phaser.Tweens.TweenData#targetIndex
         * @type {number}
         * @since 3.60.0
         */
        this.targetIndex = targetIndex;

        /**
         * The property of the target to be tweened.
         *
         * @name Phaser.Tweens.TweenData#key
         * @type {string}
         * @since 3.60.0
         */
        this.key = key;

        /**
         * A function that returns what to set the target property to,
         * the moment the TweenData is invoked.
         *
         * This is called when this TweenData is inititalised or reset.
         *
         * @name Phaser.Tweens.TweenData#getActiveValue
         * @type {?Phaser.Types.Tweens.GetActiveCallback}
         * @since 3.60.0
         */
        this.getActiveValue = getActive;

        /**
         * A function that returns what to set the target property to
         * at the end of the tween.
         *
         * This is called when the tween starts playing, after any initial
         * start delay, or if the tween is reset, or is set to repeat.
         *
         * @name Phaser.Tweens.TweenData#getEndValue
         * @type {Phaser.Types.Tweens.GetEndCallback}
         * @since 3.60.0
         */
        this.getEndValue = getEnd;

        /**
         * A function that returns what to set the target property to
         * at the start of the tween.
         *
         * This is called when the tween starts playing, after any initial
         * start delay, or if the tween is reset, or is set to repeat.
         *
         * @name Phaser.Tweens.TweenData#getStartValue
         * @type {Phaser.Types.Tweens.GetStartCallback}
         * @since 3.60.0
         */
        this.getStartValue = getStart;

        /**
         * The ease function this Tween uses to calculate the target value.
         *
         * @name Phaser.Tweens.TweenData#ease
         * @type {function}
         * @since 3.60.0
         */
        this.ease = ease;

        /**
         * The duration of the tween in milliseconds, excluding any time required
         * for yoyo or repeats.
         *
         * @name Phaser.Tweens.TweenData#duration
         * @type {number}
         * @since 3.60.0
         */
        this.duration = duration;

        /**
         * The total calculated duration, in milliseconds, of this TweenData.
         * Factoring in the duration, repeats, delays and yoyos.
         *
         * @name Phaser.Tweens.TweenData#totalDuration
         * @type {number}
         * @since 3.60.0
         */
        this.totalDuration = 0;

        /**
         * The time, in milliseconds, before this tween will start playing.
         *
         * This value is generated by the `getDelay` function.
         *
         * @name Phaser.Tweens.TweenData#delay
         * @type {number}
         * @since 3.60.0
         */
        this.delay = 0;

        /**
         * This function returns the value to be used for `TweenData.delay`.
         *
         * @name Phaser.Tweens.TweenData#getDelay
         * @type {function}
         * @since 3.60.0
         */
        this.getDelay = delay;

        /**
         * Will the Tween ease back to its starting values, after reaching the end
         * and any `hold` value that may be set?
         *
         * @name Phaser.Tweens.TweenData#yoyo
         * @type {boolean}
         * @since 3.60.0
         */
        this.yoyo = yoyo;

        /**
         * The time, in milliseconds, before this tween will start a yoyo to repeat.
         *
         * @name Phaser.Tweens.TweenData#hold
         * @type {number}
         * @since 3.60.0
         */
        this.hold = hold;

        /**
         * The number of times this tween will repeat.
         *
         * The tween will always run once regardless of this value,
         * so a repeat value of '1' will play the tween twice: I.e. the original
         * play-through and then it repeats that once (1).
         *
         * If this value is set to -1 this tween will repeat forever.
         *
         * @name Phaser.Tweens.TweenData#repeat
         * @type {number}
         * @since 3.60.0
         */
        this.repeat = repeat;

        /**
         * The time, in milliseconds, before the repeat will start.
         *
         * @name Phaser.Tweens.TweenData#repeatDelay
         * @type {number}
         * @since 3.60.0
         */
        this.repeatDelay = repeatDelay;

        /**
         * How many repeats are left to run?
         *
         * @name Phaser.Tweens.TweenData#repeatCounter
         * @type {number}
         * @since 3.60.0
         */
        this.repeatCounter = 0;

        /**
         * If `true` this Tween will call `toggleFlipX` on the Tween target
         * whenever it yoyo's or repeats. It will only be called if the target
         * has a function matching this name, like most Phaser GameObjects do.
         *
         * @name Phaser.Tweens.TweenData#flipX
         * @type {boolean}
         * @since 3.60.0
         */
        this.flipX = flipX;

        /**
         * If `true` this Tween will call `toggleFlipY` on the Tween target
         * whenever it yoyo's or repeats. It will only be called if the target
         * has a function matching this name, like most Phaser GameObjects do.
         *
         * @name Phaser.Tweens.TweenData#flipY
         * @type {boolean}
         * @since 3.60.0
         */
        this.flipY = flipY;

        /**
         * A value between 0 and 1 holding the progress of this TweenData.
         *
         * @name Phaser.Tweens.TweenData#progress
         * @type {number}
         * @since 3.60.0
         */
        this.progress = 0;

        /**
         * The amount of time, in milliseconds, that has elapsed since this
         * TweenData was made active.
         *
         * @name Phaser.Tweens.TweenData#elapsed
         * @type {number}
         * @since 3.60.0
         */
        this.elapsed = 0;

        /**
         * The target's starting value, as returned by `getStartValue`.
         *
         * @name Phaser.Tweens.TweenData#start
         * @type {number}
         * @since 3.60.0
         */
        this.start = 0;

        /**
         * The target value from the previous step.
         *
         * @name Phaser.Tweens.TweenData#previous
         * @type {number}
         * @since 3.60.0
         */
        this.previous = 0;

        /**
         * The target's current value, as recorded in the most recent step.
         *
         * @name Phaser.Tweens.TweenData#current
         * @type {number}
         * @since 3.60.0
         */
        this.current = 0;

        /**
         * The target's ending value, as returned by `getEndValue`.
         *
         * @name Phaser.Tweens.TweenData#end
         * @type {number}
         * @since 3.60.0
         */
        this.end = 0;

        /**
         * Internal tween timer.
         *
         * @name Phaser.Tweens.TweenData#t1
         * @type {number}
         * @since 3.60.0
         */
        this.t1 = 0;

        /**
         * Internal tween timer.
         *
         * @name Phaser.Tweens.TweenData#t2
         * @type {number}
         * @since 3.60.0
         */
        this.t2 = 0;

        /**
         * The state of this TweenData.
         *
         * @name Phaser.Tweens.TweenData#state
         * @type {Phaser.Types.Tweens.TweenDataState}
         * @since 3.60.0
         */
        this.state = 0;

        /**
         * The interpolation function to be used for arrays of data.
         *
         * @name Phaser.Tweens.TweenData#interpolation
         * @type {?function}
         * @default null
         * @since 3.60.0
         */
        this.interpolation = interpolation;

        /**
         * The array of data to interpolate, if interpolation is being used.
         *
         * @name Phaser.Tweens.TweenData#interpolationData
         * @type {?number[]}
         * @since 3.60.0
         */
        this.interpolationData = interpolationData;
    },

    /**
     * Prepares this TweenData for playback.
     *
     * Called automatically by the parent Tween. Should not be called directly.
     *
     * @method Phaser.Tweens.TweenData#init
     * @since 3.60.0
     *
     * @param {boolean} [isSeek=false] - Is the parent Tween currently seeking?
     */
    init: function (isSeek)
    {
        var tween = this.tween;
        var totalTargets = tween.totalTargets;

        var targetIndex = this.targetIndex;
        var target = tween.targets[targetIndex];
        var key = this.key;

        //  Function signature: target, key, value, index, total, tween

        this.delay = this.getDelay(target, key, 0, targetIndex, totalTargets, tween);

        this.repeatCounter = (this.repeat === -1) ? 999999999999 : this.repeat;

        this.state = TWEEN_CONST.PENDING_RENDER;

        //  calcDuration:

        //  Set t1 (duration + hold + yoyo)
        this.t1 = this.duration + this.hold;

        if (this.yoyo)
        {
            this.t1 += this.duration;
        }

        //  Set t2 (repeatDelay + duration + hold + yoyo)
        this.t2 = this.t1 + this.repeatDelay;

        //  Total Duration
        this.totalDuration = this.delay + this.t1;

        if (this.repeat === -1)
        {
            this.totalDuration += (this.t2 * 999999999999);
        }
        else if (this.repeat > 0)
        {
            this.totalDuration += (this.t2 * this.repeat);
        }

        if (this.totalDuration > tween.duration)
        // if (this.t1 > tween.duration)
        {
            //  Get the longest TweenData from the Tween, used to calculate the Tween TD
            // tween.duration = this.totalDuration;

            tween.duration = this.t1;
        }

        if (this.delay < tween.startDelay)
        {
            tween.startDelay = this.delay;
        }

        //  seek specific:
        if (isSeek)
        {
            this.current = this.start;
            this.progress = 0;
            this.elapsed = 0;

            this.state = TWEEN_CONST.PLAYING_FORWARD;

            this.update(0);
        }

        if (this.delay > 0)
        {
            this.elapsed = this.delay;
            this.state = TWEEN_CONST.DELAY;
        }

        if (!isSeek && this.getActiveValue)
        {
            target[key] = this.getActiveValue(target, key, this.start);
        }
    },

    /**
     * Internal method that advances this TweenData based on the delta value given.
     *
     * @method Phaser.Tweens.TweenData#update
     * @fires Phaser.Tweens.Events#TWEEN_UPDATE
     * @fires Phaser.Tweens.Events#TWEEN_REPEAT
     * @since 3.60.0
     *
     * @param {number} delta - The elapsed delta time in ms.
     *
     * @return {boolean} `true` if this TweenData is still playing, or `false` if it has finished entirely.
     */
    update: function (delta)
    {
        var tween = this.tween;
        var totalTargets = tween.totalTargets;

        var targetIndex = this.targetIndex;
        var target = tween.targets[targetIndex];
        var key = this.key;

        if (this.state === TWEEN_CONST.DELAY)
        {
            this.elapsed -= delta;

            if (this.elapsed <= 0)
            {
                this.elapsed = Math.abs(this.elapsed);

                this.state = TWEEN_CONST.PENDING_RENDER;
            }
        }
        else if (this.state === TWEEN_CONST.REPEAT_DELAY)
        {
            this.elapsed -= delta;

            if (this.elapsed <= 0)
            {
                this.elapsed = Math.abs(this.elapsed);

                this.state = TWEEN_CONST.PLAYING_FORWARD;

                //  Adjust the delta for the PLAYING_FORWARD block below
                delta = this.elapsed;

                this.dispatchEvent(Events.TWEEN_REPEAT, 'onRepeat');
            }
        }
        else if (this.state === TWEEN_CONST.HOLD_DELAY)
        {
            this.elapsed -= delta;

            if (this.elapsed <= 0)
            {
                this.state = this.setStateFromEnd(Math.abs(this.elapsed));
            }
        }

        //  All of the above have the ability to set the state to PLAYING

        if (this.state === TWEEN_CONST.PENDING_RENDER)
        {
            if (target)
            {
                this.start = this.getStartValue(target, key, target[key], targetIndex, totalTargets, tween);

                this.end = this.getEndValue(target, key, this.start, targetIndex, totalTargets, tween);

                this.current = this.start;

                target[key] = this.start;

                this.state = TWEEN_CONST.PLAYING_FORWARD;
            }
            else
            {
                this.state = TWEEN_CONST.COMPLETE;
            }
        }

        var forward = (this.state === TWEEN_CONST.PLAYING_FORWARD);
        var backward = (this.state === TWEEN_CONST.PLAYING_BACKWARD);

        if (forward || backward)
        {
            if (!target)
            {
                this.state = TWEEN_CONST.COMPLETE;

                return false;
            }

            var elapsed = this.elapsed;
            var duration = this.duration;
            var diff = 0;
            var complete = false;

            elapsed += delta;

            if (elapsed > duration)
            {
                diff = elapsed - duration;
                elapsed = duration;
                complete = true;
            }

            var progress = elapsed / duration;

            this.elapsed = elapsed;
            this.progress = progress;
            this.previous = this.current;

            if (complete)
            {
                if (forward)
                {
                    this.current = this.end;

                    target[key] = this.end;

                    if (this.hold > 0)
                    {
                        this.elapsed = this.hold - diff;

                        this.state = TWEEN_CONST.HOLD_DELAY;
                    }
                    else
                    {
                        this.state = this.setStateFromEnd(diff);
                    }
                }
                else
                {
                    this.current = this.start;

                    target[key] = this.start;

                    this.state = this.setStateFromStart(diff);
                }
            }
            else
            {
                var v = (forward) ? this.ease(progress) : this.ease(1 - progress);

                if (this.interpolation)
                {
                    this.current = this.interpolation(this.interpolationData, v);
                }
                else
                {
                    this.current = this.start + ((this.end - this.start) * v);
                }

                target[key] = this.current;
            }

            this.dispatchEvent(Events.TWEEN_UPDATE, 'onUpdate');
        }

        //  Return TRUE if this TweenData still playing, otherwise FALSE
        return (this.state !== TWEEN_CONST.COMPLETE);
    },

    /**
     * Internal method that resets this Tween Data, including the progress and elapsed values.
     *
     * @method Phaser.Tweens.TweenData#reset
     * @since 3.60.0
     *
     * @param {boolean} resetFromLoop - Has this method been called as part of a loop?
     */
    reset: function (resetFromLoop)
    {
        var tween = this.tween;
        var totalTargets = tween.totalTargets;

        var targetIndex = this.targetIndex;
        var target = tween.targets[targetIndex];
        var key = this.key;

        this.progress = 0;
        this.elapsed = 0;

        this.repeatCounter = (this.repeat === -1) ? 999999999999 : this.repeat;

        if (resetFromLoop)
        {
            this.start = this.getStartValue(target, key, this.start, targetIndex, totalTargets, tween);

            this.end = this.getEndValue(target, key, this.end, targetIndex, totalTargets, tween);

            this.current = this.start;

            this.state = TWEEN_CONST.PLAYING_FORWARD;
        }
        else
        {
            this.state = TWEEN_CONST.PENDING_RENDER;
        }

        if (this.delay > 0)
        {
            this.elapsed = this.delay;

            this.state = TWEEN_CONST.DELAY;
        }

        if (this.getActiveValue)
        {
            target[key] = this.getActiveValue(target, key, this.start);
        }
    },

    /**
     * Internal method that will emit a TweenData based Event on the
     * parent Tween and also invoke the given callback, if provided.
     *
     * @method Phaser.Tweens.TweenData#dispatchEvent
     * @since 3.60.0
     *
     * @param {Phaser.Types.Tweens.Event} event - The Event to be dispatched.
     * @param {Phaser.Types.Tweens.TweenCallbackTypes} [callback] - The name of the callback to be invoked. Can be `null` or `undefined` to skip invocation.
     */
    dispatchEvent: function (event, callback)
    {
        var tween = this.tween;

        if (!tween.isSeeking)
        {
            var target = tween.targets[this.targetIndex];
            var key = this.key;

            var current = this.current;
            var previous = this.previoius;

            tween.emit(event, tween, key, target, current, previous);

            var handler = tween.callbacks[callback];

            if (handler)
            {
                handler.func.apply(handler.scope, [ tween, target, key, current, previous ].concat(handler.params));
            }
        }
    },

    /**
     * Internal method used as part of the playback process that checks if this
     * TweenData should yoyo, repeat or has completed.
     *
     * @method Phaser.Tweens.TweenData#setStateFromEnd
     * @fires Phaser.Tweens.Events#TWEEN_REPEAT
     * @fires Phaser.Tweens.Events#TWEEN_YOYO
     * @since 3.60.0
     *
     * @param {number} diff - Any extra time that needs to be accounted for in the elapsed and progress values.
     *
     * @return {Phaser.Types.Tweens.TweenDataState} The new state of this TweenData.
     */
    setStateFromEnd: function (diff)
    {
        var tween = this.tween;
        var totalTargets = tween.totalTargets;

        var targetIndex = this.targetIndex;
        var target = tween.targets[targetIndex];
        var key = this.key;

        if (this.yoyo)
        {
            //  We've hit the end of a Playing Forward TweenData and we have a yoyo

            //  Account for any extra time we got from the previous frame
            this.elapsed = diff;
            this.progress = diff / this.duration;

            if (this.flipX)
            {
                target.toggleFlipX();
            }

            if (this.flipY)
            {
                target.toggleFlipY();
            }

            this.dispatchEvent(Events.TWEEN_YOYO, 'onYoyo');

            this.start = this.getStartValue(target, key, this.start, targetIndex, totalTargets, tween);

            return TWEEN_CONST.PLAYING_BACKWARD;
        }
        else if (this.repeatCounter > 0)
        {
            //  We've hit the end of a Playing Forward TweenData and we have a Repeat.
            //  So we're going to go right back to the start to repeat it again.

            this.repeatCounter--;

            //  Account for any extra time we got from the previous frame
            this.elapsed = diff;
            this.progress = diff / this.duration;

            if (this.flipX)
            {
                target.toggleFlipX();
            }

            if (this.flipY)
            {
                target.toggleFlipY();
            }

            this.start = this.getStartValue(target, key, this.start, targetIndex, totalTargets, tween);

            this.end = this.getEndValue(target, key, this.start, targetIndex, totalTargets, tween);

            //  Delay?
            if (this.repeatDelay > 0)
            {
                this.elapsed = this.repeatDelay - diff;

                this.current = this.start;

                target[key] = this.current;

                return TWEEN_CONST.REPEAT_DELAY;
            }
            else
            {
                this.dispatchEvent(Events.TWEEN_REPEAT, 'onRepeat');

                return TWEEN_CONST.PLAYING_FORWARD;
            }
        }

        return TWEEN_CONST.COMPLETE;
    },

    /**
     * Internal method used as part of the playback process that checks if this
     * TweenData should repeat or has completed.
     *
     * @method Phaser.Tweens.TweenData#setStateFromStart
     * @fires Phaser.Tweens.Events#TWEEN_REPEAT
     * @since 3.60.0
     *
     * @param {number} diff - Any extra time that needs to be accounted for in the elapsed and progress values.
     *
     * @return {Phaser.Types.Tweens.TweenDataState} The new state of this TweenData.
     */
    setStateFromStart: function (diff)
    {
        var tween = this.tween;
        var totalTargets = tween.totalTargets;

        var targetIndex = this.targetIndex;
        var target = tween.targets[targetIndex];
        var key = this.key;

        if (this.repeatCounter > 0)
        {
            this.repeatCounter--;

            //  Account for any extra time we got from the previous frame
            this.elapsed = diff;
            this.progress = diff / this.duration;

            if (this.flipX)
            {
                target.toggleFlipX();
            }

            if (this.flipY)
            {
                target.toggleFlipY();
            }

            this.end = this.getEndValue(target, key, this.start, targetIndex, totalTargets, tween);

            //  Delay?
            if (this.repeatDelay > 0)
            {
                this.elapsed = this.repeatDelay - diff;

                this.current = this.start;

                target[key] = this.current;

                return TWEEN_CONST.REPEAT_DELAY;
            }
            else
            {
                this.dispatchEvent(Events.TWEEN_REPEAT, 'onRepeat');

                return TWEEN_CONST.PLAYING_FORWARD;
            }
        }

        return TWEEN_CONST.COMPLETE;
    },

    /**
     * Immediately destroys this TweenData, nulling of all its references.
     *
     * @method Phaser.Tweens.TweenData#destroy
     * @since 3.60.0
     */
    destroy: function ()
    {
        this.tween = null;
        this.getActiveValue = null;
        this.getEndValue = null;
        this.getStartValue = null;
        this.ease = null;
        this.getDelay = null;
        this.state = TWEEN_CONST.COMPLETE;
    }

});

module.exports = TweenData;
