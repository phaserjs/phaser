/**
 * @typedef {object} Phaser.Types.Animations.Animation
 * @since 3.0.0
 *
 * @property {string} [key] - The key that the animation will be associated with. i.e. sprite.animations.play(key)
 * @property {string|Phaser.Types.Animations.AnimationFrame[]} [frames] - Either a string, in which case it will use all frames from a texture with the matching key, or an array of Animation Frame configuration objects.
 * @property {boolean} [sortFrames=true] - If you provide a string for `frames` you can optionally have the frame names numerically sorted.
 * @property {string} [defaultTextureKey=null] - The key of the texture all frames of the animation will use. Can be overridden on a per frame basis.
 * @property {number} [frameRate] - The frame rate of playback in frames per second (default 24 if duration is null)
 * @property {number} [duration] - How long the animation should play for in milliseconds. If not given its derived from frameRate.
 * @property {boolean} [skipMissedFrames=true] - Skip frames if the time lags, or always advanced anyway?
 * @property {number} [delay=0] - Delay before starting playback. Value given in milliseconds.
 * @property {number} [repeat=0] - Number of times to repeat the animation (-1 for infinity)
 * @property {number} [repeatDelay=0] - Delay before the animation repeats. Value given in milliseconds.
 * @property {boolean} [yoyo=false] - Should the animation yoyo? (reverse back down to the start) before repeating?
 * @property {boolean} [showBeforeDelay=false] - If this animation has a delay, should it show the first frame immediately (true), or only after the delay (false)
 * @property {boolean} [showOnStart=false] - Should sprite.visible = true when the animation starts to play? This happens _after_ any delay, if set.
 * @property {boolean} [hideOnComplete=false] - Should sprite.visible = false when the animation finishes?
 */
