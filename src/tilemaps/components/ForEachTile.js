/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

var GetTilesWithin = require('./GetTilesWithin');

/**
 * @callback EachTileCallback
 *
 * @param {Phaser.Tilemaps.Tile} value - [description]
 * @param {number} index - [description]
 * @param {Phaser.Tilemaps.Tile[]} array - [description]
 */

/**
 * For each tile in the given rectangular area (in tile coordinates) of the layer, run the given
 * callback. Similar to Array.prototype.forEach in vanilla JS.
 *
 * @function Phaser.Tilemaps.Components.ForEachTile
 * @since 3.0.0
 *
 * @param {EachTileCallback} callback - The callback. Each tile in the given area will be passed to this
 * callback as the first and only parameter.
 * @param {object} [context] - The context under which the callback should be run.
 * @param {integer} [tileX=0] - [description]
 * @param {integer} [tileY=0] - [description]
 * @param {integer} [width=max width based on tileX] - [description]
 * @param {integer} [height=max height based on tileY] - [description]
 * @param {object} [filteringOptions] - Optional filters to apply when getting the tiles.
 * @param {boolean} [filteringOptions.isNotEmpty=false] - If true, only return tiles that don't have
 * -1 for an index.
 * @param {boolean} [filteringOptions.isColliding=false] - If true, only return tiles that collide
 * on at least one side.
 * @param {boolean} [filteringOptions.hasInterestingFace=false] - If true, only return tiles that
 * have at least one interesting face.
 * @param {Phaser.Tilemaps.LayerData} layer - The Tilemap Layer to act upon.
 */
var ForEachTile = function (callback, context, tileX, tileY, width, height, filteringOptions, layer)
{
    var tiles = GetTilesWithin(tileX, tileY, width, height, filteringOptions, layer);
    tiles.forEach(callback, context);
};

module.exports = ForEachTile;
