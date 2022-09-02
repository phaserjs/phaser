/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2022 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Class = require('../../utils/Class');
var Events = require('../events');
var TWEEN_CONST = require('./const');

/**
 * Returns a TweenDataConfig object that describes the tween data for a unique property of a unique target.
 * A single Tween consists of multiple TweenDatas, depending on how many properties are being changed by the Tween.
 *
 * This is an internal function used by the TweenBuilder and should not be accessed directly, instead,
 * Tweens should be created using the GameObjectFactory or GameObjectCreator.
 *
 * @class TweenData
 * @memberof Phaser.Tweens
 * @constructor
 * @since 3.60.0
 *
 * @param {Phaser.Tweens.Tween} tween - The tween this TweenData instance belongs to.
 * @param {number} targetIndex - The target index within the Tween targets array.
 * @param {string} key - The property of the target to tween.
 * @param {function} getEnd - What the property will be at the END of the Tween.
 * @param {function} getStart - What the property will be at the START of the Tween.
 * @param {?function} getActive - If not null, is invoked _immediately_ as soon as the TweenData is running, and is set on the target property.
 * @param {function} ease - The ease function this tween uses.
 * @param {function} delay - Function that returns the time in ms/frames before tween will start.
 * @param {function} duration - Function that returns the duration of the tween in ms/frames.
 * @param {boolean} yoyo - Determines whether the tween should return back to its start value after hold has expired.
 * @param {function} hold - Function that returns the time in ms/frames the tween will pause before repeating or returning to its starting value if yoyo is set to true.
 * @param {function} repeat - Function that returns the number of times to repeat the tween. The tween will always run once regardless, so a repeat value of '1' will play the tween twice.
 * @param {function} repeatDelay - Function that returns the time in ms/frames before the repeat will start.
 * @param {boolean} flipX - Should toggleFlipX be called when yoyo or repeat happens?
 * @param {boolean} flipY - Should toggleFlipY be called when yoyo or repeat happens?
 * @param {?function} interpolation - The interpolation function to be used for arrays of data. Defaults to 'null'.
 * @param {number[]} interpolationData - The array of interpolation data to be set. Defaults to 'null'.
 */
