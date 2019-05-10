/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2019 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * Returns a TweenDataConfig object that describes the tween data for a unique property of a unique target. A single Tween consists of multiple TweenDatas, depending on how many properties are being changed by the Tween.
 *
 * This is an internal function used by the TweenBuilder and should not be accessed directly, instead, Tweens should be created using the GameObjectFactory or GameObjectCreator.
 *
 * @function Phaser.Tweens.TweenData
 * @since 3.0.0
 *
 * @param {object} target - The target to tween.
 * @param {string} key - The property of the target to tween.
 * @param {function} getEnd - What the property will be at the END of the Tween.
 * @param {function} getStart - What the property will be at the START of the Tween.
 * @param {function} ease - The ease function this tween uses.
 * @param {number} delay - Time in ms/frames before tween will start.
 * @param {number} duration - Duration of the tween in ms/frames.
 * @param {boolean} yoyo - Determines whether the tween should return back to its start value after hold has expired.
 * @param {number} hold - Time in ms/frames the tween will pause before repeating or returning to its starting value if yoyo is set to true.
 * @param {number} repeat - Number of times to repeat the tween. The tween will always run once regardless, so a repeat value of '1' will play the tween twice.
 * @param {number} repeatDelay - Time in ms/frames before the repeat will start.
 * @param {boolean} flipX - Should toggleFlipX be called when yoyo or repeat happens?
 * @param {boolean} flipY - Should toggleFlipY be called when yoyo or repeat happens?
 *
 * @return {Phaser.Types.Tweens.TweenDataConfig} The config object describing this TweenData.
 */
var TweenData = function (target, key, getEnd, getStart, ease, delay, duration, yoyo, hold, repeat, repeatDelay, flipX, flipY)
{
    return {

        //  The target to tween
        target: target,

        //  The property of the target to tween
        key: key,

        //  The returned value sets what the property will be at the END of the Tween.
        getEndValue: getEnd,

        //  The returned value sets what the property will be at the START of the Tween.
        getStartValue: getStart,

        //  The ease function this tween uses.
        ease: ease,

        //  Duration of the tween in ms/frames, excludes time for yoyo or repeats.
        duration: 0,

        //  The total calculated duration of this TweenData (based on duration, repeat, delay and yoyo)
        totalDuration: 0,

        //  Time in ms/frames before tween will start.
        delay: 0,

        //  Cause the tween to return back to its start value after hold has expired.
        yoyo: yoyo,

        //  Time in ms/frames the tween will pause before running the yoyo or starting a repeat.
        hold: 0,

        //  Number of times to repeat the tween. The tween will always run once regardless, so a repeat value of '1' will play the tween twice.
        repeat: 0,

        //  Time in ms/frames before the repeat will start.
        repeatDelay: 0,

        //  Automatically call toggleFlipX when the TweenData yoyos or repeats
        flipX: flipX,

        //  Automatically call toggleFlipY when the TweenData yoyos or repeats
        flipY: flipY,

        //  Between 0 and 1 showing completion of this TweenData.
        progress: 0,

        //  Delta counter.
        elapsed: 0,

        //  How many repeats are left to run?
        repeatCounter: 0,

        //  Ease Value Data:

        start: 0,
        current: 0,
        end: 0,

        //  Time Durations
        t1: 0,
        t2: 0,

        //  LoadValue generation functions
        gen: {
            delay: delay,
            duration: duration,
            hold: hold,
            repeat: repeat,
            repeatDelay: repeatDelay
        },

        //  TWEEN_CONST.CREATED
        state: 0
    };
};

module.exports = TweenData;
