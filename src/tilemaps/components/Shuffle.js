/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

var GetTilesWithin = require('./GetTilesWithin');
var ShuffleArray = require('../../utils/array/Shuffle');

/**
 * Shuffles the tiles in a rectangular region (specified in tile coordinates) within the given
 * layer. It will only randomize the tiles in that area, so if they're all the same nothing will
 * appear to have changed! This method only modifies tile indexes and does not change collision
 * information.
 *
 * @function Phaser.Tilemaps.Components.Shuffle
 * @private
 * @since 3.0.0
 *
 * @param {integer} [tileX=0] - [description]
 * @param {integer} [tileY=0] - [description]
 * @param {integer} [width=max width based on tileX] - [description]
 * @param {integer} [height=max height based on tileY] - [description]
 * @param {Phaser.Tilemaps.LayerData} layer - The Tilemap Layer to act upon.
 */
var Shuffle = function (tileX, tileY, width, height, layer)
{
    var tiles = GetTilesWithin(tileX, tileY, width, height, null, layer);

    var indexes = tiles.map(function (tile) { return tile.index; });
    ShuffleArray(indexes);

    for (var i = 0; i < tiles.length; i++)
    {
        tiles[i].index = indexes[i];
    }
};

module.exports = Shuffle;
