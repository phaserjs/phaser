/**
 * @typedef {object} Phaser.Types.Tweens.TweenChainBuilderConfig
 * @extends object
 * @since 3.60.0
 *
 * @property {any} targets - The object, or an array of objects, to run each tween on.
 * @property {(number|function)} [delay=0] - The number of milliseconds to delay before the chain will start.
 * @property {string|number|function|object|array} [completeDelay=0] - The time the chain will wait before the onComplete event is dispatched once it has completed, in ms.
 * @property {string|number|function|object|array} [loop=0] - The number of times the chain will repeat. (A value of 1 means the chain will play twice, as it repeated once.) The first loop starts after every tween has completed once.
 * @property {string|number|function|object|array} [loopDelay=0] - The time the chain will pause before returning to the start for a repeat.
 * @property {boolean} [paused=false] - Does the chain start in a paused state (true) or playing (false)?
 * @property {Phaser.Types.Tweens.TweenBuilderConfig[]} [tweens] - The tweens to chain together.
 * @property {any} [callbackScope] - The scope (or context) for all of the callbacks. The default scope is the chain.
 * @property {Phaser.Types.Tweens.TweenOnCompleteCallback} [onComplete] - A function to call when the chain completes.
 * @property {array} [onCompleteParams] - Additional parameters to pass to `onComplete`.
 * @property {Phaser.Types.Tweens.TweenOnLoopCallback} [onLoop] - A function to call each time the chain loops.
 * @property {array} [onLoopParams] - Additional parameters to pass to `onLoop`.
 * @property {Phaser.Types.Tweens.TweenOnStartCallback} [onStart] - A function to call when the chain starts playback, after any delays have expired.
 * @property {array} [onStartParams] - Additional parameters to pass to `onStart`.
 * @property {Phaser.Types.Tweens.TweenOnStopCallback} [onStop] - A function to call when the chain is stopped.
 * @property {array} [onStopParams] - Additional parameters to pass to `onStop`.
 * @property {Phaser.Types.Tweens.TweenOnActiveCallback} [onActive] - A function to call when the chain becomes active within the Tween Manager.
 * @property {array} [onActiveParams] - Additional parameters to pass to `onActive`.
 * @property {Phaser.Types.Tweens.TweenOnPauseCallback} [onPause] - A function to call when the chain is paused.
 * @property {array} [onPauseParams] - Additional parameters to pass to `onPause`.
 * @property {Phaser.Types.Tweens.TweenOnResumeCallback} [onResume] - A function to call when the chain is resumed after being paused.
 * @property {array} [onResumeParams] - Additional parameters to pass to `onResume`.
 * @property {boolean} [persist] - Will the Tween be automatically destroyed on completion, or retained for future playback?
 */
