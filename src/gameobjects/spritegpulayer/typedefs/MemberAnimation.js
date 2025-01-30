/**
 * @typedef {object} Phaser.Types.GameObjects.SpriteGPULayer.MemberAnimation
 * @since 4.0.0
 *
 * @property {number} [base=0] - The base value of the animation.
 * @property {number|string} [ease=0] - The ease value of the animation. This must be a key or value of `SpriteGPULayer.EASE`, e.g. 'Linear', 'Quad.easeIn', etc.
 * @property {number} [amplitude=0] - The amplitude of the animation.
 * @property {number} [duration=0] - The duration of the animation, in milliseconds. Must be non-negative.
 * @property {number} [delay=0] - The delay of the animation, in milliseconds.
 * @property {boolean} [yoyo=true] - Whether the animation runs backwards when it completes. If false, it starts over from the beginning.
 * @property {number} [gravityFactor=1] - The gravity factor of the animation. This is used instead of `amplitude` if the ease is 'Gravity'.
 * @property {number} [velocity=0] - The velocity of the animation. This is used instead of `amplitude` if the ease is 'Velocity'.
 */
