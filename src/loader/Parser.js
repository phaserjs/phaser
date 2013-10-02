/**
* @author       Richard Davey <rich@photonstorm.com>
* @copyright    2013 Photon Storm Ltd.
* @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
*/

/**
* Phaser.Loader.Parser parses data objects from Phaser.Loader that need more preparation before they can be inserted into the Cache.
*
* @class Phaser.Loader.Parser
*/
Phaser.Loader.Parser = {
	
    /**
    * Parse frame data from an XML file.
    * @method Phaser.Loader.Parser.bitmapFont
    * @param {object} xml - XML data you want to parse.
    * @return {FrameData} Generated FrameData object.
    */
	bitmapFont: function (game, xml, cacheKey) {

        //  Malformed?
        if (!xml.getElementsByTagName('font'))
        {
            console.warn("Phaser.Loader.Parser.bitmapFont: Invalid XML given, missing <font> tag");
            return;
        }

        var texture = PIXI.TextureCache[cacheKey];

        var data = {};
        var info = xml.getElementsByTagName("info")[0];
        var common = xml.getElementsByTagName("common")[0];
        data.font = info.attributes.getNamedItem("face").nodeValue;
        data.size = parseInt(info.attributes.getNamedItem("size").nodeValue, 10);
        data.lineHeight = parseInt(common.attributes.getNamedItem("lineHeight").nodeValue, 10);
        data.chars = {};

        //parse letters
        var letters = xml.getElementsByTagName("char");

        for (var i = 0; i < letters.length; i++)
        {
            var charCode = parseInt(letters[i].attributes.getNamedItem("id").nodeValue, 10);

            var textureRect = {
                x: parseInt(letters[i].attributes.getNamedItem("x").nodeValue, 10),
                y: parseInt(letters[i].attributes.getNamedItem("y").nodeValue, 10),
                width: parseInt(letters[i].attributes.getNamedItem("width").nodeValue, 10),
                height: parseInt(letters[i].attributes.getNamedItem("height").nodeValue, 10)
            };

            //	Note: This means you can only have 1 BitmapFont loaded at once!
            //	Need to replace this with our own handler soon.
            PIXI.TextureCache[charCode] = new PIXI.Texture(texture, textureRect);

            data.chars[charCode] = {
                xOffset: parseInt(letters[i].attributes.getNamedItem("xoffset").nodeValue, 10),
                yOffset: parseInt(letters[i].attributes.getNamedItem("yoffset").nodeValue, 10),
                xAdvance: parseInt(letters[i].attributes.getNamedItem("xadvance").nodeValue, 10),
                kerning: {},
                texture:new PIXI.Texture(texture, textureRect)

            };
        }

        //parse kernings
        var kernings = xml.getElementsByTagName("kerning");

        for (i = 0; i < kernings.length; i++)
        {
           var first = parseInt(kernings[i].attributes.getNamedItem("first").nodeValue, 10);
           var second = parseInt(kernings[i].attributes.getNamedItem("second").nodeValue, 10);
           var amount = parseInt(kernings[i].attributes.getNamedItem("amount").nodeValue, 10);

            data.chars[second].kerning[first] = amount;
        }

        PIXI.BitmapText.fonts[data.font] = data;

    }

};