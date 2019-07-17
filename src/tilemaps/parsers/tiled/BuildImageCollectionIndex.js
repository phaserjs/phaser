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
var BuildImageCollectionIndex = function (mapData)
{
    var tiles = [];

    for (var i = 0; i < mapData.imageCollections.length; i++)
    {
        var set = mapData.imageCollections[i];

        var x = set.imageMargin;
        var y = set.imageMargin;

        var count = 0;

        for (var t = set.firstgid; t < set.firstgid + set.total; t++)
        {
            //  Can add extra properties here as needed
            tiles[t] = [ x, y, i ];

            x += set.imageWidth + set.imageSpacing;

            count++;

            if (count === set.total)
            {
                break;
            }
        }
    }

    return tiles;
};

module.exports = BuildImageCollectionIndex;
