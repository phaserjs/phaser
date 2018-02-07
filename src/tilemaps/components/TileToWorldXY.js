var TileToWorldX = require('./TileToWorldX');
var TileToWorldY = require('./TileToWorldY');
var Vector2 = require('../../math/Vector2');

/**
 * Converts from tile XY coordinates (tile units) to world XY coordinates (pixels), factoring in the
 * layer's position, scale and scroll. This will return a new Vector2 object or update the given
 * `point` object.
 *
 * @param {integer} tileX - [description]
 * @param {integer} tileY - [description]
 * @param {Vector2} [point] - [description]
 * @param {Camera} [camera=main camera] - [description]
 * @param {LayerData} layer - [description]
 * @return {Vector2} The XY location in world coordinates.
 */
var TileToWorldXY = function (tileX, tileY, point, camera, layer)
{
    if (point === undefined) { point = new Vector2(0, 0); }

    point.x = TileToWorldX(tileX, camera, layer);
    point.y = TileToWorldY(tileY, camera, layer);

    return point;
};

module.exports = TileToWorldXY;
