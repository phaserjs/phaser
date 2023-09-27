/**
 * @typedef {object} Phaser.Types.Tweens.NumberTweenBuilderConfig
 * @since 3.18.0
 *
 * @property {number} [from=0] - The start number.
 * @property {number} [to=1] - The end number.
 * @property {number} [delay=0] - The number of milliseconds to delay before the counter will start.
 * @property {number} [duration=1000] - The duration of the counter in milliseconds.
 * @property {(string|function)} [ease='Power0'] - The easing equation to use for the counter.
 * @property {array} [easeParams] - Optional easing parameters.
 * @property {number} [hold=0] - The number of milliseconds to hold the counter for before yoyo'ing.
 * @property {number} [repeat=0] - The number of times to repeat the counter.
 * @property {number} [repeatDelay=0] - The number of milliseconds to pause before the counter will repeat.
 * @property {boolean} [yoyo=false] - Should the counter play forward to the end value and then backwards to the start? The reverse playback will also take `duration` milliseconds to complete.
 * @property {string|number|function|object|array} [completeDelay=0] - The time the counter will wait before the onComplete event is dispatched once it has completed, in ms.
 * @property {string|number|function|object|array} [loop=0] - The number of times the counter will repeat. (A value of 1 means the counter will play twice, as it repeated once.)
 * @property {string|number|function|object|array} [loopDelay=0] - The time the counter will pause before starting either a yoyo or returning to the start for a repeat.
 * @property {boolean} [paused=false] - Does the counter start in a paused state (true) or playing (false)?
 * @property {any} [callbackScope] - Scope (this) for the callbacks. The default scope is the counter.
 * @property {Phaser.Types.Tweens.TweenOnCompleteCallback} [onComplete] - A function to call when the counter completes.
 * @property {array} [onCompleteParams] - Additional parameters to pass to `onComplete`.
 * @property {Phaser.Types.Tweens.TweenOnLoopCallback} [onLoop] - A function to call each time the counter loops.
 * @property {array} [onLoopParams] - Additional parameters to pass to `onLoop`.
 * @property {Phaser.Types.Tweens.TweenOnRepeatCallback} [onRepeat] - A function to call each time the counter repeats.
 * @property {array} [onRepeatParams] - Additional parameters to pass to `onRepeat`.
 * @property {Phaser.Types.Tweens.TweenOnStartCallback} [onStart] - A function to call when the counter starts.
 * @property {array} [onStartParams] - Additional parameters to pass to `onStart`.
 * @property {Phaser.Types.Tweens.TweenOnStopCallback} [onStop] - A function to call when the counter is stopped.
 * @property {array} [onStopParams] - Additional parameters to pass to `onStop`.
 * @property {Phaser.Types.Tweens.TweenOnUpdateCallback} [onUpdate] - A function to call each time the counter steps.
 * @property {array} [onUpdateParams] - Additional parameters to pass to `onUpdate`.
 * @property {Phaser.Types.Tweens.TweenOnYoyoCallback} [onYoyo] - A function to call each time the counter yoyos.
 * @property {array} [onYoyoParams] - Additional parameters to pass to `onYoyo`.
 * @property {Phaser.Types.Tweens.TweenOnPauseCallback} [onPause] - A function to call when the counter is paused.
 * @property {array} [onPauseParams] - Additional parameters to pass to `onPause`.
 * @property {Phaser.Types.Tweens.TweenOnResumeCallback} [onResume] - A function to call when the counter is resumed after being paused.
 * @property {array} [onResumeParams] - Additional parameters to pass to `onResume`.
 * @property {boolean} [persist] - Will the counter be automatically destroyed on completion, or retained for future playback?
 * @property {(string|function)} [interpolation] - The interpolation function to use if the `value` given is an array of numbers.
 */
