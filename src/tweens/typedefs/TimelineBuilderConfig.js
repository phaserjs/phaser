/**
 * @typedef {object} Phaser.Types.Tweens.TimelineBuilderConfig
 * @since 3.18.0
 *
 * @property {(Phaser.Types.Tweens.TweenBuilderConfig[]|object[]|function)} [tweens] - An array of tween configuration objects to create and add into the new Timeline. If this doesn't exist or is empty, the Timeline will start off paused and none of the other configuration settings will be read. If it's a function, it will be called and its return value will be used as the array.
 * @property {any} [targets] - An array (or function which returns one) of default targets to which to apply the Timeline. Each individual Tween configuration can override this value.
 * @property {number} [totalDuration=0] - If specified, each Tween in the Timeline will get an equal portion of this duration, usually in milliseconds, by default. Each individual Tween configuration can override the Tween's duration.
 * @property {number} [duration=1000] - If `totalDuration` is not specified, the default duration, usually in milliseconds, of each Tween which will be created. Each individual Tween configuration can override the Tween's duration.
 * @property {number} [delay=0] - The number of milliseconds to delay before the tween will start. Each individual Tween configuration can override this value.
 * @property {array} [easeParams] - Optional easing parameters. Each individual Tween configuration can override this value.
 * @property {(string|function)} [ease='Power0'] - The easing equation to use for each tween. Each individual Tween configuration can override this value.
 * @property {number} [hold=0] - The number of milliseconds to hold each tween before yoyo'ing. Each individual Tween configuration can override this value.
 * @property {number} [repeat=0] - The number of times to repeat each tween. Each individual Tween configuration can override this value.
 * @property {number} [repeatDelay=0] - The number of milliseconds to pause before each tween will repeat. Each individual Tween configuration can override this value.
 * @property {boolean} [yoyo=false] - Should each tween complete, then reverse the values incrementally to get back to the starting tween values? The reverse tweening will also take `duration` milliseconds to complete. Each individual Tween configuration can override this value.
 * @property {boolean} [flipX=false] - Horizontally flip the target of the Tween when it completes (before it yoyos, if set to do so). Only works for targets that support the `flipX` property. Each individual Tween configuration can override this value.
 * @property {boolean} [flipY=false] - Vertically flip the target of the Tween when it completes (before it yoyos, if set to do so). Only works for targets that support the `flipY` property. Each individual Tween configuration can override this value.
 * @property {(number|function|object|array)} [completeDelay=0] - If specified, the time to wait, usually in milliseconds, before the Timeline completes.
 * @property {(number|function|object|array)} [loop=0] - How many times the Timeline should loop, or -1 to loop indefinitely.
 * @property {(number|function|object|array)} [loopDelay=0] - The time, usually in milliseconds, between each loop.
 * @property {boolean} [paused=false] - If `true`, the Timeline will start paused.
 * @property {boolean} [useFrames=false] - If `true`, all duration in the Timeline will be in frames instead of milliseconds.
 * @property {any} [callbackScope] - The default scope (`this` value) to use for each callback registered by the Timeline Builder. If not specified, the Timeline itself will be used.
 * @property {Phaser.Types.Tweens.TimelineOnStartCallback} [onStart] - If specified, the `onStart` callback for the Timeline, called every time it starts playing.
 * @property {any} [onStartScope] - The scope (`this` value) to use for the `onStart` callback. If not specified, the `callbackScope` will be used.
 * @property {array} [onStartParams] - Additional arguments to pass to the `onStart` callback. The Timeline will always be the first argument.
 * @property {Phaser.Types.Tweens.TimelineOnUpdateCallback} [onUpdate] - If specified, the `onUpdate` callback for the Timeline, called every frame it's active, regardless of its Tweens.
 * @property {any} [onUpdateScope] - The scope (`this` value) to use for the `onUpdate` callback. If not specified, the `callbackScope` will be used.
 * @property {array} [onUpdateParams] - Additional arguments to pass to the `onUpdate` callback. The Timeline will always be the first argument.
 * @property {Phaser.Types.Tweens.TimelineOnLoopCallback} [onLoop] - If specified, the `onLoop` callback for the Timeline, called every time it loops.
 * @property {any} [onLoopScope] - The scope (`this` value) to use for the `onLoop` callback. If not specified, the `callbackScope` will be used.
 * @property {array} [onLoopParams] - Additional arguments to pass to the `onLoop` callback. The Timeline will always be the first argument.
 * @property {Phaser.Types.Tweens.TimelineOnYoyoCallback} [onYoyo] - If specified, the `onYoyo` callback for the Timeline, called every time it yoyos.
 * @property {any} [onYoyoScope] - The scope (`this` value) to use for the `onYoyo` callback. If not specified, the `callbackScope` will be used.
 * @property {array} [onYoyoParams] - Additional arguments to pass to the `onYoyo` callback. The first argument will always be `null`, while the Timeline will always be the second argument.
 * @property {Phaser.Types.Tweens.TimelineOnCompleteCallback} [onComplete] - If specified, the `onComplete` callback for the Timeline, called after it completes.
 * @property {any} [onCompleteScope] - The scope (`this` value) to use for the `onComplete` callback. If not specified, the `callbackScope` will be used.
 * @property {array} [onCompleteParams] - Additional arguments to pass to the `onComplete` callback. The Timeline will always be the first argument.
 *
 * @see Phaser.Tweens.Builders.TimelineBuilder
 */
