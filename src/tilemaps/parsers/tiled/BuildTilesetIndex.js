/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Tileset = require('../../Tileset');

/**
 * Builds a lookup index that maps each global tile ID (GID) to its pixel position within its
 * tileset image and the index of that tileset within the map data. The returned array is sparse,
 * keyed by GID, where each entry is a three-element array of the form `[x, y, tilesetIndex]`.
 * The x and y values are the pixel coordinates of the top-left corner of the tile within its
 * tileset image, accounting for tile margin and spacing. Any image collections in the map data
 * are also converted into Tileset objects and added to `mapData.tilesets` before the index is built.
 *
 * @function Phaser.Tilemaps.Parsers.Tiled.BuildTilesetIndex
 * @since 3.0.0
 *
 * @param {(Phaser.Tilemaps.MapData|Phaser.Tilemaps.Tilemap)} mapData - The Map Data object.
 *
 * @return {array} A sparse array keyed by global tile ID (GID), where each entry is `[x, y, tilesetIndex]`.
 */
var BuildTilesetIndex = function (mapData)
{
    var i;
    var set;
    var tiles = [];

    for (i = 0; i < mapData.imageCollections.length; i++)
    {
        var collection = mapData.imageCollections[i];
        var images = collection.images;

        for (var j = 0; j < images.length; j++)
        {
            var image = images[j];
            var offset = {
                x: 0,
                y: image.height - mapData.tileHeight
            };
            
            set = new Tileset(image.image, image.gid, image.width, image.height, 0, 0, undefined, undefined, offset);

            set.updateTileData(image.width, image.height);

            mapData.tilesets.push(set);
        }
    }

    for (i = 0; i < mapData.tilesets.length; i++)
    {
        set = mapData.tilesets[i];

        var x = set.tileMargin;
        var y = set.tileMargin;

        var count = 0;
        var countX = 0;
        var countY = 0;

        for (var t = set.firstgid; t < set.firstgid + set.total; t++)
        {
            //  Can add extra properties here as needed
            tiles[t] = [ x, y, i ];

            x += set.tileWidth + set.tileSpacing;

            count++;

            if (count === set.total)
            {
                break;
            }

            countX++;

            if (countX === set.columns)
            {
                x = set.tileMargin;
                y += set.tileHeight + set.tileSpacing;

                countX = 0;
                countY++;

                if (countY === set.rows)
                {
                    break;
                }
            }
        }
    }

    return tiles;
};

module.exports = BuildTilesetIndex;