var TweenData = new Class({

    initialize:

    function TweenData (tween, targetIndex, key, getEnd, getStart, getActive, ease, delay, duration, yoyo, hold, repeat, repeatDelay, flipX, flipY, interpolation, interpolationData)
    {
        this.tween = tween;

        //  The index of the target within the tween targets array
        this.targetIndex = targetIndex;

        //  The property of the target to tween
        this.key = key;

        //  What to set the property to the moment the TweenData is invoked.
        this.getActiveValue = getActive;

        //  The returned value sets what the property will be at the END of the Tween.
        this.getEndValue = getEnd;

        //  The returned value sets what the property will be at the START of the Tween.
        this.getStartValue = getStart;

        //  The ease function this tween uses.
        this.ease = ease;

        //  Duration of the tween in ms/frames, excludes time for yoyo or repeats.
        this.duration = 0;

        //  The total calculated duration of this TweenData (based on duration, repeat, delay and yoyo)
        this.totalDuration = 0;

        //  Time in ms/frames before tween will start.
        this.delay = 0;

        //  Cause the tween to return back to its start value after hold has expired.
        this.yoyo = yoyo;

        //  Time in ms/frames the tween will pause before running the yoyo or starting a repeat.
        this.hold = 0;

        //  Number of times to repeat the tween. The tween will always run once regardless, so a repeat value of '1' will play the tween twice.
        this.repeat = 0;

        //  Time in ms/frames before the repeat will start.
        this.repeatDelay = 0;

        //  Automatically call toggleFlipX when the TweenData yoyos or repeats
        this.flipX = flipX;

        //  Automatically call toggleFlipY when the TweenData yoyos or repeats
        this.flipY = flipY;

        //  Between 0 and 1 showing completion of this TweenData.
        this.progress = 0;

        //  Delta counter.
        this.elapsed = 0;

        //  How many repeats are left to run?
        this.repeatCounter = 0;

        //  Ease Value Data:

        this.start = 0;
        this.previous = 0;
        this.current = 0;
        this.end = 0;

        //  Time Durations
        this.t1 = 0;
        this.t2 = 0;

        //  LoadValue generation functions
        this.gen = {
            delay: delay,
            duration: duration,
            hold: hold,
            repeat: repeat,
            repeatDelay: repeatDelay
        };

        //  TWEEN_CONST.CREATED
        this.state = 0;

        //  The interpolation function to be used for arrays of data. Defaults to null.
        this.interpolation = interpolation;

        //  The array of data to interpolate
        this.interpolationData = (interpolation) ? interpolationData : null;
    },

    init: function (isSeek)
    {
        var tween = this.tween;
        var totalTargets = tween.totalTargets;

        var targetIndex = this.targetIndex;
        var target = tween.targets[targetIndex];
        var key = this.key;

        var gen = this.gen;

        //  Function signature: target, key, value, index, total, tween

        this.delay = gen.delay(target, key, 0, targetIndex, totalTargets, tween);
        this.duration = Math.max(gen.duration(target, key, 0, targetIndex, totalTargets, tween), 0.001);
        this.hold = gen.hold(target, key, 0, targetIndex, totalTargets, tween);
        this.repeat = gen.repeat(target, key, 0, targetIndex, totalTargets, tween);
        this.repeatDelay = gen.repeatDelay(target, key, 0, targetIndex, totalTargets, tween);
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

        // if (this.totalDuration > tween.duration)
        if (this.t1 > tween.duration)
        {
            //  Get the longest TweenData from the Tween, used to calculate the Tween TD
            tween.duration = this.totalDuration;

            // tween.duration = this.t1;
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
     * Internal method that advances a TweenData based on the time value given.
     *
     * @method Phaser.Tweens.Tween#update
     * @fires Phaser.Tweens.Events#TWEEN_UPDATE
     * @fires Phaser.Tweens.Events#TWEEN_REPEAT
     * @since 3.0.0
     *
     * @param {number} delta - The elapsed delta time in ms.
     *
     * @return {boolean} True if the Tween Data is still playing, or false if it has finished entirely.
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

                this.dispatchTweenDataEvent(Events.TWEEN_REPEAT, 'onRepeat', this);
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

            this.dispatchTweenDataEvent(Events.TWEEN_UPDATE, 'onUpdate', this);
        }

        //  Return TRUE if this TweenData still playing, otherwise FALSE
        return (this.state !== TWEEN_CONST.COMPLETE);
    },

    /**
     * Internal method that resets all of the Tween Data, including the progress and elapsed values.
     *
     * @method Phaser.Tweens.Tween#reset
     * @since 3.0.0
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
     * Internal method that will emit a TweenData based Event and invoke the given callback.
     *
     * @method Phaser.Tweens.Tween#dispatchTweenDataEvent
     * @since 3.19.0
     *
     * @param {Phaser.Types.Tweens.Event} event - The Event to be dispatched.
     * @param {string} [callback] - The callback to be invoked. Can be `null` or `undefined` to skip invocation.
     */
    dispatchTweenDataEvent: function (event, callback)
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
     * Internal method used as part of the playback process that sets a tween to play in reverse.
     *
     * @method Phaser.Tweens.Tween#setStateFromEnd
     * @fires Phaser.Tweens.Events#TWEEN_REPEAT
     * @fires Phaser.Tweens.Events#TWEEN_YOYO
     * @since 3.0.0
     *
     * @param {Phaser.Types.Tweens.TweenDataConfig} tweenData - The TweenData object to update.
     * @param {number} diff - Any extra time that needs to be accounted for in the elapsed and progress values.
     *
     * @return {number} The state of this Tween.
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

            this.dispatchTweenDataEvent(Events.TWEEN_YOYO, 'onYoyo');

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
                this.dispatchTweenDataEvent(Events.TWEEN_REPEAT, 'onRepeat');

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
     * @param {Phaser.Types.Tweens.TweenDataConfig} tweenData - The TweenData object to update.
     * @param {number} diff - Any extra time that needs to be accounted for in the elapsed and progress values.
     *
     * @return {number} The state of this Tween.
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
                this.dispatchTweenDataEvent(Events.TWEEN_REPEAT, 'onRepeat');

                return TWEEN_CONST.PLAYING_FORWARD;
            }
        }

        return TWEEN_CONST.COMPLETE;
    },

    destroy: function ()
    {
        this.tween = null;
        this.getActiveValue = null;
        this.getEndValue = null;
        this.getStartValue = null;
        this.ease = null;
        this.gen = null;
    }

});

module.exports = TweenData;
