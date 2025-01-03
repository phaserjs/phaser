/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var GetTilesWithin = require('./GetTilesWithin');

/**
 * For each tile in the given rectangular area (in tile coordinates) of the layer, run the given
 * filter callback function. Any tiles that pass the filter test (i.e. where the callback returns
 * true) will returned as a new array. Similar to Array.prototype.Filter in vanilla JS.
 *
 * @function Phaser.Tilemaps.Components.FilterTiles
 * @since 3.0.0
 *
 * @param {function} callback - The callback. Each tile in the given area will be passed to this
 * callback as the first and only parameter. The callback should return true for tiles that pass the
 * filter.
 * @param {object} context - The context under which the callback should be run.
 * @param {number} tileX - The left most tile index (in tile coordinates) to use as the origin of the area to filter.
 * @param {number} tileY - The top most tile index (in tile coordinates) to use as the origin of the area to filter.
 * @param {number} width - How many tiles wide from the `tileX` index the area will be.
 * @param {number} height - How many tiles tall from the `tileY` index the area will be.
 * @param {Phaser.Types.Tilemaps.FilteringOptions} filteringOptions - Optional filters to apply when getting the tiles.
 * @param {Phaser.Tilemaps.LayerData} layer - The Tilemap Layer to act upon.
 *
 * @return {Phaser.Tilemaps.Tile[]} The filtered array of Tiles.
 */
var FilterTiles = function (callback, context, tileX, tileY, width, height, filteringOptions, layer)
{
    var tiles = GetTilesWithin(tileX, tileY, width, height, filteringOptions, layer);

    return tiles.filter(callback, context);
};

module.exports = FilterTiles;
