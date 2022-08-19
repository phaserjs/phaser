/**
 * @callback Phaser.Types.Tweens.TweenOnRepeatCallback
 * @since 3.18.0
 *
 * @param {Phaser.Tweens.Tween} tween - A reference to the Tween.
 * @param {any} target - The current target of the Tween. If this Tween has multiple targets, this will be a reference to just the single one being updated prior to this callback.
 * @param {string} key - The property that is being updated on the target.
 * @param {number} current - The current value of the property being set on the target.
 * @param {number} previous - The previous value of the property being set on the target.
 * @param {...any} param - Any value passed in `onRepeatParams`.
 */
