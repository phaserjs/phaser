/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var GetTilesWithin = require('./GetTilesWithin');
var Vector2 = require('../../math/Vector2');

var pointStart = new Vector2();
var pointEnd = new Vector2();

/**
 * Gets the tiles in the given rectangular area (in world coordinates) of the layer.
 *
 * @function Phaser.Tilemaps.Components.GetTilesWithinWorldXY
 * @since 3.0.0
 *
 * @param {number} worldX - The world x coordinate for the top-left of the area.
 * @param {number} worldY - The world y coordinate for the top-left of the area.
 * @param {number} width - The width of the area.
 * @param {number} height - The height of the area.
 * @param {object} [filteringOptions] - Optional filters to apply when getting the tiles.
 * @param {boolean} [filteringOptions.isNotEmpty=false] - If true, only return tiles that don't have -1 for an index.
 * @param {boolean} [filteringOptions.isColliding=false] - If true, only return tiles that collide on at least one side.
 * @param {boolean} [filteringOptions.hasInterestingFace=false] - If true, only return tiles that have at least one interesting face.
 * @param {Phaser.Cameras.Scene2D.Camera} [camera=main camera] - The Camera to use when factoring in which tiles to return.
 * @param {Phaser.Tilemaps.LayerData} layer - The Tilemap Layer to act upon.
 *
 * @return {Phaser.Tilemaps.Tile[]} Array of Tile objects.
 */
var GetTilesWithinWorldXY = function (worldX, worldY, width, height, filteringOptions, camera, layer)
{
    // Top left corner of the rect, rounded down to include partial tiles
    layer.tilemapLayer.worldToTileXY(worldX, worldY, true, pointStart, camera);

    var xStart = pointStart.x;
    var yStart = pointStart.y;

    // Bottom right corner of the rect, rounded up to include partial tiles
    layer.tilemapLayer.worldToTileXY(worldX + width, worldY + height, false, pointEnd, camera);

    var xEnd = Math.ceil(pointEnd.x);
    var yEnd = Math.ceil(pointEnd.y);

    return GetTilesWithin(xStart, yStart, xEnd - xStart, yEnd - yStart, filteringOptions, layer);
};

module.exports = GetTilesWithinWorldXY;
