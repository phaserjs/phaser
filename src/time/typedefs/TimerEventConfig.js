/**
 * @typedef {object} Phaser.Types.Time.TimerEventConfig
 * @since 3.0.0
 *
 * @property {number} [delay=0] - The delay after which the Timer Event should fire, in milliseconds.
 * @property {number} [repeat=0] - The total number of times the Timer Event will repeat before finishing.
 * @property {boolean} [loop=false] - `true` if the Timer Event should repeat indefinitely.
 * @property {function} [callback] - The callback which will be called when the Timer Event fires.
 * @property {*} [callbackScope] - The scope (`this` object) with which to invoke the `callback`.
 * @property {Array.<*>} [args] - Additional arguments to be passed to the `callback`.
 * @property {number} [timeScale=1] - The scale of the elapsed time.
 * @property {number} [startAt=0] - The initial elapsed time in milliseconds. Useful if you want a long duration with repeat, but for the first loop to fire quickly.
 * @property {boolean} [paused=false] - `true` if the Timer Event should be paused.
 */
