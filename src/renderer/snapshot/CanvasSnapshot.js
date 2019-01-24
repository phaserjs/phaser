/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2019 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

/**
 * Takes a snapshot of the current frame displayed by a 2D canvas.
 *
 * @function Phaser.Renderer.Snapshot.Canvas
 * @since 3.0.0
 *
 * @param {HTMLCanvasElement} canvas - The canvas to take a snapshot of.
 * @param {string} [type='image/png'] - The format of the returned image.
 * @param {number} [encoderOptions=0.92] - The image quality, between 0 and 1, for image formats which use lossy compression (such as `image/jpeg`).
 *
 * @return {HTMLImageElement} Returns an image of the type specified.
 */
var CanvasSnapshot = function (canvas, type, encoderOptions)
{
    if (type === undefined) { type = 'image/png'; }
    if (encoderOptions === undefined) { encoderOptions = 0.92; }

    var src = canvas.toDataURL(type, encoderOptions);

    var image = new Image();

    image.src = src;

    return image;
};

module.exports = CanvasSnapshot;
