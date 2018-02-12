/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

var GetFastValue = require('../../../utils/object/GetFastValue');

/**
 * [description]
 *
 * @function Phaser.Tilemaps.Parsers.Tiled.ParseImageLayers
 * @since 3.0.0
 *
 * @param {object} json - [description]
 *
 * @return {array} [description]
 */
var ParseImageLayers = function (json)
{
    var images = [];

    for (var i = 0; i < json.layers.length; i++)
    {
        if (json.layers[i].type !== 'imagelayer')
        {
            continue;
        }

        var curi = json.layers[i];

        images.push({
            name: curi.name,
            image: curi.image,
            x: GetFastValue(curi, 'offsetx', 0) + curi.x,
            y: GetFastValue(curi, 'offsety', 0) + curi.y,
            alpha: curi.opacity,
            visible: curi.visible,
            properties: GetFastValue(curi, 'properties', {})
        });
    }

    return images;
};

module.exports = ParseImageLayers;
