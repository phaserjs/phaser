/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var BaseTweenData = require('./BaseTweenData');
var Clamp = require('../../math/Clamp');
var Class = require('../../utils/Class');
var Events = require('../events');

/**
 * @classdesc
 * The TweenData is a class that contains a single target and property that is being tweened.
 *
 * Tweens create TweenData instances when they are created, with one TweenData instance per
 * target, per property. A Tween can own multiple TweenData instances, but a TweenData only
 * ever belongs to a single Tween.
 *
 * You should not typically create these yourself, but rather use the TweenBuilder,
 * or the `Tween.add` method.
 *
 * Prior to Phaser 3.60 the TweenData was just an object, but was refactored to a class,
 * to make it responsible for its own state and updating.
 *
 * @class TweenData
 * @memberof Phaser.Tweens
 * @extends Phaser.Tweens.BaseTweenData
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
 */
var TweenData = new Class({

    Extends: BaseTweenData,

    initialize:

    function TweenData (tween, targetIndex, key, getEnd, getStart, getActive, ease, delay, duration, yoyo, hold, repeat, repeatDelay, flipX, flipY, interpolation, interpolationData)
    {
        BaseTweenData.call(this, tween, targetIndex, delay, duration, yoyo, hold, repeat, repeatDelay, flipX, flipY);

        /**
         * The property of the target to be tweened.
         *
         * @name Phaser.Tweens.TweenData#key
         * @type {string}
         * @readonly
         * @since 3.60.0
         */
        this.key = key;

        /**
         * A function that returns what to set the target property to,
         * the moment the TweenData is invoked.
         *
         * This is called when this TweenData is initialised or reset.
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
         * The targets starting value, as returned by `getStartValue`.
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
         * The targets current value, as recorded in the most recent step.
         *
         * @name Phaser.Tweens.TweenData#current
         * @type {number}
         * @since 3.60.0
         */
        this.current = 0;

        /**
         * The targets ending value, as returned by `getEndValue`.
         *
         * @name Phaser.Tweens.TweenData#end
         * @type {number}
         * @since 3.60.0
         */
        this.end = 0;

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
     * Internal method that resets this Tween Data entirely, including the progress and elapsed values.
     *
     * Called automatically by the parent Tween. Should not be called directly.
     *
     * @method Phaser.Tweens.TweenData#reset
     * @since 3.60.0
     *
     * @param {boolean} [isSeeking=false] - Is the Tween Data being reset as part of a Tween seek?
     */
    reset: function (isSeeking)
    {
        BaseTweenData.prototype.reset.call(this);

        var target = this.tween.targets[this.targetIndex];
        var key = this.key;

        if (isSeeking)
        {
            target[key] = this.start;
        }

        this.start = 0;
        this.previous = 0;
        this.current = 0;
        this.end = 0;

        if (this.getActiveValue)
        {
            target[key] = this.getActiveValue(target, key, 0);
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

        //  Bail out if we don't have a target to act upon
        if (!target)
        {
            this.setCompleteState();

            return false;
        }

        if (this.isCountdown)
        {
            this.elapsed -= delta;

            if (this.elapsed <= 0)
            {
                this.elapsed = 0;

                delta = 0;

                if (this.isDelayed())
                {
                    this.setPendingRenderState();
                }
                else if (this.isRepeating())
                {
                    this.setPlayingForwardState();

                    this.dispatchEvent(Events.TWEEN_REPEAT, 'onRepeat');
                }
                else if (this.isHolding())
                {
                    this.setStateFromEnd(0);
                }
            }
        }

        //  All of the above have the ability to change the state, so put this in its own check

        if (this.isPendingRender())
        {
            this.start = this.getStartValue(target, key, target[key], targetIndex, totalTargets, tween);

            this.end = this.getEndValue(target, key, this.start, targetIndex, totalTargets, tween);

            this.current = this.start;

            target[key] = this.start;

            this.setPlayingForwardState();

            return true;
        }

        var forward = this.isPlayingForward();
        var backward = this.isPlayingBackward();

        if (forward || backward)
        {
            var elapsed = this.elapsed;
            var duration = this.duration;
            var diff = 0;
            var complete = false;

            elapsed += delta;

            if (elapsed >= duration)
            {
                diff = elapsed - duration;
                elapsed = duration;
                complete = true;
            }
            else if (elapsed < 0)
            {
                elapsed = 0;
            }

            var progress = Clamp(elapsed / duration, 0, 1);

            this.elapsed = elapsed;
            this.progress = progress;
            this.previous = this.current;

            if (!forward)
            {
                progress = 1 - progress;
            }

            var v = this.ease(progress);

            if (this.interpolation)
            {
                this.current = this.interpolation(this.interpolationData, v);
            }
            else
            {
                this.current = this.start + ((this.end - this.start) * v);
            }

            target[key] = this.current;

            if (complete)
            {
                if (forward)
                {
                    if (tween.isNumberTween)
                    {
                        this.current = this.end;
                        target[key] = this.current;
                    }

                    if (this.hold > 0)
                    {
                        this.elapsed = this.hold;

                        this.setHoldState();
                    }
                    else
                    {
                        this.setStateFromEnd(diff);
                    }
                }
                else
                {
                    if (tween.isNumberTween)
                    {
                        this.current = this.start;
                        target[key] = this.current;
                    }

                    this.setStateFromStart(diff);
                }
            }

            this.dispatchEvent(Events.TWEEN_UPDATE, 'onUpdate');
        }

        //  Return TRUE if this TweenData still playing, otherwise FALSE
        return !this.isComplete();
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
            var previous = this.previous;

            tween.emit(event, tween, key, target, current, previous);

            var handler = tween.callbacks[callback];

            if (handler)
            {
                handler.func.apply(tween.callbackScope, [ tween, target, key, current, previous ].concat(handler.params));
            }
        }
    },

    /**
     * Immediately destroys this TweenData, nulling of all its references.
     *
     * @method Phaser.Tweens.TweenData#destroy
     * @since 3.60.0
     */
    destroy: function ()
    {
        BaseTweenData.prototype.destroy.call(this);

        this.getActiveValue = null;
        this.getEndValue = null;
        this.getStartValue = null;
        this.ease = null;
    }

});

module.exports = TweenData;
