/**
 * @author       Faelin Landy <faelin.landy@gmail.com>
 * @copyright    2019 Faelin Landy
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * Master list of tiles -> x, y, index in tileset.
 *
 * @function Phaser.Tilemaps.Parsers.Tiled.BuildTileIndex
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
