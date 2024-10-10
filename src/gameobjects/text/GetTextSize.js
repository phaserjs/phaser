/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2024 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * Returns an object containing dimensions of the Text object.
 *
 * @function Phaser.GameObjects.GetTextSize
 * @since 3.0.0
 *
 * @param {Phaser.GameObjects.Text} text - The Text object to calculate the size from.
 * @param {Phaser.Types.GameObjects.Text.TextMetrics} size - The Text metrics to use when calculating the size.
 * @param {string[]} lines - The lines of text to calculate the size from.
 *
 * @return {Phaser.Types.GameObjects.Text.GetTextSizeObject} An object containing dimensions of the Text object.
 */
var GetTextSize = function (text, size, lines)
{
    var canvas = text.canvas;
    var context = text.context;
    var style = text.style;

    var lineWidths = [];
    var maxLineWidth = 0;
    var drawnLines = lines.length;

    if (style.maxLines > 0 && style.maxLines < lines.length)
    {
        drawnLines = style.maxLines;
    }

    style.syncFont(canvas, context);

    //  Text Width
    var letterSpacing = text.letterSpacing;

    for (var i = 0; i < drawnLines; i++)
    {
        var lineWidth = style.strokeThickness;

        if (letterSpacing === 0)
        {
            lineWidth += context.measureText(lines[i]).width;
        }
        else
        {
            var line = lines[i];
            
            for (var j = 0; j < line.length; j++)
            {
                lineWidth += context.measureText(line[j]).width;
            }

            if (line.length > 1)
            {
                lineWidth += letterSpacing * (line.length - 1);
            }
        }

        // Adjust for wrapped text
        if (style.wordWrap)
        {
            lineWidth -= context.measureText(' ').width;
        }

        lineWidths[i] = Math.ceil(lineWidth);
        maxLineWidth = Math.max(maxLineWidth, lineWidths[i]);
    }

    //  Text Height

    var lineHeight = size.fontSize + style.strokeThickness;
    var height = lineHeight * drawnLines;
    var lineSpacing = text.lineSpacing;

    //  Adjust for line spacing
    if (drawnLines > 1)
    {
        height += lineSpacing * (drawnLines - 1);
    }

    return {
        width: maxLineWidth,
        height: height,
        lines: drawnLines,
        lineWidths: lineWidths,
        lineSpacing: lineSpacing,
        lineHeight: lineHeight
    };
};

module.exports = GetTextSize;
