/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

var Pick = require('./Pick');
var ParseGID = require('./ParseGID');

var copyPoints = function (p) { return { x: p.x, y: p.y }; };

var commonObjectProps = [ 'id', 'name', 'type', 'rotation', 'properties', 'visible', 'x', 'y', 'width', 'height' ];

/**
 * [description]
 *
 * @function Phaser.Tilemaps.Parsers.Tiled.ParseObject
 * @since 3.0.0
 *
 * @param {object} tiledObject - [description]
 * @param {number} [offsetX=0] - [description]
 * @param {number} [offsetY=0] - [description]
 *
 * @return {object} [description]
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
