/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var GetValue = require('../../utils/object/GetValue');

/**
 * Parses a Retro Font configuration object and builds a `BitmapFontData` structure that can
 * be passed to the BitmapText constructor to render text using a fixed-width retro font.
 *
 * A retro font is a texture containing a uniform grid of characters, each cell being the same
 * width and height. This function reads the configuration, looks up the source texture frame,
 * then iterates over every character defined in `config.chars`, calculating its pixel position
 * and normalised UV coordinates within the texture. The resulting data object maps each
 * character code to its own glyph entry and is suitable for registering in the Bitmap Font cache.
 *
 * If `config.chars` is an empty string the function returns `undefined` without producing any data.
 *
 * @function Phaser.GameObjects.RetroFont.Parse
 * @since 3.0.0
 *
 * @param {Phaser.Scene} scene - A reference to the Phaser Scene.
 * @param {Phaser.Types.GameObjects.BitmapText.RetroFontConfig} config - The font configuration object.
 *
 * @return {Phaser.Types.GameObjects.BitmapText.BitmapFontData} A parsed Bitmap Font data entry containing per-character glyph data and UV coordinates, ready for the Bitmap Font cache.
 */
var ParseRetroFont = function (scene, config)
{
    var w = config.width;
    var h = config.height;

    var cx = Math.floor(w / 2);
    var cy = Math.floor(h / 2);

    var letters = GetValue(config, 'chars', '');

    if (letters === '')
    {
        return;
    }

    var key = GetValue(config, 'image', '');

    var frame = scene.sys.textures.getFrame(key);
    var textureX = frame.cutX;
    var textureY = frame.cutY;
    var textureWidth = frame.source.width;
    var textureHeight = frame.source.height;

    var offsetX = GetValue(config, 'offset.x', 0);
    var offsetY = GetValue(config, 'offset.y', 0);
    var spacingX = GetValue(config, 'spacing.x', 0);
    var spacingY = GetValue(config, 'spacing.y', 0);
    var lineSpacing = GetValue(config, 'lineSpacing', 0);

    var charsPerRow = GetValue(config, 'charsPerRow', null);

    if (charsPerRow === null)
    {
        charsPerRow = textureWidth / w;

        if (charsPerRow > letters.length)
        {
            charsPerRow = letters.length;
        }
    }

    var x = offsetX;
    var y = offsetY;

    var data = {
        retroFont: true,
        font: key,
        size: w,
        lineHeight: h + lineSpacing,
        chars: {}
    };

    var r = 0;

    for (var i = 0; i < letters.length; i++)
    {
        var charCode = letters.charCodeAt(i);

        var u0 = (textureX + x) / textureWidth;
        var v0 = 1 - (textureY + y) / textureHeight;
        var u1 = (textureX + x + w) / textureWidth;
        var v1 = 1 - (textureY + y + h) / textureHeight;

        data.chars[charCode] =
        {
            x: x,
            y: y,
            width: w,
            height: h,
            centerX: cx,
            centerY: cy,
            xOffset: 0,
            yOffset: 0,
            xAdvance: w,
            data: {},
            kerning: {},
            u0: u0,
            v0: v0,
            u1: u1,
            v1: v1
        };

        r++;

        if (r === charsPerRow)
        {
            r = 0;
            x = offsetX;
            y += h + spacingY;
        }
        else
        {
            x += w + spacingX;
        }
    }

    var entry = {
        data: data,
        frame: null,
        texture: key
    };

    return entry;
};

module.exports = ParseRetroFont;
