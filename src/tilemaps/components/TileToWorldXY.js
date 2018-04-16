/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

var TileToWorldX = require('./TileToWorldX');
var TileToWorldY = require('./TileToWorldY');
var Vector2 = require('../../math/Vector2');

/**
 * Converts from tile XY coordinates (tile units) to world XY coordinates (pixels), factoring in the
 * layer's position, scale and scroll. This will return a new Vector2 object or update the given
 * `point` object.
 *
 * @function Phaser.Tilemaps.Components.TileToWorldXY
 * @private
 * @since 3.0.0
 *
 * @param {integer} tileX - [description]
 * @param {integer} tileY - [description]
 * @param {Phaser.Math.Vector2} [point] - [description]
 * @param {Phaser.Cameras.Scene2D.Camera} [camera=main camera] - [description]
 * @param {Phaser.Tilemaps.LayerData} layer - The Tilemap Layer to act upon.
 * 
 * @return {Phaser.Math.Vector2} The XY location in world coordinates.
 */
var TileToWorldXY = function (tileX, tileY, point, camera, layer)
{
    if (point === undefined) { point = new Vector2(0, 0); }

    point.x = TileToWorldX(tileX, camera, layer);
    point.y = TileToWorldY(tileY, camera, layer);

    return point;
};

module.exports = TileToWorldXY;
