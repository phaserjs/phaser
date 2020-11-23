/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var GetTilesWithin = require('./GetTilesWithin');

/**
 * @callback EachTileCallback
 *
 * @param {Phaser.Tilemaps.Tile} value - The Tile.
 * @param {number} index - The index of the tile.
 * @param {Phaser.Tilemaps.Tile[]} array - An array of Tile objects.
 */

/**
 * For each tile in the given rectangular area (in tile coordinates) of the layer, run the given
 * callback. Similar to Array.prototype.forEach in vanilla JS.
 *
 * @function Phaser.Tilemaps.Components.ForEachTile
 * @since 3.0.0
 *
 * @param {EachTileCallback} callback - The callback. Each tile in the given area will be passed to this callback as the first and only parameter.
 * @param {object} context - The context under which the callback should be run.
 * @param {number} tileX - The left most tile index (in tile coordinates) to use as the origin of the area to filter.
 * @param {number} tileY - The top most tile index (in tile coordinates) to use as the origin of the area to filter.
 * @param {number} width - How many tiles wide from the `tileX` index the area will be.
 * @param {number} height - How many tiles tall from the `tileY` index the area will be.
 * @param {Phaser.Types.Tilemaps.FilteringOptions} filteringOptions - Optional filters to apply when getting the tiles.
 * @param {Phaser.Tilemaps.LayerData} layer - The Tilemap Layer to act upon.
 */
var ForEachTile = function (callback, context, tileX, tileY, width, height, filteringOptions, layer)
{
    var tiles = GetTilesWithin(tileX, tileY, width, height, filteringOptions, layer);

    tiles.forEach(callback, context);
};

module.exports = ForEachTile;
