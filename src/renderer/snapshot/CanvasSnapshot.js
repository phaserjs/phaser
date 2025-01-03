/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var CanvasPool = require('../../display/canvas/CanvasPool');
var Color = require('../../display/color/Color');
var GetFastValue = require('../../utils/object/GetFastValue');

/**
 * Takes a snapshot of an area from the current frame displayed by a canvas.
 *
 * This is then copied to an Image object. When this loads, the results are sent
 * to the callback provided in the Snapshot Configuration object.
 *
 * @function Phaser.Renderer.Snapshot.Canvas
 * @since 3.0.0
 *
 * @param {HTMLCanvasElement} sourceCanvas - The canvas to take a snapshot of.
 * @param {Phaser.Types.Renderer.Snapshot.SnapshotState} config - The snapshot configuration object.
 */
var CanvasSnapshot = function (canvas, config)
{
    var callback = GetFastValue(config, 'callback');
    var type = GetFastValue(config, 'type', 'image/png');
    var encoderOptions = GetFastValue(config, 'encoder', 0.92);
    var x = Math.abs(Math.round(GetFastValue(config, 'x', 0)));
    var y = Math.abs(Math.round(GetFastValue(config, 'y', 0)));
    var width = Math.floor(GetFastValue(config, 'width', canvas.width));
    var height = Math.floor(GetFastValue(config, 'height', canvas.height));
    var getPixel = GetFastValue(config, 'getPixel', false);

    if (getPixel)
    {
        var context = canvas.getContext('2d', { willReadFrequently: false });
        var imageData = context.getImageData(x, y, 1, 1);
        var data = imageData.data;

        callback.call(null, new Color(data[0], data[1], data[2], data[3]));
    }
    else if (x !== 0 || y !== 0 || width !== canvas.width || height !== canvas.height)
    {
        //  Area Grab
        var copyCanvas = CanvasPool.createWebGL(this, width, height);
        var ctx = copyCanvas.getContext('2d', { willReadFrequently: true });

        if (width > 0 && height > 0)
        {
            ctx.drawImage(canvas, x, y, width, height, 0, 0, width, height);
        }

        var image1 = new Image();

        image1.onerror = function ()
        {
            callback.call(null);

            CanvasPool.remove(copyCanvas);
        };

        image1.onload = function ()
        {
            callback.call(null, image1);

            CanvasPool.remove(copyCanvas);
        };

        image1.src = copyCanvas.toDataURL(type, encoderOptions);
    }
    else
    {
        //  Full Grab
        var image2 = new Image();

        image2.onerror = function ()
        {
            callback.call(null);
        };

        image2.onload = function ()
        {
            callback.call(null, image2);
        };

        image2.src = canvas.toDataURL(type, encoderOptions);
    }
};

module.exports = CanvasSnapshot;
