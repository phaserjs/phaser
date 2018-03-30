/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

var GetValue = require('../../utils/object/GetValue');

// * @param {number} characterWidth - The width of each character in the font set.
// * @param {number} characterHeight - The height of each character in the font set.
// * @param {string} chars - The characters used in the font set, in display order. You can use the TEXT_SET consts for common font set arrangements.
// * @param {number} [charsPerRow] - The number of characters per row in the font set. If not given charsPerRow will be the image width / characterWidth.
// * @param {number} [xSpacing=0] - If the characters in the font set have horizontal spacing between them set the required amount here.
// * @param {number} [ySpacing=0] - If the characters in the font set have vertical spacing between them set the required amount here.
// * @param {number} [xOffset=0] - If the font set doesn't start at the top left of the given image, specify the X coordinate offset here.
// * @param {number} [yOffset=0] - If the font set doesn't start at the top left of the given image, specify the Y coordinate offset here.
// Phaser.GameObject.RetroFont = function (game, key, characterWidth, characterHeight, chars, charsPerRow, xSpacing, ySpacing, xOffset, yOffset)

// {
//      image: key,
//      width: 32,
//      height: 32,
//      chars: 'string',
//      charsPerRow: null,
//      spacing: { x: 0, y: 0 },
//      offset: { x: 0, y: 0 }
// }

/**
 * [description]
 *
 * @function ParseRetroFont
 * @since 3.0.0
 * @private
 */
var ParseRetroFont = function (scene, config)
{
    var w = config.width;
    var h = config.height;
    var cx = Math.floor(w / 2);
    var cy = Math.floor(h / 2);
    var letters = config.chars;

    var key = GetValue(config, 'image', '');
    var offsetX = GetValue(config, 'offset.x', 0);
    var offsetY = GetValue(config, 'offset.y', 0);
    var spacingX = GetValue(config, 'spacing.x', 0);
    var spacingY = GetValue(config, 'spacing.y', 0);

    var charsPerRow = GetValue(config, 'charsPerRow', null);

    if (charsPerRow === null)
    {
        charsPerRow = scene.sys.textures.getFrame(key).width / w;

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
        lineHeight: h,
        chars: {}
    };

    var r = 0;

    for (var i = 0; i < letters.length; i++)
    {
        // var node = letters[i];

        var charCode = letters.charCodeAt(i);

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
            kerning: {}
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

/**
* Text Set 1 =  !\"#$%&'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}~
* @constant
* @type {string}
*/
ParseRetroFont.TEXT_SET1 = ' !"#$%&\'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}~';

/**
* Text Set 2 =  !"#$%&'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ
* @constant
* @type {string}
*/
ParseRetroFont.TEXT_SET2 = ' !"#$%&\'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ';

/**
* Text Set 3 = ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789 
* @constant
* @type {string}
*/
ParseRetroFont.TEXT_SET3 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789 ';

/**
* Text Set 4 = ABCDEFGHIJKLMNOPQRSTUVWXYZ 0123456789
* @constant
* @type {string}
*/
ParseRetroFont.TEXT_SET4 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ 0123456789';

/**
* Text Set 5 = ABCDEFGHIJKLMNOPQRSTUVWXYZ.,/() '!?-*:0123456789
* @constant
* @type {string}
*/
ParseRetroFont.TEXT_SET5 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ.,/() \'!?-*:0123456789';

/**
* Text Set 6 = ABCDEFGHIJKLMNOPQRSTUVWXYZ!?:;0123456789"(),-.' 
* @constant
* @type {string}
*/
ParseRetroFont.TEXT_SET6 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ!?:;0123456789"(),-.\' ';

/**
* Text Set 7 = AGMSY+:4BHNTZ!;5CIOU.?06DJPV,(17EKQW")28FLRX-'39
* @constant
* @type {string}
*/
ParseRetroFont.TEXT_SET7 = 'AGMSY+:4BHNTZ!;5CIOU.?06DJPV,(17EKQW")28FLRX-\'39';

/**
* Text Set 8 = 0123456789 .ABCDEFGHIJKLMNOPQRSTUVWXYZ
* @constant
* @type {string}
*/
ParseRetroFont.TEXT_SET8 = '0123456789 .ABCDEFGHIJKLMNOPQRSTUVWXYZ';

/**
* Text Set 9 = ABCDEFGHIJKLMNOPQRSTUVWXYZ()-0123456789.:,'"?!
* @constant
* @type {string}
*/
ParseRetroFont.TEXT_SET9 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ()-0123456789.:,\'"?!';

/**
* Text Set 10 = ABCDEFGHIJKLMNOPQRSTUVWXYZ
* @constant
* @type {string}
*/
ParseRetroFont.TEXT_SET10 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

/**
* Text Set 11 = ABCDEFGHIJKLMNOPQRSTUVWXYZ.,"-+!?()':;0123456789
* @constant
* @type {string}
*/
ParseRetroFont.TEXT_SET11 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ.,"-+!?()\':;0123456789';

module.exports = ParseRetroFont;
