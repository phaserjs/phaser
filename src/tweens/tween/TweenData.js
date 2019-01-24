/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2019 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

/**
 * @typedef {object} TweenDataGenConfig
 *
 * @property {function} delay - Time in ms/frames before tween will start.
 * @property {function} duration - Duration of the tween in ms/frames, excludes time for yoyo or repeats.
 * @property {function} hold - Time in ms/frames the tween will pause before running the yoyo or starting a repeat.
 * @property {function} repeat - Number of times to repeat the tween. The tween will always run once regardless, so a repeat value of '1' will play the tween twice.
 * @property {function} repeatDelay - Time in ms/frames before the repeat will start.
 */

/**
 * @typedef {object} Phaser.Tweens.TweenDataConfig
 *
 * @property {object} target - The target to tween.
 * @property {string} key - The property of the target being tweened.
 * @property {function} getEndValue - The returned value sets what the property will be at the END of the Tween.
 * @property {function} getStartValue - The returned value sets what the property will be at the START of the Tween.
 * @property {function} ease - The ease function this tween uses.
 * @property {number} [duration=0] - Duration of the tween in ms/frames, excludes time for yoyo or repeats.
 * @property {number} [totalDuration=0] - The total calculated duration of this TweenData (based on duration, repeat, delay and yoyo)
 * @property {number} [delay=0] - Time in ms/frames before tween will start.
 * @property {boolean} [yoyo=false] - Cause the tween to return back to its start value after hold has expired.
 * @property {number} [hold=0] - Time in ms/frames the tween will pause before running the yoyo or starting a repeat.
 * @property {integer} [repeat=0] - Number of times to repeat the tween. The tween will always run once regardless, so a repeat value of '1' will play the tween twice.
 * @property {number} [repeatDelay=0] - Time in ms/frames before the repeat will start.
 * @property {boolean} [flipX=false] - Automatically call toggleFlipX when the TweenData yoyos or repeats
 * @property {boolean} [flipY=false] - Automatically call toggleFlipY when the TweenData yoyos or repeats
 * @property {number} [progress=0] - Between 0 and 1 showing completion of this TweenData.
 * @property {number} [elapsed=0] - Delta counter
 * @property {integer} [repeatCounter=0] - How many repeats are left to run?
 * @property {number} [start=0] - Ease value data.
 * @property {number} [current=0] - Ease value data.
 * @property {number} [end=0] - Ease value data.
 * @property {number} [t1=0] - Time duration 1.
 * @property {number} [t2=0] - Time duration 2.
 * @property {TweenDataGenConfig} [gen] - LoadValue generation functions.
 * @property {integer} [state=0] - TWEEN_CONST.CREATED
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
 * @return {TweenDataConfig} The config object describing this TweenData.
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
