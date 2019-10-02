/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2019 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
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
 * @private
 * @since 3.0.0
 *
 * @param {number} worldX - The x coordinate to be converted, in pixels, not tiles.
 * @param {number} worldY - The y coordinate to be converted, in pixels, not tiles.
 * @param {boolean} [snapToFloor=true] - Whether or not to round the tile coordinate down to the nearest integer.
 * @param {Phaser.Math.Vector2} [point] - A Vector2 to store the coordinates in. If not given a new Vector2 is created.
 * @param {Phaser.Cameras.Scene2D.Camera} [camera=main camera] - The Camera to use when calculating the tile index from the world values.
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
