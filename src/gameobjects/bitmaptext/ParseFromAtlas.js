/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var ParseXMLBitmapFont = require('./ParseXMLBitmapFont');

/**
 * Parse an XML Bitmap Font from an Atlas.
 *
 * Adds the parsed Bitmap Font data to the cache with the `fontName` key.
 *
 * @function ParseFromAtlas
 * @since 3.0.0
 * @private
 *
 * @param {Phaser.Scene} scene - The Scene to parse the Bitmap Font for.
 * @param {string} fontName - The key of the font to add to the Bitmap Font cache.
 * @param {string} textureKey - The key of the BitmapFont's texture.
 * @param {string} frameKey - The key of the BitmapFont texture's frame.
 * @param {string} xmlKey - The key of the XML data of the font to parse.
 * @param {integer} [xSpacing] - The x-axis spacing to add between each letter.
 * @param {integer} [ySpacing] - The y-axis spacing to add to the line height.
 *
 * @return {boolean} Whether the parsing was successful or not.
 */
var ParseFromAtlas = function (scene, fontName, textureKey, frameKey, xmlKey, xSpacing, ySpacing)
{
    var frame = scene.sys.textures.getFrame(textureKey, frameKey);
    var xml = scene.sys.cache.xml.get(xmlKey);

    if (frame && xml)
    {
        var data = ParseXMLBitmapFont(xml, xSpacing, ySpacing, frame);

        scene.sys.cache.bitmapFont.add(fontName, { data: data, texture: textureKey, frame: frameKey });

        return true;
    }
    else
    {
        return false;
    }
};

module.exports = ParseFromAtlas;
