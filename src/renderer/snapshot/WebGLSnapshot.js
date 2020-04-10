/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var CanvasPool = require('../../display/canvas/CanvasPool');
var Color = require('../../display/color/Color');
var GetFastValue = require('../../utils/object/GetFastValue');

/**
 * Takes a snapshot of an area from the current frame displayed by a WebGL canvas.
 * 
 * This is then copied to an Image object. When this loads, the results are sent
 * to the callback provided in the Snapshot Configuration object.
 *
 * @function Phaser.Renderer.Snapshot.WebGL
 * @since 3.0.0
 *
 * @param {HTMLCanvasElement} sourceCanvas - The canvas to take a snapshot of.
 * @param {Phaser.Types.Renderer.Snapshot.SnapshotState} config - The snapshot configuration object.
 */
var WebGLSnapshot = function (sourceCanvas, config)
{
    var gl = sourceCanvas.getContext('experimental-webgl');

    var callback = GetFastValue(config, 'callback');
    var type = GetFastValue(config, 'type', 'image/png');
    var encoderOptions = GetFastValue(config, 'encoder', 0.92);
    var x = GetFastValue(config, 'x', 0);
    var y = GetFastValue(config, 'y', 0);

    var getPixel = GetFastValue(config, 'getPixel', false);

    var isFramebuffer = GetFastValue(config, 'isFramebuffer', false);

    var bufferWidth = (isFramebuffer) ? GetFastValue(config, 'bufferWidth', 1) : gl.drawingBufferWidth;
    var bufferHeight = (isFramebuffer) ? GetFastValue(config, 'bufferHeight', 1) : gl.drawingBufferHeight;

    if (getPixel)
    {
        var pixel = new Uint8Array(4);

        var destY = (isFramebuffer) ? y : bufferHeight - y;

        gl.readPixels(x, destY, 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, pixel);

        callback.call(null, new Color(pixel[0], pixel[1], pixel[2], pixel[3] / 255));
    }
    else
    {
        var width = GetFastValue(config, 'width', bufferWidth);
        var height = GetFastValue(config, 'height', bufferHeight);

        var total = width * height * 4;

        var pixels = new Uint8Array(total);

        gl.readPixels(x, bufferHeight - y - height, width, height, gl.RGBA, gl.UNSIGNED_BYTE, pixels);
    
        var canvas = CanvasPool.createWebGL(this, width, height);
        var ctx = canvas.getContext('2d');

        var imageData = ctx.getImageData(0, 0, width, height);
    
        var data = imageData.data;

        for (var py = 0; py < height; py++)
        {
            for (var px = 0; px < width; px++)
            {
                var sourceIndex = ((height - py) * width + px) * 4;
                var destIndex = (isFramebuffer) ? total - ((py * width + (width - px)) * 4) : (py * width + px) * 4;

                data[destIndex + 0] = pixels[sourceIndex + 0];
                data[destIndex + 1] = pixels[sourceIndex + 1];
                data[destIndex + 2] = pixels[sourceIndex + 2];
                data[destIndex + 3] = pixels[sourceIndex + 3];
            }
        }

        ctx.putImageData(imageData, 0, 0);
    
        var image = new Image();

        image.onerror = function ()
        {
            callback.call(null);

            CanvasPool.remove(canvas);
        };

        image.onload = function ()
        {
            callback.call(null, image);

            CanvasPool.remove(canvas);
        };

        image.src = canvas.toDataURL(type, encoderOptions);
    }
};

module.exports = WebGLSnapshot;
