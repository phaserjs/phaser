/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

var CanvasPool = require('../../display/canvas/CanvasPool');

/**
 * Calculates the ascent, descent and fontSize of a given font style.
 *
 * @function Phaser.GameObjects.Text.MeasureText
 * @since 3.0.0
 *
 * @param {Phaser.GameObjects.Text.TextStyle} textStyle - The TextStyle object to measure.
 *
 * @return {object} An object containing the ascent, descent and fontSize of the TextStyle.
 */
var MeasureText = function (textStyle)
{
    // @property {HTMLCanvasElement} canvas - The canvas element that the text is rendered.
    var canvas = CanvasPool.create(this);

    // @property {HTMLCanvasElement} context - The context of the canvas element that the text is rendered to.
    var context = canvas.getContext('2d');

    textStyle.syncFont(canvas, context);

    var width = Math.ceil(context.measureText(textStyle.testString).width * textStyle.baselineX);
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

    if (!context.getImageData(0, 0, width, height))
    {
        output.ascent = baseline;
        output.descent = baseline + 6;
        output.fontSize = output.ascent + output.descent;

        CanvasPool.remove(canvas);

        return output;
    }

    var imagedata = context.getImageData(0, 0, width, height).data;
    var pixels = imagedata.length;
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
            if (imagedata[idx + j] !== 255)
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

    idx = pixels - line;
    stop = false;

    // descent. scan from bottom to top until we find a non red pixel
    for (i = height; i > baseline; i--)
    {
        for (j = 0; j < line; j += 4)
        {
            if (imagedata[idx + j] !== 255)
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
