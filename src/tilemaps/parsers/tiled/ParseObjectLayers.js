/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2019 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

var GetFastValue = require('../../../utils/object/GetFastValue');
var ParseObject = require('./ParseObject');
var ObjectLayer = require('../../mapdata/ObjectLayer');

/**
 * Parses a Tiled JSON object into an array of ObjectLayer objects.
 *
 * @function Phaser.Tilemaps.Parsers.Tiled.ParseObjectLayers
 * @since 3.0.0
 *
 * @param {object} json - The Tiled JSON object.
 *
 * @return {array} An array of all object layers in the tilemap as `ObjectLayer`s.
 */
var ParseObjectLayers = function (json)
{
    var objectLayers = [];

    for (var i = 0; i < json.layers.length; i++)
    {
        if (json.layers[i].type !== 'objectgroup')
        {
            continue;
        }

        var curo = json.layers[i];
        var offsetX = GetFastValue(curo, 'offsetx', 0);
        var offsetY = GetFastValue(curo, 'offsety', 0);
        var objects = [];

        for (var j = 0; j < curo.objects.length; j++)
        {
            var parsedObject = ParseObject(curo.objects[j], offsetX, offsetY);

            objects.push(parsedObject);
        }

        var objectLayer = new ObjectLayer(curo);
        objectLayer.objects = objects;

        objectLayers.push(objectLayer);
    }

    return objectLayers;
};

module.exports = ParseObjectLayers;
