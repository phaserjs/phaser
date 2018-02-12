/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

var WorldToTileX = require('./WorldToTileX');
var WorldToTileY = require('./WorldToTileY');
var Vector2 = require('../../math/Vector2');

/**
 * Converts from world XY coordinates (pixels) to tile XY coordinates (tile units), factoring in the
 * layer's position, scale and scroll. This will return a new Vector2 object or update the given
 * `point` object.
 *
 * @function Phaser.Tilemaps.Components.WorldToTileXY
 * @since 3.0.0
 *
 * @param {number} worldX - [description]
 * @param {number} worldY - [description]
 * @param {boolean} [snapToFloor=true] - Whether or not to round the tile coordinate down to the
 * nearest integer.
 * @param {Phaser.Math.Vector2} [point] - [description]
 * @param {Phaser.Cameras.Scene2D.Camera} [camera=main camera] - [description]
 * @param {Phaser.Tilemaps.LayerData} layer - The Tilemap Layer to act upon.
 * 
 * @return {Phaser.Math.Vector2} The XY location in tile units.
 */
var WorldToTileXY = function (worldX, worldY, snapToFloor, point, camera, layer)
{
    if (point === undefined) { point = new Vector2(0, 0); }

    point.x = WorldToTileX(worldX, snapToFloor, camera, layer);
    point.y = WorldToTileY(worldY, snapToFloor, camera, layer);

    return point;
};

module.exports = WorldToTileXY;
