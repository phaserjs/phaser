/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2022 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var GetTilesWithin = require('./GetTilesWithin');

/**
 * @callback FindTileCallback
 *
 * @param {Phaser.Tilemaps.Tile} value - The Tile.
 * @param {number} index - The index of the tile.
 * @param {Phaser.Tilemaps.Tile[]} array - An array of Tile objects.
 *
 * @return {boolean} Return `true` if the callback should run, otherwise `false`.
 */

/**
 * Find the first tile in the given rectangular area (in tile coordinates) of the layer that
 * satisfies the provided testing function. I.e. finds the first tile for which `callback` returns
 * true. Similar to Array.prototype.find in vanilla JS.
 *
 * @function Phaser.Tilemaps.Components.FindTile
 * @since 3.0.0
 *
 * @param {FindTileCallback} callback - The callback. Each tile in the given area will be passed to this callback as the first and only parameter.
 * @param {object} context - The context under which the callback should be run.
 * @param {number} tileX - The left most tile index (in tile coordinates) to use as the origin of the area to filter.
 * @param {number} tileY - The top most tile index (in tile coordinates) to use as the origin of the area to filter.
 * @param {number} width - How many tiles wide from the `tileX` index the area will be.
 * @param {number} height - How many tiles tall from the `tileY` index the area will be.
 * @param {Phaser.Types.Tilemaps.FilteringOptions} filteringOptions - Optional filters to apply when getting the tiles.
 * @param {Phaser.Tilemaps.LayerData} layer - The Tilemap Layer to act upon.
 *
 * @return {?Phaser.Tilemaps.Tile} A Tile that matches the search, or null if no Tile found
 */
var FindTile = function (callback, context, tileX, tileY, width, height, filteringOptions, layer)
{
    var tiles = GetTilesWithin(tileX, tileY, width, height, filteringOptions, layer);

    return tiles.find(callback, context) || null;
};

module.exports = FindTile;
