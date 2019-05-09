/**
 * @typedef {object} Phaser.Types.Tweens.TweenDataConfig
 * @since 3.0.0
 *
 * @property {any} target - The target to tween.
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
 * @property {Phaser.Types.Tweens.TweenDataGenConfig} [gen] - LoadValue generation functions.
 * @property {integer} [state=0] - TWEEN_CONST.CREATED
 */
