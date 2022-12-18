/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2022 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var CanvasPool = require('../../display/canvas/CanvasPool');

/**
 * Calculates the ascent, descent and fontSize of a given font style.
 *
 * @function Phaser.GameObjects.MeasureText
 * @since 3.0.0
 *
 * @param {Phaser.GameObjects.TextStyle} textStyle - The TextStyle object to measure.
 *
 * @return {Phaser.Types.GameObjects.Text.TextMetrics} An object containing the ascent, descent and fontSize of the TextStyle.
 */
var MeasureText = function (textStyle)
{
    var canvas = CanvasPool.create(this);
    var context = canvas.getContext('2d', { willReadFrequently: true });

    textStyle.syncFont(canvas, context);

    var metrics = context.measureText(textStyle.testString);

    if ('actualBoundingBoxAscent' in metrics)
    {
        var ascent = metrics.actualBoundingBoxAscent;
        var descent = metrics.actualBoundingBoxDescent;

        CanvasPool.remove(canvas);

        return {
            ascent: ascent,
            descent: descent,
            fontSize: ascent + descent
        };
    }

    var width = Math.ceil(metrics.width * textStyle.baselineX);
    var baseline = width;
    var height = 2 * baseline;

    baseline = baseline * textStyle.baselineY | 0;

    canvas.width = width;
    canvas.height = height;

    context.fillStyle = '#f00';
    context.fillRect(0, 0, width, height);

    context.font = textStyle._font;

    context.textBaseline = 'alphabetic';
    context.fillStyle = '#000';
    context.fillText(textStyle.testString, 0, baseline);

    var output = {
        ascent: 0,
        descent: 0,
        fontSize: 0
    };

    var imagedata = context.getImageData(0, 0, width, height);

    if (!imagedata)
    {
        output.ascent = baseline;
        output.descent = baseline + 6;
        output.fontSize = output.ascent + output.descent;

        CanvasPool.remove(canvas);

        return output;
    }

    var pixels = imagedata.data;
    var numPixels = pixels.length;
    var line = width * 4;
    var i;
    var j;
    var idx = 0;
    var stop = false;

    // ascent. scan from top to bottom until we find a non red pixel
    for (i = 0; i < baseline; i++)
    {
        for (j = 0; j < line; j += 4)
        {
            if (pixels[idx + j] !== 255)
            {
                stop = true;
                break;
            }
        }

        if (!stop)
        {
            idx += line;
        }
        else
        {
            break;
        }
    }

    output.ascent = baseline - i;

    idx = numPixels - line;
    stop = false;

    // descent. scan from bottom to top until we find a non red pixel
    for (i = height; i > baseline; i--)
    {
        for (j = 0; j < line; j += 4)
        {
            if (pixels[idx + j] !== 255)
            {
                stop = true;
                break;
            }
        }

        if (!stop)
        {
            idx -= line;
        }
        else
        {
            break;
        }
    }

    output.descent = (i - baseline);
    output.fontSize = output.ascent + output.descent;

    CanvasPool.remove(canvas);

    return output;
};

module.exports = MeasureText;
