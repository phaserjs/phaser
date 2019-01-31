/**
 * @typedef {object} Phaser.Animations.Types.Animation
 *
 * @property {string} [key] - The key that the animation will be associated with. i.e. sprite.animations.play(key)
 * @property {Phaser.Animations.Types.AnimationFrame[]} [frames] - An object containing data used to generate the frames for the animation
 * @property {string} [defaultTextureKey=null] - The key of the texture all frames of the animation will use. Can be overridden on a per frame basis.
 * @property {integer} [frameRate] - The frame rate of playback in frames per second (default 24 if duration is null)
 * @property {integer} [duration] - How long the animation should play for in milliseconds. If not given its derived from frameRate.
 * @property {boolean} [skipMissedFrames=true] - Skip frames if the time lags, or always advanced anyway?
 * @property {integer} [delay=0] - Delay before starting playback. Value given in milliseconds.
 * @property {integer} [repeat=0] - Number of times to repeat the animation (-1 for infinity)
 * @property {integer} [repeatDelay=0] - Delay before the animation repeats. Value given in milliseconds.
 * @property {boolean} [yoyo=false] - Should the animation yoyo? (reverse back down to the start) before repeating?
 * @property {boolean} [showOnStart=false] - Should sprite.visible = true when the animation starts to play?
 * @property {boolean} [hideOnComplete=false] - Should sprite.visible = false when the animation finishes?
 */
