/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2019 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * Master list of tiles -> x, y, index in tileset.
 *
 * @function Phaser.Tilemaps.Parsers.Tiled.BuildTilesetIndex
 * @since 3.0.0
 *
 * @param {Phaser.Tilemaps.MapData} mapData - [description]
 *
 * @return {array} [description]
 */
var BuildTileIndex = function (mapData)
{
    return tiles = BuildTilesetIndex(mapData).concat(BuildImageCollectionIndex(mapData));
};

module.exports = BuildTileIndex;
