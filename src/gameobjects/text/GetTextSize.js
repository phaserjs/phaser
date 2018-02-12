/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

/**
 * Returns an object containing dimensions of the Text object.
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

    for (var i = 0; i < drawnLines; i++)
    {
        var lineWidth = style.strokeThickness;

        lineWidth += context.measureText(lines[i]).width;

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
    var lineSpacing = text._lineSpacing || 0;

    if (lineSpacing < 0 && Math.abs(lineSpacing) > lineHeight)
    {
        lineSpacing = -lineHeight;
    }

    //  Adjust for line spacing
    if (lineSpacing !== 0)
    {
        height += (lineSpacing > 0) ? lineSpacing * lines.length : lineSpacing * (lines.length - 1);
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
