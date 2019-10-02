/**
 * @typedef {object} Phaser.Types.Loader.FileTypes.ImageFrameConfig
 *
 * @property {integer} frameWidth - The width of the frame in pixels.
 * @property {integer} [frameHeight] - The height of the frame in pixels. Uses the `frameWidth` value if not provided.
 * @property {integer} [startFrame=0] - The first frame to start parsing from.
 * @property {integer} [endFrame] - The frame to stop parsing at. If not provided it will calculate the value based on the image and frame dimensions.
 * @property {integer} [margin=0] - The margin in the image. This is the space around the edge of the frames.
 * @property {integer} [spacing=0] - The spacing between each frame in the image.
 */
