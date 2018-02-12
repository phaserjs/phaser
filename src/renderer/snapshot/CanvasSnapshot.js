/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

/**
 * [description]
 *
 * @function Phaser.Renderer.Snapshot.Canvas
 * @since 3.0.0
 *
 * @param {HTMLCanvasElement} canvas - [description]
 * @param {string} [type='image/png'] - [description]
 * @param {float} [encoderOptions=0.92] - [description]
 *
 * @return {Image} [description]
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
