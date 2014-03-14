/**
* @author       Richard Davey <rich@photonstorm.com>
* @copyright    2014 Photon Storm Ltd.
* @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
*/

/**
* Phaser.LoaderParser parses data objects from Phaser.Loader that need more preparation before they can be inserted into the Cache.
*
* @class Phaser.LoaderParser
*/
Phaser.LoaderParser = {

    /**
    * Parse a Bitmap Font from an XML file.
    * @method Phaser.LoaderParser.bitmapFont
    * @param {Phaser.Game} game - A reference to the current game.
    * @param {object} xml - XML data you want to parse.
    * @param {string} cacheKey - The key of the texture this font uses in the cache.
    */
    bitmapFont: function (game, xml, cacheKey, xSpacing, ySpacing) {

        if (!xml || /MSIE 9/i.test(navigator.userAgent))
        {
            if (typeof(window.DOMParser) === 'function')
            {
                var domparser = new DOMParser();
                xml = domparser.parseFromString(this.ajaxRequest.responseText, 'text/xml');
            }
            else
            {
                var div = document.createElement('div');
                div.innerHTML = this.ajaxRequest.responseText;
                xml = div;
            }
        }

        var data = {};
        var info = xml.getElementsByTagName('info')[0];
        var common = xml.getElementsByTagName('common')[0];

        data.font = info.getAttribute('face');
        data.size = parseInt(info.getAttribute('size'), 10);
        data.lineHeight = parseInt(common.getAttribute('lineHeight'), 10) + ySpacing;
        data.chars = {};

        var letters = xml.getElementsByTagName('char');
        var texture = PIXI.TextureCache[cacheKey];

        for (var i = 0; i < letters.length; i++)
        {
            var charCode = parseInt(letters[i].getAttribute('id'), 10);

            var textureRect = new PIXI.Rectangle(
                parseInt(letters[i].getAttribute('x'), 10),
                parseInt(letters[i].getAttribute('y'), 10),
                parseInt(letters[i].getAttribute('width'), 10),
                parseInt(letters[i].getAttribute('height'), 10)
            );

            data.chars[charCode] = {
                xOffset: parseInt(letters[i].getAttribute('xoffset'), 10),
                yOffset: parseInt(letters[i].getAttribute('yoffset'), 10),
                xAdvance: parseInt(letters[i].getAttribute('xadvance'), 10) + xSpacing,
                kerning: {},
                texture: PIXI.TextureCache[cacheKey] = new PIXI.Texture(texture, textureRect)
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

        PIXI.BitmapText.fonts[cacheKey] = data;

    }

};
