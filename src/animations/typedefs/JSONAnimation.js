/**
 * @typedef {object} Phaser.Animations.Types.JSONAnimation
 *
 * @property {string} key - The key that the animation will be associated with. i.e. sprite.animations.play(key)
 * @property {string} type - A frame based animation (as opposed to a bone based animation)
 * @property {Phaser.Animations.Types.JSONAnimationFrame[]} frames - [description]
 * @property {integer} frameRate - The frame rate of playback in frames per second (default 24 if duration is null)
 * @property {integer} duration - How long the animation should play for in milliseconds. If not given its derived from frameRate.
 * @property {boolean} skipMissedFrames - Skip frames if the time lags, or always advanced anyway?
 * @property {integer} delay - Delay before starting playback. Value given in milliseconds.
 * @property {integer} repeat - Number of times to repeat the animation (-1 for infinity)
 * @property {integer} repeatDelay - Delay before the animation repeats. Value given in milliseconds.
 * @property {boolean} yoyo - Should the animation yoyo? (reverse back down to the start) before repeating?
 * @property {boolean} showOnStart - Should sprite.visible = true when the animation starts to play?
 * @property {boolean} hideOnComplete - Should sprite.visible = false when the animation finishes?
 */
