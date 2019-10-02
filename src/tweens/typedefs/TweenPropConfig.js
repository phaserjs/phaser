/**
 * @typedef {object} Phaser.Types.Tweens.TweenPropConfig
 * @since 3.18.0
 *
 * @property {(number|string|Phaser.Types.Tweens.GetEndCallback|Phaser.Types.Tweens.TweenPropConfig)} [value] - What the property will be at the END of the Tween.
 * @property {Phaser.Types.Tweens.GetActiveCallback} [getActive] - What the property will be set to immediately when this tween becomes active.
 * @property {Phaser.Types.Tweens.GetEndCallback} [getEnd] - What the property will be at the END of the Tween.
 * @property {Phaser.Types.Tweens.GetStartCallback} [getStart] - What the property will be at the START of the Tween.
 * @property {(string|function)} [ease] - The ease function this tween uses.
 * @property {number} [delay] - Time in ms/frames before tween will start.
 * @property {number} [duration] - Duration of the tween in ms/frames.
 * @property {boolean} [yoyo] - Determines whether the tween should return back to its start value after hold has expired.
 * @property {number} [hold] - Time in ms/frames the tween will pause before repeating or returning to its starting value if yoyo is set to true.
 * @property {number} [repeat] - Number of times to repeat the tween. The tween will always run once regardless, so a repeat value of '1' will play the tween twice.
 * @property {number} [repeatDelay] - Time in ms/frames before the repeat will start.
 * @property {boolean} [flipX] - Should toggleFlipX be called when yoyo or repeat happens?
 * @property {boolean} [flipY] - Should toggleFlipY be called when yoyo or repeat happens?
 */
