var WorldToTileX = require('./WorldToTileX');
var WorldToTileY = require('./WorldToTileY');
var Vector2 = require('../../../math/Vector2');

var WorldToTileXY = function (worldX, worldY, snapToFloor, point, camera, layer)
{
    if (point === undefined) { point = new Vector2(0, 0); }

    point.x = WorldToTileX(worldX, snapToFloor, camera, layer);
    point.y = WorldToTileY(worldY, snapToFloor, camera, layer);

    return point;
};

module.exports = WorldToTileXY;
