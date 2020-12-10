/**
 * @typedef {object} Phaser.Types.Animations.GenerateFrameNames
 * @since 3.0.0
 *
 * @property {string} [prefix=''] - The string to append to every resulting frame name if using a range or an array of `frames`.
 * @property {number} [start=0] - If `frames` is not provided, the number of the first frame to return.
 * @property {number} [end=0] - If `frames` is not provided, the number of the last frame to return.
 * @property {string} [suffix=''] - The string to append to every resulting frame name if using a range or an array of `frames`.
 * @property {number} [zeroPad=0] - The minimum expected lengths of each resulting frame's number. Numbers will be left-padded with zeroes until they are this long, then prepended and appended to create the resulting frame name.
 * @property {Phaser.Types.Animations.AnimationFrame[]} [outputArray=[]] - The array to append the created configuration objects to.
 * @property {(boolean|number[])} [frames=false] - If provided as an array, the range defined by `start` and `end` will be ignored and these frame numbers will be used.
 */
