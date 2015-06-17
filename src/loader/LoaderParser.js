/**
* @author       Richard Davey <rich@photonstorm.com>
* @copyright    2015 Photon Storm Ltd.
* @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
*/

/**
* Phaser.LoaderParser parses data objects from Phaser.Loader that need more preparation before they can be inserted into the Cache.
*
* @class Phaser.LoaderParser
*/
Phaser.LoaderParser = {

    /**
    * Alias for xmlBitmapFont, for backwards compatiblity.
    * 
    * @method Phaser.LoaderParser.bitmapFont
    * @param {Phaser.Game} game - A reference to the current game.
    * @param {object} xml - XML data you want to parse.
    * @param {string} cacheKey - The key of the texture this font uses in the cache.
    * @param {number} [xSpacing=0] - Additional horizontal spacing between the characters.
    * @param {number} [ySpacing=0] - Additional vertical spacing between the characters.
    */
    bitmapFont: function (game, xml, cacheKey, xSpacing, ySpacing) {
        this.xmlBitmapFont(game, xml, cacheKey, xSpacing, ySpacing);
    },

    /**
    * Parse a Bitmap Font from an XML file.
    *
    * @method Phaser.LoaderParser.xmlBitmapFont
    * @param {Phaser.Game} game - A reference to the current game.
    * @param {object} xml - XML data you want to parse.
    * @param {string} cacheKey - The key of the texture this font uses in the cache.
    * @param {number} [xSpacing=0] - Additional horizontal spacing between the characters.
    * @param {number} [ySpacing=0] - Additional vertical spacing between the characters.
    */
    xmlBitmapFont: function (game, xml, cacheKey, xSpacing, ySpacing) {
        var data = {};
        var info = xml.getElementsByTagName('info')[0];
        var common = xml.getElementsByTagName('common')[0];

        data.font = info.getAttribute('face');
        data.size = parseInt(info.getAttribute('size'), 10);
        data.lineHeight = parseInt(common.getAttribute('lineHeight'), 10) + ySpacing;
        data.chars = {};

        var letters = xml.getElementsByTagName('char');

        for (var i = 0; i < letters.length; i++)
        {
            var charCode = parseInt(letters[i].getAttribute('id'), 10);

            data.chars[charCode] = {
                x: parseInt(letters[i].getAttribute('x'), 10),
                y: parseInt(letters[i].getAttribute('y'), 10),
                width: parseInt(letters[i].getAttribute('width'), 10),
                height: parseInt(letters[i].getAttribute('height'), 10),
                xOffset: parseInt(letters[i].getAttribute('xoffset'), 10),
                yOffset: parseInt(letters[i].getAttribute('yoffset'), 10),
                xAdvance: parseInt(letters[i].getAttribute('xadvance'), 10) + xSpacing,
                kerning: {}
            };
        }

        var kernings = xml.getElementsByTagName('kerning');

        for (i = 0; i < kernings.length; i++)
        {
            var first = parseInt(kernings[i].getAttribute('first'), 10);
            var second = parseInt(kernings[i].getAttribute('second'), 10);
            var amount = parseInt(kernings[i].getAttribute('amount'), 10);

            data.chars[second].kerning[first] = amount;
        }

        this.finalizeBitmapFont(cacheKey, data);
    },

    /**
    * Parse a Bitmap Font from a JSON file.
    *
    * @method Phaser.LoaderParser.jsonBitmapFont
    * @param {Phaser.Game} game - A reference to the current game.
    * @param {object} json - JSON data you want to parse.
    * @param {string} cacheKey - The key of the texture this font uses in the cache.
    * @param {number} [xSpacing=0] - Additional horizontal spacing between the characters.
    * @param {number} [ySpacing=0] - Additional vertical spacing between the characters.
    */
    jsonBitmapFont: function (game, json, cacheKey, xSpacing, ySpacing) {
        var data = {
            font: json.font.info._font,
            size: parseInt(json.font.info._size, 10),
            lineHeight: parseInt(json.font.common._lineHeight, 10) + ySpacing,
            chars: {}
        };

        json.font.chars["char"].forEach(
            function parseChar(letter) {
                var charCode = parseInt(letter._id, 10);

                data.chars[charCode] = {
                    x: parseInt(letter._x, 10),
                    y: parseInt(letter._y, 10),
                    width: parseInt(letter._width, 10),
                    height: parseInt(letter._height, 10),
                    xOffset: parseInt(letter._xoffset, 10),
                    yOffset: parseInt(letter._yoffset, 10),
                    xAdvance: parseInt(letter._xadvance, 10) + xSpacing,
                    kerning: {}
                };
            }
        );

        json.font.kernings.kerning.forEach(
            function parseKerning(kerning) {
                data.chars[kerning._second].kerning[kerning._first] = parseInt(kerning._amount, 10);
            }
        );

        this.finalizeBitmapFont(cacheKey, data);
    },

    /**
    * Finalize Bitmap Font parsing.
    *
    * @method Phaser.LoaderParser.finalizeBitmapFont
    * @private
    * @param {string} cacheKey - The key of the texture this font uses in the cache.
    * @param {object} bitmapFontData - Pre-parsed bitmap font data.
   */
    finalizeBitmapFont: function (cacheKey, bitmapFontData) {
        Object.keys(bitmapFontData.chars).forEach(
            function addTexture(charCode) {
                var letter = bitmapFontData.chars[charCode];
                var textureRect = new PIXI.Rectangle(
                    letter.x, letter.y,
                    letter.width, letter.height
                );

                letter.texture = new PIXI.Texture(PIXI.BaseTextureCache[cacheKey], textureRect);
            }
        );

        PIXI.BitmapText.fonts[cacheKey] = bitmapFontData;
    }
};
