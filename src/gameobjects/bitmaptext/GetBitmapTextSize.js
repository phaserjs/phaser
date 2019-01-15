/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2019 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

/**
 * @typedef {object} BitmapTextSize
 *
 * @property {GlobalBitmapTextSize} global - The position and size of the BitmapText, taking into account the position and scale of the Game Object.
 * @property {LocalBitmapTextSize} local - The position and size of the BitmapText, taking just the font size into account.
 */

/**
 * The position and size of the Bitmap Text in global space, taking into account the Game Object's scale and world position.
 *
 * @typedef {object} GlobalBitmapTextSize
 *
 * @property {number} x - The x position of the BitmapText, taking into account the x position and scale of the Game Object.
 * @property {number} y - The y position of the BitmapText, taking into account the y position and scale of the Game Object.
 * @property {number} width - The width of the BitmapText, taking into account the x scale of the Game Object.
 * @property {number} height - The height of the BitmapText, taking into account the y scale of the Game Object.
 */

/**
 * The position and size of the Bitmap Text in local space, taking just the font size into account.
 *
 * @typedef {object} LocalBitmapTextSize
 *
 * @property {number} x - The x position of the BitmapText.
 * @property {number} y - The y position of the BitmapText.
 * @property {number} width - The width of the BitmapText.
 * @property {number} height - The height of the BitmapText.
 */

/**
 * Calculate the position, width and height of a BitmapText Game Object.
 *
 * Returns a BitmapTextSize object that contains global and local variants of the Game Objects x and y coordinates and
 * its width and height.
 *
 * The global position and size take into account the Game Object's position and scale.
 *
 * The local position and size just takes into account the font data.
 *
 * @function GetBitmapTextSize
 * @since 3.0.0
 * @private
 *
 * @param {(Phaser.GameObjects.DynamicBitmapText|Phaser.GameObjects.BitmapText)} src - The BitmapText to calculate the position, width and height of.
 * @param {boolean} [round] - Whether to round the results to the nearest integer.
 * @param {object} [out] - Optional object to store the results in, to save constant object creation.
 *
 * @return {BitmapTextSize} The calculated position, width and height of the BitmapText.
 */
var GetBitmapTextSize = function (src, round, out)
{
    if (out === undefined)
    {
        out = {
            local: {
                x: 0,
                y: 0,
                width: 0,
                height: 0
            },
            global: {
                x: 0,
                y: 0,
                width: 0,
                height: 0
            },
            lines: {
                shortest: 0,
                longest: 0,
                lengths: null
            }
        };
    }

    var text = src.text;
    var textLength = text.length;

    var bx = Number.MAX_VALUE;
    var by = Number.MAX_VALUE;
    var bw = 0;
    var bh = 0;

    var chars = src.fontData.chars;
    var lineHeight = src.fontData.lineHeight;
    var letterSpacing = src.letterSpacing;

    var xAdvance = 0;
    var yAdvance = 0;

    var charCode = 0;

    var glyph = null;

    var x = 0;
    var y = 0;

    var scale = (src.fontSize / src.fontData.size);
    var sx = scale * src.scaleX;
    var sy = scale * src.scaleY;

    var lastGlyph = null;
    var lastCharCode = 0;
    var lineWidths = [];
    var shortestLine = Number.MAX_VALUE;
    var longestLine = 0;
    var currentLine = 0;
    var currentLineWidth = 0;

    for (var i = 0; i < textLength; i++)
    {
        charCode = text.charCodeAt(i);

        if (charCode === 10)
        {
            xAdvance = 0;
            yAdvance += lineHeight;
            lastGlyph = null;

            lineWidths[currentLine] = currentLineWidth;

            if (currentLineWidth > longestLine)
            {
                longestLine = currentLineWidth;
            }

            if (currentLineWidth < shortestLine)
            {
                shortestLine = currentLineWidth;
            }

            currentLine++;
            currentLineWidth = 0;
            continue;
        }

        glyph = chars[charCode];

        if (!glyph)
        {
            continue;
        }

        x = xAdvance;
        y = yAdvance;

        if (lastGlyph !== null)
        {
            var kerningOffset = glyph.kerning[lastCharCode];
            x += (kerningOffset !== undefined) ? kerningOffset : 0;
        }

        if (bx > x)
        {
            bx = x;
        }

        if (by > y)
        {
            by = y;
        }

        var gw = x + glyph.xAdvance;
        var gh = y + lineHeight;

        if (bw < gw)
        {
            bw = gw;
        }

        if (bh < gh)
        {
            bh = gh;
        }

        xAdvance += glyph.xAdvance + letterSpacing;
        lastGlyph = glyph;
        lastCharCode = charCode;
        currentLineWidth = gw * scale;
    }

    lineWidths[currentLine] = currentLineWidth;

    if (currentLineWidth > longestLine)
    {
        longestLine = currentLineWidth;
    }

    if (currentLineWidth < shortestLine)
    {
        shortestLine = currentLineWidth;
    }

    var local = out.local;
    var global = out.global;
    var lines = out.lines;

    local.x = bx * scale;
    local.y = by * scale;
    local.width = bw * scale;
    local.height = bh * scale;

    global.x = (src.x - src.displayOriginX) + (bx * sx);
    global.y = (src.y - src.displayOriginY) + (by * sy);
    global.width = bw * sx;
    global.height = bh * sy;

    lines.shortest = shortestLine;
    lines.longest = longestLine;
    lines.lengths = lineWidths;

    if (round)
    {
        local.x = Math.round(local.x);
        local.y = Math.round(local.y);
        local.width = Math.round(local.width);
        local.height = Math.round(local.height);

        global.x = Math.round(global.x);
        global.y = Math.round(global.y);
        global.width = Math.round(global.width);
        global.height = Math.round(global.height);

        lines.shortest = Math.round(shortestLine);
        lines.longest = Math.round(longestLine);
    }

    return out;
};

module.exports = GetBitmapTextSize;
