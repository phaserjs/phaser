/**
 * @typedef {object} Phaser.Types.Animations.PlayAnimationConfig
 * @since 3.50.0
 *
 * @property {(string|Phaser.Animations.Animation)} key - The string-based key of the animation to play, or an Animation instance.
 * @property {number} [frameRate] - The frame rate of playback in frames per second (default 24 if duration is null)
 * @property {number} [duration] - How long the animation should play for in milliseconds. If not given its derived from frameRate.
 * @property {number} [delay] - Delay before starting playback. Value given in milliseconds.
 * @property {number} [repeat] - Number of times to repeat the animation (-1 for infinity)
 * @property {number} [repeatDelay] - Delay before the animation repeats. Value given in milliseconds.
 * @property {boolean} [yoyo] - Should the animation yoyo? (reverse back down to the start) before repeating?
 * @property {boolean} [showBeforeDelay] - If this animation has a delay, should it show the first frame immediately (true), or only after the delay (false)
 * @property {boolean} [showOnStart] - Should sprite.visible = true when the animation starts to play?
 * @property {boolean} [hideOnComplete] - Should sprite.visible = false when the animation finishes?
 * @property {number} [startFrame] - The frame of the animation to start playback from.
 * @property {number} [timeScale] - The time scale to be applied to playback of this animation.
 */
