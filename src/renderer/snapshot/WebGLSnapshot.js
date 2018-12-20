/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

/**
 * Takes a snapshot of the current frame displayed by a WebGL canvas.
 *
 * @function Phaser.Renderer.Snapshot.WebGL
 * @since 3.0.0
 *
 * @param {HTMLCanvasElement} sourceCanvas - The canvas to take a snapshot of.
 * @param {string} [type='image/png'] - The format of the returned image.
 * @param {number} [encoderOptions=0.92] - The image quality, between 0 and 1, for image formats which use lossy compression (such as `image/jpeg`).
 *
 * @return {HTMLImageElement} A new image which contains a snapshot of the canvas's contents.
 */
var WebGLSnapshot = function (sourceCanvas, type, encoderOptions)
{
    if (!type) { type = 'image/png'; }
    if (!encoderOptions) { encoderOptions = 0.92; }

    var gl = sourceCanvas.getContext('experimental-webgl');
    var pixels = new Uint8Array(gl.drawingBufferWidth * gl.drawingBufferHeight * 4);
    gl.readPixels(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight, gl.RGBA, gl.UNSIGNED_BYTE, pixels);

    //  CanvasPool?
    var canvas = document.createElement('canvas');
    var ctx = canvas.getContext('2d');
    var imageData;

    canvas.width = gl.drawingBufferWidth;
    canvas.height = gl.drawingBufferHeight;

    imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

    var data = imageData.data;

    for (var y = 0; y < canvas.height; y += 1)
    {
        for (var x = 0; x < canvas.width; x += 1)
        {
            var si = ((canvas.height - y) * canvas.width + x) * 4;
            var di = (y * canvas.width + x) * 4;
            data[di + 0] = pixels[si + 0];
            data[di + 1] = pixels[si + 1];
            data[di + 2] = pixels[si + 2];
            data[di + 3] = pixels[si + 3];
        }
    }

    ctx.putImageData(imageData, 0, 0);

    var src = canvas.toDataURL(type, encoderOptions);
    var image = new Image();

    image.src = src;

    return image;
};

module.exports = WebGLSnapshot;
