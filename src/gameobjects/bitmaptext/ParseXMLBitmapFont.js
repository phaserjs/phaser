/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * Read an integer value from an XML Node.
 *
 * @function getValue
 * @since 3.0.0
 * @private
 *
 * @param {Node} node - The XML Node.
 * @param {string} attribute - The attribute to read.
 *
 * @return {number} The parsed value.
 */
function getValue (node, attribute)
{
    return parseInt(node.getAttribute(attribute), 10);
}

/**
 * Parse an XML font to Bitmap Font data for the Bitmap Font cache.
 *
 * @function ParseXMLBitmapFont
 * @since 3.0.0
 * @private
 *
 * @param {XMLDocument} xml - The XML Document to parse the font from.
 * @param {Phaser.Textures.Frame} frame - The texture frame to take into account when creating the uv data.
 * @param {number} [xSpacing=0] - The x-axis spacing to add between each letter.
 * @param {number} [ySpacing=0] - The y-axis spacing to add to the line height.
 * @param {Phaser.Textures.Texture} [texture] - If provided, each glyph in the Bitmap Font will be added to this texture as a frame.
 *
 * @return {Phaser.Types.GameObjects.BitmapText.BitmapFontData} The parsed Bitmap Font data.
 */
var ParseXMLBitmapFont = function (xml, frame, xSpacing, ySpacing, texture)
{
    if (xSpacing === undefined) { xSpacing = 0; }
    if (ySpacing === undefined) { ySpacing = 0; }

    var textureX = frame.cutX;
    var textureY = frame.cutY;
    var textureWidth = frame.source.width;
    var textureHeight = frame.source.height;
    var sourceIndex = frame.sourceIndex;

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
        var letter = String.fromCharCode(charCode);
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

        if (adjustForTrim && top !== 0 && left !== 0)
        {
            //  Now we know the top and left coordinates of the glyphs in the original data
            //  so we can work out how much to adjust the glyphs by

            gx -= frame.x;
            gy -= frame.y;
        }

        var u0 = (textureX + gx) / textureWidth;
        var v0 = (textureY + gy) / textureHeight;
        var u1 = (textureX + gx + gw) / textureWidth;
        var v1 = (textureY + gy + gh) / textureHeight;

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
            kerning: {},
            u0: u0,
            v0: v0,
            u1: u1,
            v1: v1
        };

        if (texture && gw !== 0 && gh !== 0)
        {
            var charFrame = texture.add(letter, sourceIndex, gx, gy, gw, gh);

            if (charFrame)
            {
                charFrame.setUVs(gw, gh, u0, v0, u1, v1);
            }
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
