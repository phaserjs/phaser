/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
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
 *
 * @return {BitmapTextSize} The calculated position, width and height of the BitmapText.
 */
var GetBitmapTextSize = function (src, round)
{
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

    var indexCount = 0;
    var charCode = 0;

    var glyph = null;
    var glyphW = 0;
    var glyphH = 0;

    var x = 0;
    var y = 0;

    var lastGlyph = null;
    var lastCharCode = 0;

    for (var index = 0; index < textLength; ++index)
    {
        charCode = text.charCodeAt(index);

        if (charCode === 10)
        {
            xAdvance = 0;
            indexCount = 0;
            yAdvance += lineHeight;
            lastGlyph = null;
            continue;
        }

        glyph = chars[charCode];

        if (!glyph)
        {
            continue;
        }

        glyphW = glyph.width;
        glyphH = glyph.height;

        x = indexCount + glyph.xOffset + xAdvance;
        y = glyph.yOffset + yAdvance;

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

        var gw = x + glyphW - bx;
        var gh = y + glyphH - by;

        if (bw < gw)
        {
            bw = gw;
        }

        if (bh < gh)
        {
            bh = gh;
        }

        xAdvance += glyph.xAdvance + letterSpacing;
        indexCount += 1;
        lastGlyph = glyph;
        lastCharCode = charCode;
    }

    var scale = (src.fontSize / src.fontData.size);
    var sx = scale * src.scaleX;
    var sy = scale * src.scaleY;

    var out = {
        local: {
            x: bx * scale,
            y: by * scale,
            width: bw * scale,
            height: bh * scale
        },
        global: {
            x: src.x + (bx * sx),
            y: src.y + (by * sy),
            width: bw * sx,
            height: bh * sy
        }
    };

    if (round)
    {
        out.local.x = Math.round(out.local.x);
        out.local.y = Math.round(out.local.y);
        out.local.width = Math.round(out.local.width);
        out.local.height = Math.round(out.local.height);

        out.global.x = Math.round(out.global.x);
        out.global.y = Math.round(out.global.y);
        out.global.width = Math.round(out.global.width);
        out.global.height = Math.round(out.global.height);
    }

    return out;
};

module.exports = GetBitmapTextSize;
