/**
 * @typedef {object} Phaser.Types.Tweens.NumberTweenBuilderConfig
 * @since 3.18.0
 *
 * @property {number} [from=0] - The start number.
 * @property {number} [to=1] - The end number.
 * @property {number} [delay=0] - The number of milliseconds to delay before the tween will start.
 * @property {number} [duration=1000] - The duration of the tween in milliseconds.
 * @property {(string|function)} [ease='Power0'] - The easing equation to use for the tween.
 * @property {array} [easeParams] - Optional easing parameters.
 * @property {number} [hold=0] - The number of milliseconds to hold the tween for before yoyo'ing.
 * @property {number} [repeat=0] - The number of times to repeat the tween.
 * @property {number} [repeatDelay=0] - The number of milliseconds to pause before a tween will repeat.
 * @property {boolean} [yoyo=false] - Should the tween complete, then reverse the values incrementally to get back to the starting tween values? The reverse tweening will also take `duration` milliseconds to complete.
 * @property {string|number|function|object|array} [completeDelay=0] - The time the tween will wait before the onComplete event is dispatched once it has completed, in ms.
 * @property {string|number|function|object|array} [loop=0] - The number of times the tween will repeat. (A value of 1 means the tween will play twice, as it repeated once.) The first loop starts after every property tween has completed once.
 * @property {string|number|function|object|array} [loopDelay=0] - The time the tween will pause before starting either a yoyo or returning to the start for a repeat.
 * @property {boolean} [paused=false] - Does the tween start in a paused state (true) or playing (false)?
 * @property {any} [callbackScope] - Scope (this) for the callbacks. The default scope is the tween.
 * @property {Phaser.Types.Tweens.TweenOnCompleteCallback} [onComplete] - A function to call when the tween completes.
 * @property {array} [onCompleteParams] - Additional parameters to pass to `onComplete`.
 * @property {any} [onCompleteScope] - Scope (this) for `onComplete`.
 * @property {Phaser.Types.Tweens.TweenOnLoopCallback} [onLoop] - A function to call each time the tween loops.
 * @property {array} [onLoopParams] - Additional parameters to pass to `onLoop`.
 * @property {any} [onLoopScope] - Scope (this) for `onLoop`.
 * @property {Phaser.Types.Tweens.TweenOnRepeatCallback} [onRepeat] - A function to call each time the tween repeats. Called once per property per target.
 * @property {array} [onRepeatParams] - Additional parameters to pass to `onRepeat`.
 * @property {any} [onRepeatScope] - Scope (this) for `onRepeat`.
 * @property {Phaser.Types.Tweens.TweenOnStartCallback} [onStart] - A function to call when the tween starts.
 * @property {array} [onStartParams] - Additional parameters to pass to `onStart`.
 * @property {any} [onStartScope] - Scope (this) for `onStart`.
 * @property {Phaser.Types.Tweens.TweenOnStopCallback} [onStop] - A function to call when the tween is stopped.
 * @property {array} [onStopParams] - Additional parameters to pass to `onStop`.
 * @property {any} [onStopScope] - Scope (this) for `onStop`.
 * @property {Phaser.Types.Tweens.TweenOnUpdateCallback} [onUpdate] - A function to call each time the tween steps. Called once per property per target.
 * @property {array} [onUpdateParams] - Additional parameters to pass to `onUpdate`.
 * @property {any} [onUpdateScope] - Scope (this) for `onUpdate`.
 * @property {Phaser.Types.Tweens.TweenOnYoyoCallback} [onYoyo] - A function to call each time the tween yoyos. Called once per property per target.
 * @property {array} [onYoyoParams] - Additional parameters to pass to `onYoyo`.
 * @property {any} [onYoyoScope] - Scope (this) for `onYoyo`.
 * @property {Phaser.Types.Tweens.TweenOnPauseCallback} [onPause] - A function to call when the tween is paused.
 * @property {array} [onPauseParams] - Additional parameters to pass to `onPause`.
 * @property {any} [onPauseScope] - Scope (this) for `onPause`.
 * @property {Phaser.Types.Tweens.TweenOnResumeCallback} [onResume] - A function to call when the tween is resumed after being paused.
 * @property {array} [onResumeParams] - Additional parameters to pass to `onResume`.
 * @property {any} [onResumeScope] - Scope (this) for `onResume`.
 * @property {boolean} [persist] - Will the Tween be automatically destroyed on completion, or retained for future playback?
 * @property {(string|function)} [interpolation] - The interpolation function to use if the `value` given is an array of numbers.
 */
