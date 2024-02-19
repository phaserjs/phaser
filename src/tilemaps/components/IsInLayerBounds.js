/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2024 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * Checks if the given tile coordinates are within the bounds of the layer.
 *
 * @function Phaser.Tilemaps.Components.IsInLayerBounds
 * @since 3.0.0
 *
 * @param {number} tileX - The x coordinate, in tiles, not pixels.
 * @param {number} tileY - The y coordinate, in tiles, not pixels.
 * @param {Phaser.Tilemaps.LayerData} layer - The Tilemap Layer to act upon.
 *
 * @return {boolean} `true` if the tile coordinates are within the bounds of the layer, otherwise `false`.
 */
var IsInLayerBounds = function (tileX, tileY, layer)
{
    return (tileX >= 0 && tileX < layer.width && tileY >= 0 && tileY < layer.height);
};

module.exports = IsInLayerBounds;
