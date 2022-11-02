/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2022 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var BaseTweenData = require('./BaseTweenData');
var Clamp = require('../../math/Clamp');
var Class = require('../../utils/Class');
var Events = require('../events');
var TWEEN_CONST = require('./const');

/**
 * @classdesc
 * The TweenFrameData is a class that contains a single target that will change the texture frame
 * and the conclusion of the tween.
 *
 * TweenFrameData instances are typically created by the TweenBuilder automatically, when it
 * detects the prescence of a 'texture' property as the key being tweened.
 *
 * A Tween can own multiple TweenFrameData instances, but a TweenFrameData only
 * ever belongs to a single Tween.
 *
 * You should not typically create these yourself, but rather use the TweenBuilder,
 * or the `Tween.addFrame` method.
 *
 * @class TweenFrameData
 * @memberof Phaser.Tweens
 * @extends Phaser.Tweens.BaseTweenData
 * @constructor
 * @since 3.60.0
 *
 * @param {Phaser.Tweens.Tween} tween - The tween this TweenData instance belongs to.
 * @param {number} targetIndex - The target index within the Tween targets array.
 * @param {string} texture - The texture key to set at the end of this tween.
 * @param {(string|number)} frame - The texture frame to set at the end of this tween.
 * @param {function} delay - Function that returns the time in ms/frames before tween will start.
 * @param {number} duration - The duration of the tween in ms/frames.
 * @param {number} hold - Function that returns the time in ms/frames the tween will pause before repeating or returning to its starting value if yoyo is set to true.
 * @param {number} repeat - Function that returns the number of times to repeat the tween. The tween will always run once regardless, so a repeat value of '1' will play the tween twice.
 * @param {number} repeatDelay - Function that returns the time in ms/frames before the repeat will start.
 * @param {boolean} flipX - Should toggleFlipX be called when yoyo or repeat happens?
 * @param {boolean} flipY - Should toggleFlipY be called when yoyo or repeat happens?
 */
