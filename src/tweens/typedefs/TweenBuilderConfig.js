/**
 * @typedef {object} Phaser.Types.Tweens.TweenBuilderConfig
 * @since 3.18.0
 *
 * @property {any} targets - The object, or an array of objects, to run the tween on.
 * @property {(number|function)} [delay=0] - The number of milliseconds to delay before the tween will start.
 * @property {number} [duration=1000] - The duration of the tween in milliseconds.
 * @property {(string|function)} [ease='Power0'] - The easing equation to use for the tween.
 * @property {array} [easeParams] - Optional easing parameters.
 * @property {number} [hold=0] - The number of milliseconds to hold the tween for before yoyo'ing.
 * @property {number} [repeat=0] - The number of times each property tween repeats.
 * @property {number} [repeatDelay=0] - The number of milliseconds to pause before a repeat.
 * @property {boolean} [yoyo=false] - Should the tween complete, then reverse the values incrementally to get back to the starting tween values? The reverse tweening will also take `duration` milliseconds to complete.
 * @property {boolean} [flipX=false] - Horizontally flip the target of the Tween when it completes (before it yoyos, if set to do so). Only works for targets that support the `flipX` property.
 * @property {boolean} [flipY=false] - Vertically flip the target of the Tween when it completes (before it yoyos, if set to do so). Only works for targets that support the `flipY` property.
 * @property {number|function|object|array} [offset=null] - Used when the Tween is part of a Timeline.
 * @property {number|function|object|array} [completeDelay=0] - The time the tween will wait before the onComplete event is dispatched once it has completed, in ms.
 * @property {number|function|object|array} [loop=0] - The number of times the tween will repeat. (A value of 1 means the tween will play twice, as it repeated once.) The first loop starts after every property tween has completed once.
 * @property {number|function|object|array} [loopDelay=0] - The time the tween will pause before starting either a yoyo or returning to the start for a repeat.
 * @property {boolean} [paused=false] - Does the tween start in a paused state (true) or playing (false)?
 * @property {Object.<string,(number|string|Phaser.Types.Tweens.GetEndCallback|Phaser.Types.Tweens.TweenPropConfig)>} [props] - The properties to tween.
 * @property {boolean} [useFrames=false] - Use frames or milliseconds?
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
 * @property {Phaser.Types.Tweens.TweenOnStartCallback} [onStart] - A function to call when the tween starts playback, after any delays have expired.
 * @property {array} [onStartParams] - Additional parameters to pass to `onStart`.
 * @property {any} [onStartScope] - Scope (this) for `onStart`.
 * @property {Phaser.Types.Tweens.TweenOnUpdateCallback} [onUpdate] - A function to call each time the tween steps. Called once per property per target.
 * @property {array} [onUpdateParams] - Additional parameters to pass to `onUpdate`.
 * @property {any} [onUpdateScope] - Scope (this) for `onUpdate`.
 * @property {Phaser.Types.Tweens.TweenOnYoyoCallback} [onYoyo] - A function to call each time the tween yoyos. Called once per property per target.
 * @property {array} [onYoyoParams] - Additional parameters to pass to `onYoyo`.
 * @property {any} [onYoyoScope] - Scope (this) for `onYoyo`.
 * @property {Phaser.Types.Tweens.TweenOnActiveCallback} [onActive] - A function to call when the tween becomes active within the Tween Manager.
 * @property {array} [onActiveParams] - Additional parameters to pass to `onActive`.
 * @property {any} [onActiveScope] - Scope (this) for `onActive`.
 *
 * @example
 * {
 *   targets: null,
 *   delay: 0,
 *   duration: 1000,
 *   ease: 'Power0',
 *   easeParams: null,
 *   hold: 0,
 *   repeat: 0,
 *   repeatDelay: 0,
 *   yoyo: false,
 *   flipX: false,
 *   flipY: false
 * };
 */
