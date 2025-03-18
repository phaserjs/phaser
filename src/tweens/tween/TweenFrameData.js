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
 * The TweenFrameData is a class that contains a single target that will change the texture frame
 * at the conclusion of the Tween.
 *
 * TweenFrameData instances are typically created by the TweenBuilder automatically, when it
 * detects the presence of a 'texture' property as the key being tweened.
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
 * @param {function} delay - Function that returns the time in milliseconds before tween will start.
 * @param {number} duration - The duration of the tween in milliseconds.
 * @param {number} hold - Function that returns the time in milliseconds the tween will pause before repeating or returning to its starting value if yoyo is set to true.
 * @param {number} repeat - Function that returns the number of times to repeat the tween. The tween will always run once regardless, so a repeat value of '1' will play the tween twice.
 * @param {number} repeatDelay - Function that returns the time in milliseconds before the repeat will start.
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
         * The property of the target to be tweened.
         *
         * Always 'texture' for a TweenFrameData object.
         *
         * @name Phaser.Tweens.TweenFrameData#key
         * @type {string}
         * @readonly
         * @since 3.60.0
         */
        this.key = 'texture';

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
        this.yoyo = (repeat !== 0) ? true : false;
    },

    /**
     * Internal method that resets this Tween Data entirely, including the progress and elapsed values.
     *
     * Called automatically by the parent Tween. Should not be called directly.
     *
     * @method Phaser.Tweens.TweenFrameData#reset
     * @since 3.60.0
     *
     * @param {boolean} [isSeeking=false] - Is the Tween Data being reset as part of a Tween seek?
     */
    reset: function (isSeeking)
    {
        BaseTweenData.prototype.reset.call(this);

        var target = this.tween.targets[this.targetIndex];

        if (!this.startTexture)
        {
            this.startTexture = target.texture.key;
            this.startFrame = target.frame.name;
        }

        if (isSeeking)
        {
            target.setTexture(this.startTexture, this.startFrame);
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
            else if (elapsed < 0)
            {
                elapsed = 0;
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
            var key = this.key;

            tween.emit(event, tween, key, target);

            var handler = tween.callbacks[callback];

            if (handler)
            {
                handler.func.apply(tween.callbackScope, [ tween, target, key ].concat(handler.params));
            }
        }
    },

    /**
     * Immediately destroys this TweenData, nulling of all its references.
     *
     * @method Phaser.Tweens.TweenFrameData#destroy
     * @since 3.60.0
     */
    destroy: function ()
    {
        BaseTweenData.prototype.destroy.call(this);

        this.startTexture = null;
        this.endTexture = null;
        this.startFrame = null;
        this.endFrame = null;
    }

});

module.exports = TweenFrameData;
