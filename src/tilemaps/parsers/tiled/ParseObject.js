/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2019 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

var Pick = require('./Pick');
var ParseGID = require('./ParseGID');

var copyPoints = function (p) { return { x: p.x, y: p.y }; };

var commonObjectProps = [ 'id', 'name', 'type', 'rotation', 'properties', 'visible', 'x', 'y', 'width', 'height' ];

/**
 * Convert a Tiled object to an internal parsed object normalising and copying properties over, while applying optional x and y offsets. The parsed object will always have the properties `id`, `name`, `type`, `rotation`, `properties`, `visible`, `x`, `y`, `width` and `height`. Other properties will be added according to the object type (such as text, polyline, gid etc.)
 *
 * @function Phaser.Tilemaps.Parsers.Tiled.ParseObject
 * @since 3.0.0
 *
 * @param {object} tiledObject - Tiled object to convert to an internal parsed object normalising and copying properties over.
 * @param {number} [offsetX=0] - Optional additional offset to apply to the object's x property. Defaults to 0.
 * @param {number} [offsetY=0] - Optional additional offset to apply to the object's y property. Defaults to 0.
 *
 * @return {object} The parsed object containing properties read from the Tiled object according to it's type with x and y values updated according to the given offsets.
 */
var ParseObject = function (tiledObject, offsetX, offsetY)
{
    if (offsetX === undefined) { offsetX = 0; }
    if (offsetY === undefined) { offsetY = 0; }

    var parsedObject = Pick(tiledObject, commonObjectProps);

    parsedObject.x += offsetX;
    parsedObject.y += offsetY;

    if (tiledObject.gid)
    {
        //  Object tiles
        var gidInfo = ParseGID(tiledObject.gid);
        parsedObject.gid = gidInfo.gid;
        parsedObject.flippedHorizontal = gidInfo.flippedHorizontal;
        parsedObject.flippedVertical = gidInfo.flippedVertical;
        parsedObject.flippedAntiDiagonal = gidInfo.flippedAntiDiagonal;
    }
    else if (tiledObject.polyline)
    {
        parsedObject.polyline = tiledObject.polyline.map(copyPoints);
    }
    else if (tiledObject.polygon)
    {
        parsedObject.polygon = tiledObject.polygon.map(copyPoints);
    }
    else if (tiledObject.ellipse)
    {
        parsedObject.ellipse = tiledObject.ellipse;
        parsedObject.width = tiledObject.width;
        parsedObject.height = tiledObject.height;
    }
    else if (tiledObject.text)
    {
        parsedObject.width = tiledObject.width;
        parsedObject.height = tiledObject.height;
        parsedObject.text = tiledObject.text;
    }
    else
    {
        // Otherwise, assume it is a rectangle
        parsedObject.rectangle = true;
        parsedObject.width = tiledObject.width;
        parsedObject.height = tiledObject.height;
    }

    return parsedObject;
};

module.exports = ParseObject;
