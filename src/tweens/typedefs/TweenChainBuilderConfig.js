/**
 * @typedef {object} Phaser.Types.Tweens.TweenChainBuilderConfig
 * @extends object
 * @since 3.60.0
 *
 * @property {any} targets - The object, or an array of objects, to run the tween on.
 * @property {(number|function)} [delay=0] - The number of milliseconds to delay before the tween will start.
 * @property {number} [hold=0] - The number of milliseconds to hold the tween for before yoyo'ing.
 * @property {number} [repeat=0] - The number of times each property tween repeats.
 * @property {number} [repeatDelay=0] - The number of milliseconds to pause before a repeat.
 * @property {string|number|function|object|array} [completeDelay=0] - The time the tween will wait before the onComplete event is dispatched once it has completed, in ms.
 * @property {string|number|function|object|array} [loop=0] - The number of times the tween will repeat. (A value of 1 means the tween will play twice, as it repeated once.) The first loop starts after every property in the tween has completed once.
 * @property {string|number|function|object|array} [loopDelay=0] - The time the tween will pause before starting either a yoyo or returning to the start for a repeat.
 * @property {boolean} [paused=false] - Does the tween start in a paused state (true) or playing (false)?
 * @property {Phaser.Types.Tweens.TweenBuilderConfig[]} [tweens] - The tweens to chain together.
 * @property {any} [callbackScope] - The scope (or context) for all of the callbacks. The default scope is the tween.
 * @property {Phaser.Types.Tweens.TweenOnCompleteCallback} [onComplete] - A function to call when the tween completes.
 * @property {array} [onCompleteParams] - Additional parameters to pass to `onComplete`.
 * @property {Phaser.Types.Tweens.TweenOnLoopCallback} [onLoop] - A function to call each time the tween loops.
 * @property {array} [onLoopParams] - Additional parameters to pass to `onLoop`.
 * @property {Phaser.Types.Tweens.TweenOnRepeatCallback} [onRepeat] - A function to call each time the tween repeats. Called once per property per target.
 * @property {array} [onRepeatParams] - Additional parameters to pass to `onRepeat`.
 * @property {Phaser.Types.Tweens.TweenOnStartCallback} [onStart] - A function to call when the tween starts playback, after any delays have expired.
 * @property {array} [onStartParams] - Additional parameters to pass to `onStart`.
 * @property {Phaser.Types.Tweens.TweenOnStopCallback} [onStop] - A function to call when the tween is stopped.
 * @property {array} [onStopParams] - Additional parameters to pass to `onStop`.
 * @property {Phaser.Types.Tweens.TweenOnUpdateCallback} [onUpdate] - A function to call each time the tween steps. Called once per property per target.
 * @property {array} [onUpdateParams] - Additional parameters to pass to `onUpdate`.
 * @property {Phaser.Types.Tweens.TweenOnYoyoCallback} [onYoyo] - A function to call each time the tween yoyos. Called once per property per target.
 * @property {array} [onYoyoParams] - Additional parameters to pass to `onYoyo`.
 * @property {Phaser.Types.Tweens.TweenOnActiveCallback} [onActive] - A function to call when the tween becomes active within the Tween Manager.
 * @property {array} [onActiveParams] - Additional parameters to pass to `onActive`.
 * @property {Phaser.Types.Tweens.TweenOnPauseCallback} [onPause] - A function to call when the tween is paused.
 * @property {array} [onPauseParams] - Additional parameters to pass to `onPause`.
 * @property {Phaser.Types.Tweens.TweenOnResumeCallback} [onResume] - A function to call when the tween is resumed after being paused.
 * @property {array} [onResumeParams] - Additional parameters to pass to `onResume`.
 * @property {boolean} [persist] - Will the Tween be automatically destroyed on completion, or retained for future playback?
 */
