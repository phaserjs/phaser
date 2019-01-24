/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2019 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

var GetTilesWithin = require('./GetTilesWithin');

/**
 * For each tile in the given rectangular area (in tile coordinates) of the layer, run the given
 * filter callback function. Any tiles that pass the filter test (i.e. where the callback returns
 * true) will returned as a new array. Similar to Array.prototype.Filter in vanilla JS.
 *
 * @function Phaser.Tilemaps.Components.FilterTiles
 * @private
 * @since 3.0.0
 *
 * @param {function} callback - The callback. Each tile in the given area will be passed to this
 * callback as the first and only parameter. The callback should return true for tiles that pass the
 * filter.
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
 * @return {Phaser.Tilemaps.Tile[]} The filtered array of Tiles.
 */
var FilterTiles = function (callback, context, tileX, tileY, width, height, filteringOptions, layer)
{
    var tiles = GetTilesWithin(tileX, tileY, width, height, filteringOptions, layer);

    return tiles.filter(callback, context);
};

module.exports = FilterTiles;

