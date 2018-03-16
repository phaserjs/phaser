/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

var ParseXMLBitmapFont = require('./ParseXMLBitmapFont');

/**
 * [description]
 *
 * @function ParseFromAtlas
 * @since 3.0.0
 * @private
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
