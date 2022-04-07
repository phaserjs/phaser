/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2022 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Formats = require('../Formats');
var Parse2DArray = require('./Parse2DArray');

/**
 * Parses a CSV string of tile indexes into a new MapData object with a single layer.
 *
 * @function Phaser.Tilemaps.Parsers.ParseCSV
 * @since 3.0.0
 *
 * @param {string} name - The name of the tilemap, used to set the name on the MapData.
 * @param {string} data - CSV string of tile indexes.
 * @param {number} tileWidth - The width of a tile in pixels.
 * @param {number} tileHeight - The height of a tile in pixels.
 * @param {boolean} insertNull - Controls how empty tiles, tiles with an index of -1, in the map
 * data are handled. If `true`, empty locations will get a value of `null`. If `false`, empty
 * location will get a Tile object with an index of -1. If you've a large sparsely populated map and
 * the tile data doesn't need to change then setting this value to `true` will help with memory
 * consumption. However if your map is small or you need to update the tiles dynamically, then leave
 * the default value set.
 *
 * @return {Phaser.Tilemaps.MapData} The resulting MapData object.
 */
var ParseCSV = function (name, data, tileWidth, tileHeight, insertNull)
{
    var array2D = data
        .trim()
        .split('\n')
        .map(function (row) { return row.split(','); });

    var map = Parse2DArray(name, array2D, tileWidth, tileHeight, insertNull);
    map.format = Formats.CSV;

    return map;
};

module.exports = ParseCSV;
