/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var WorldToTileXY = require('./WorldToTileXY');
var Vector2 = require('../../math/Vector2');

var tempVec = new Vector2();

/**
 * Converts from world Y coordinates (pixels) to tile Y coordinates (tile units), factoring in the
 * layer's position, scale and scroll.
 *
 * @function Phaser.Tilemaps.Components.WorldToTileY
 * @since 3.0.0
 *
 * @param {number} worldY - The y coordinate to be converted, in pixels, not tiles.
 * @param {boolean} snapToFloor - Whether or not to round the tile coordinate down to the nearest integer.
 * @param {?Phaser.Cameras.Scene2D.Camera} camera - The Camera to use when calculating the tile index from the world values.
 * @param {Phaser.Tilemaps.LayerData} layer - The Tilemap Layer to act upon.
 *
 * @return {number} The Y location in tile units.
 */
var WorldToTileY = function (worldY, snapToFloor, camera, layer)
{
    WorldToTileXY(0, worldY, snapToFloor, tempVec, camera, layer);

    return tempVec.y;
};

module.exports = WorldToTileY;
