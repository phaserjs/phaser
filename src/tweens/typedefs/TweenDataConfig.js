/**
 * @typedef {object} Phaser.Types.Tweens.TweenDataConfig
 * @since 3.0.0
 *
 * @property {any} target - The target to tween.
 * @property {number} index - The target index within the Tween targets array.
 * @property {string} key - The property of the target being tweened.
 * @property {?Phaser.Types.Tweens.GetActiveCallback} getActiveValue - If not null, is invoked _immediately_ as soon as the TweenData is running, and is set on the target property.
 * @property {Phaser.Types.Tweens.GetEndCallback} getEndValue - The returned value sets what the property will be at the END of the Tween.
 * @property {Phaser.Types.Tweens.GetStartCallback} getStartValue - The returned value sets what the property will be at the START of the Tween.
 * @property {function} ease - The ease function this tween uses.
 * @property {number} [duration=0] - Duration of the tween in milliseconds, excludes time for yoyo or repeats.
 * @property {number} [totalDuration=0] - The total calculated duration of this TweenData (based on duration, repeat, delay and yoyo)
 * @property {number} [delay=0] - Time in milliseconds before tween will start.
 * @property {boolean} [yoyo=false] - Cause the tween to return back to its start value after hold has expired.
 * @property {number} [hold=0] - Time in milliseconds the tween will pause before running the yoyo or starting a repeat.
 * @property {number} [repeat=0] - Number of times to repeat the tween. The tween will always run once regardless, so a repeat value of '1' will play the tween twice.
 * @property {number} [repeatDelay=0] - Time in milliseconds before the repeat will start.
 * @property {boolean} [flipX=false] - Automatically call toggleFlipX when the TweenData yoyos or repeats
 * @property {boolean} [flipY=false] - Automatically call toggleFlipY when the TweenData yoyos or repeats
 * @property {number} [progress=0] - Between 0 and 1 showing completion of this TweenData.
 * @property {number} [elapsed=0] - Delta counter
 * @property {number} [repeatCounter=0] - How many repeats are left to run?
 * @property {number} [start=0] - The property value at the start of the ease.
 * @property {number} [current=0] - The current propety value.
 * @property {number} [previous=0] - The previous property value.
 * @property {number} [end=0] - The property value at the end of the ease.
 * @property {Phaser.Types.Tweens.TweenDataGenConfig} [gen] - LoadValue generation functions.
 * @property {Phaser.Tweens.StateType} [state=0] - TWEEN_CONST.CREATED
 */