var TweenFrameData = new Class({

    Extends: BaseTweenData,

    initialize:

    function TweenFrameData (tween, targetIndex, texture, frame, delay, duration, hold, repeat, repeatDelay, flipX, flipY)
    {
        BaseTweenData.call(this, tween, targetIndex, delay, duration, false, hold, repeat, repeatDelay, flipX, flipY);

        /**
         * The texture to be set at the start of the tween.
         *
         * @name Phaser.Tweens.TweenFrameData#startTexture
         * @type {string}
         * @since 3.60.0
         */
        this.startTexture = null;

        /**
         * The texture to be set at the end of the tween.
         *
         * @name Phaser.Tweens.TweenFrameData#endTexture
         * @type {string}
         * @since 3.60.0
         */
        this.endTexture = texture;

        /**
         * The frame to be set at the start of the tween.
         *
         * @name Phaser.Tweens.TweenFrameData#startFrame
         * @type {(string|number)}
         * @since 3.60.0
         */
        this.startFrame = null;

        /**
         * The frame to be set at the end of the tween.
         *
         * @name Phaser.Tweens.TweenFrameData#endFrame
         * @type {(string|number)}
         * @since 3.60.0
         */
        this.endFrame = frame;

        /**
         * Will the Tween ease back to its starting values, after reaching the end
         * and any `hold` value that may be set?
         *
         * @name Phaser.Tweens.TweenFrameData#yoyo
         * @type {boolean}
         * @since 3.60.0
         */
        this.yoyo = (repeat > 0) ? true : false;
    },

    /**
     * Prepares this TweenData for playback.
     *
     * Called automatically by the parent Tween. Should not be called directly.
     *
     * @method Phaser.Tweens.TweenFrameData#init
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

        //  Function signature: target, key, value, index, total, tween

        this.delay = this.getDelay(target, 'texture', 0, targetIndex, totalTargets, tween);

        this.repeatCounter = (this.repeat === -1) ? TWEEN_CONST.MAX : this.repeat;

        this.setPendingRenderState();

        //  calcDuration:

        //  Set t1 (duration + hold + yoyo)
        var t1 = this.duration + this.hold;

        if (this.yoyo)
        {
            t1 += this.duration;
        }

        //  Set t2 (repeatDelay + duration + hold + yoyo)
        var t2 = t1 + this.repeatDelay;

        //  Total Duration
        this.totalDuration = this.delay + t1;

        if (this.repeat === -1)
        {
            this.totalDuration += (t2 * TWEEN_CONST.MAX);
        }
        else if (this.repeat > 0)
        {
            this.totalDuration += (t2 * this.repeat);
        }

        if (this.totalDuration > tween.duration)
        {
            //  Set the longest duration in the parent Tween
            tween.duration = this.totalDuration;
        }

        if (this.delay < tween.startDelay)
        {
            tween.startDelay = this.delay;
        }

        if (!this.startTexture)
        {
            this.startTexture = target.texture.key;
            this.startFrame = target.frame.name;
        }

        //  seek specific:
        if (isSeek)
        {
            this.progress = 0;
            this.elapsed = 0;

            this.setPlayingForwardState();

            this.update(0);
        }

        if (this.delay > 0)
        {
            this.elapsed = this.delay;

            this.setDelayState();
        }
    },

    /**
     * Internal method that advances this TweenData based on the delta value given.
     *
     * @method Phaser.Tweens.TweenFrameData#update
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
        var targetIndex = this.targetIndex;
        var target = tween.targets[targetIndex];

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
            if (this.startTexture)
            {
                target.setTexture(this.startTexture, this.startFrame);
            }

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

            var progress = Clamp(elapsed / duration, 0, 1);

            this.elapsed = elapsed;
            this.progress = progress;

            if (complete)
            {
                if (forward)
                {
                    target.setTexture(this.endTexture, this.endFrame);

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
                    target.setTexture(this.startTexture, this.startFrame);

                    this.setStateFromStart(diff);
                }
            }

            this.dispatchEvent(Events.TWEEN_UPDATE, 'onUpdate');
        }

        //  Return TRUE if this TweenData still playing, otherwise FALSE
        return !this.isComplete();
    },

    /**
     * Internal method that resets this Tween Data, including the progress and elapsed values.
     *
     * @method Phaser.Tweens.TweenFrameData#reset
     * @since 3.60.0
     *
     * @param {boolean} resetFromLoop - Has this method been called as part of a loop?
    reset: function (resetFromLoop)
    {
        this.progress = 0;
        this.elapsed = 0;

        this.repeatCounter = (this.repeat === -1) ? TWEEN_CONST.MAX : this.repeat;

        if (resetFromLoop)
        {
            this.setPlayingForwardState();
        }
        else
        {
            this.setPendingRenderState();
        }

        if (this.delay > 0)
        {
            this.elapsed = this.delay;

            this.setDelayState();
        }
    },
     */

    /**
     * Internal method that will emit a TweenData based Event on the
     * parent Tween and also invoke the given callback, if provided.
     *
     * @method Phaser.Tweens.TweenFrameData#dispatchEvent
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

            tween.emit(event, tween, 'texture', target);

            var handler = tween.callbacks[callback];

            if (handler)
            {
                handler.func.apply(tween.callbackScope, [ tween, target, 'texture' ].concat(handler.params));
            }
        }
    },

    /**
     * Internal method used as part of the playback process that checks if this
     * TweenData should yoyo, repeat, or has completed.
     *
     * @method Phaser.Tweens.TweenFrameData#setStateFromEnd
     * @fires Phaser.Tweens.Events#TWEEN_REPEAT
     * @fires Phaser.Tweens.Events#TWEEN_YOYO
     * @since 3.60.0
     *
     * @param {number} diff - Any extra time that needs to be accounted for in the elapsed and progress values.
     */
    setStateFromEnd: function (diff)
    {
        if (this.yoyo)
        {
            this.onRepeat(diff, true, true);
        }
        else if (this.repeatCounter > 0)
        {
            this.onRepeat(diff, true);
        }
        else
        {
            this.setCompleteState();
        }
    },

    /**
     * Internal method used as part of the playback process that checks if this
     * TweenData should repeat or has completed.
     *
     * @method Phaser.Tweens.TweenFrameData#setStateFromStart
     * @fires Phaser.Tweens.Events#TWEEN_REPEAT
     * @since 3.60.0
     *
     * @param {number} diff - Any extra time that needs to be accounted for in the elapsed and progress values.
     */
    setStateFromStart: function (diff)
    {
        if (this.repeatCounter > 0)
        {
            this.onRepeat(diff, false);
        }
        else
        {
            this.setCompleteState();
        }
    },

    /**
     * Internal method that handles repeating or yoyo'ing this TweenData.
     *
     * Called automatically by `setStateFromStart` and `setStateFromEnd`.
     *
     * @method Phaser.Tweens.TweenFrameData#onRepeat
     * @fires Phaser.Tweens.Events#TWEEN_REPEAT
     * @fires Phaser.Tweens.Events#TWEEN_YOYO
     * @since 3.60.0
     *
     * @param {number} diff - Any extra time that needs to be accounted for in the elapsed and progress values.
     * @param {boolean} [isYoyo=false] - Is this call a Yoyo check?
     */
    onRepeat: function (diff, isYoyo)
    {
        if (isYoyo === undefined) { isYoyo = false; }

        var tween = this.tween;

        var targetIndex = this.targetIndex;
        var target = tween.targets[targetIndex];

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

        if (isYoyo)
        {
            this.setPlayingBackwardState();

            this.dispatchEvent(Events.TWEEN_YOYO, 'onYoyo');

            return;
        }

        this.repeatCounter--;

        //  Delay?
        if (this.repeatDelay > 0)
        {
            this.elapsed = this.repeatDelay - diff;

            this.setRepeatState();
        }
        else
        {
            this.setPlayingForwardState();

            this.dispatchEvent(Events.TWEEN_REPEAT, 'onRepeat');
        }
    }

});

module.exports = TweenFrameData;
