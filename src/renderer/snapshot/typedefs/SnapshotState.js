/**
 * @typedef {object} Phaser.Types.Renderer.Snapshot.SnapshotState
 * @since 3.16.1
 *
 * @property {Phaser.Types.Renderer.Snapshot.SnapshotCallback} callback - The function to call after the snapshot is taken.
 * @property {string} [type='image/png'] - The format of the image to create, usually `image/png` or `image/jpeg`.
 * @property {number} [encoderOptions=0.92] - The image quality, between 0 and 1. Used for image formats with lossy compression, such as `image/jpeg`.
 * @property {number} [x=0] - The x coordinate to start the snapshot from.
 * @property {number} [y=0] - The y coordinate to start the snapshot from.
 * @property {number} [width] - The width of the snapshot.
 * @property {number} [height] - The height of the snapshot.
 * @property {boolean} [getPixel=false] - Is this a snapshot to get a single pixel, or an area?
 * @property {boolean} [isFramebuffer=false] - Is this snapshot grabbing from a frame buffer or a canvas?
 * @property {number} [bufferWidth] - The width of the frame buffer, if a frame buffer grab.
 * @property {number} [bufferHeight] - The height of the frame buffer, if a frame buffer grab.
 */
