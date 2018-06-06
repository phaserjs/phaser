/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

/**
 * @function getValue
 * @since 3.0.0
 * @private
 */
function getValue (node, attribute)
{
    return parseInt(node.getAttribute(attribute), 10);
}

// TODO: These typedefs should be kept somewhere else.
// TODO: Elaborate on the kerning property description.

/**
 * The font data for an individual character of a Bitmap Font.
 *
 * Describes the character's position, size, offset and kerning.
 *
 * @typedef {object} BitmapFontCharacterData
 *
 * @property {number} x - The x position of the character.
 * @property {number} y - The y position of the character.
 * @property {number} width - The width of the character.
 * @property {number} height - The height of the character.
 * @property {number} centerX - The center x position of the character.
 * @property {number} centerY - The center y position of the character.
 * @property {number} xOffset - The x offset of the character.
 * @property {number} yOffset - The y offset of the character.
 * @property {object} data - Extra data for the character.
 * @property {object} kerning - Kerning values. [description]
 */

/**
 * Bitmap Font data that can be used by a BitmapText Game Object.
 *
 * @typedef {object} BitmapFontData
 *
 * @property {string} font - The name of the font.
 * @property {number} size - The size of the font.
 * @property {number} lineHeight - The line height of the font.
 * @property {boolean} retroFont - Whether this font is a retro font (monospace).
 * @property {Object.<number, BitmapFontCharacterData>} chars - The character data of the font, keyed by character code. Each character datum includes a position, size, offset and more.
 */

/**
 * Parse an XML font so you can pass it to the BitmapText constructor and create a BitmapText object.
 *
 * @function ParseXMLBitmapFont
 * @since 3.0.0
 * @private
 *
 * @param {XMLDocument} xml - The XML Document to parse the font from.
 * @param {integer} [xSpacing=0] - The x-axis spacing to add between each letter.
 * @param {integer} [ySpacing=0] - The y-axis spacing to add to the line height.
 * @param {Phaser.Textures.Frame} [frame] - The texture frame to take into account while parsing.
 *
 * @return {BitmapFontData} The parsed Bitmap Font data.
 */
var ParseXMLBitmapFont = function (xml, xSpacing, ySpacing, frame)
{
    if (xSpacing === undefined) { xSpacing = 0; }
    if (ySpacing === undefined) { ySpacing = 0; }

    var data = {};
    var info = xml.getElementsByTagName('info')[0];
    var common = xml.getElementsByTagName('common')[0];

    data.font = info.getAttribute('face');
    data.size = getValue(info, 'size');
    data.lineHeight = getValue(common, 'lineHeight') + ySpacing;
    data.chars = {};

    var letters = xml.getElementsByTagName('char');

    var adjustForTrim = (frame !== undefined && frame.trimmed);

    if (adjustForTrim)
    {
        var top = frame.height;
        var left = frame.width;
    }

    for (var i = 0; i < letters.length; i++)
    {
        var node = letters[i];

        var charCode = getValue(node, 'id');
        var gx = getValue(node, 'x');
        var gy = getValue(node, 'y');
        var gw = getValue(node, 'width');
        var gh = getValue(node, 'height');

        //  Handle frame trim issues

        if (adjustForTrim)
        {
            if (gx < left)
            {
                left = gx;
            }

            if (gy < top)
            {
                top = gy;
            }
        }

        data.chars[charCode] =
        {
            x: gx,
            y: gy,
            width: gw,
            height: gh,
            centerX: Math.floor(gw / 2),
            centerY: Math.floor(gh / 2),
            xOffset: getValue(node, 'xoffset'),
            yOffset: getValue(node, 'yoffset'),
            xAdvance: getValue(node, 'xadvance') + xSpacing,
            data: {},
            kerning: {}
        };
    }

    if (adjustForTrim && top !== 0 && left !== 0)
    {
        // console.log('top and left', top, left, frame.x, frame.y);

        //  Now we know the top and left coordinates of the glyphs in the original data
        //  so we can work out how much to adjust the glyphs by

        for (var code in data.chars)
        {
            var glyph = data.chars[code];

            glyph.x -= frame.x;
            glyph.y -= frame.y;
        }
    }

    var kernings = xml.getElementsByTagName('kerning');

    for (i = 0; i < kernings.length; i++)
    {
        var kern = kernings[i];

        var first = getValue(kern, 'first');
        var second = getValue(kern, 'second');
        var amount = getValue(kern, 'amount');

        data.chars[second].kerning[first] = amount;
    }

    return data;
};

module.exports = ParseXMLBitmapFont;
