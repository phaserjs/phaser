/**
 * @typedef {object} Phaser.Types.Loader.FileTypes.ImageFrameConfig
 *
 * @property {number} frameWidth - The width of the frame in pixels.
 * @property {number} [frameHeight] - The height of the frame in pixels. Uses the `frameWidth` value if not provided.
 * @property {number} [startFrame=0] - The first frame to start parsing from.
 * @property {number} [endFrame] - The frame to stop parsing at. If not provided it will calculate the value based on the image and frame dimensions.
 * @property {number} [margin=0] - The margin in the image. This is the space around the edge of the frames.
 * @property {number} [spacing=0] - The spacing between each frame in the image.
 */
