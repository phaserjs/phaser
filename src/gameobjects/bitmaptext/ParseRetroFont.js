/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var GetValue = require('../../utils/object/GetValue');

/**
 * Parses a Retro Font configuration object so you can pass it to the BitmapText constructor
 * and create a BitmapText object using a fixed-width retro font.
 *
 * @function Phaser.GameObjects.RetroFont.Parse
 * @since 3.0.0
 *
 * @param {Phaser.Scene} scene - A reference to the Phaser Scene.
 * @param {Phaser.Types.GameObjects.BitmapText.RetroFontConfig} config - The font configuration object.
 *
 * @return {Phaser.Types.GameObjects.BitmapText.BitmapFontData} A parsed Bitmap Font data entry for the Bitmap Font cache.
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
        var v0 = (textureY + y) / textureHeight;
        var u1 = (textureX + x + w) / textureWidth;
        var v1 = (textureY + y + h) / textureHeight;

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
