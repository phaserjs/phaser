/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var GetTilesWithin = require('./GetTilesWithin');

/**
 * @callback FindTileCallback
 *
 * @param {Phaser.Tilemaps.Tile} value - The Tile.
 * @param {integer} index - The index of the tile.
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
 * @private
 * @since 3.0.0
 *
 * @param {FindTileCallback} callback - The callback. Each tile in the given area will be passed to this callback as the first and only parameter.
 * @param {object} [context] - The context under which the callback should be run.
 * @param {integer} [tileX=0] - The left most tile index (in tile coordinates) to use as the origin of the area to filter.
 * @param {integer} [tileY=0] - The top most tile index (in tile coordinates) to use as the origin of the area to filter.
 * @param {integer} [width=max width based on tileX] - How many tiles wide from the `tileX` index the area will be.
 * @param {integer} [height=max height based on tileY] - How many tiles tall from the `tileY` index the area will be.
 * @param {object} [filteringOptions] - Optional filters to apply when getting the tiles.
 * @param {boolean} [filteringOptions.isNotEmpty=false] - If true, only return tiles that don't have -1 for an index.
 * @param {boolean} [filteringOptions.isColliding=false] - If true, only return tiles that collide on at least one side.
 * @param {boolean} [filteringOptions.hasInterestingFace=false] - If true, only return tiles that have at least one interesting face.
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
