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

/**
 * @function ParseXMLBitmapFont
 * @since 3.0.0
 * @private
 *
 * @param {XMLDocument} xml - [description]
 * @param {integer} [xSpacing=0] - [description]
 * @param {integer} [ySpacing=0] - [description]
 * @param {Phaser.Textures.Frame} [frame] - [description]
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
