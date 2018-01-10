
var Parse2DArray = require('./Parse2DArray');
var ParseCSV = require('./ParseCSV');
var ParseTiledJSON = require('./parsetiledjson/');
var Formats = require('../Formats');

/**
 * Parses raw data of a given Tilemap format into a new MapData object. If no recognized data format
 * is found, returns `null`. When loading from CSV or a 2D array, you should specify the tileWidth &
 * tileHeight. When parsing from a map from Tiled, the tileWidth & tileHeight will be pulled from
 * the map data.
 *
 * @param {string} name - The name of the tilemap, used to set the name on the MapData.
 * @param {integer} mapFormat - See ../Formats.js.
 * @param {integer[][]|string|object} data - 2D array, CSV string or Tiled JSON object.
 * @param {integer} tileWidth - The width of a tile in pixels. Required for 2D array and CSV, but
 * ignored for Tiled JSON.
 * @param {integer} tileHeight - The height of a tile in pixels. Required for 2D array and CSV, but
 * ignored for Tiled JSON.
 * @param {boolean} insertNull - Controls how empty tiles, tiles with an index of -1, in the map
 * data are handled. If `true`, empty locations will get a value of `null`. If `false`, empty
 * location will get a Tile object with an index of -1. If you've a large sparsely populated map and
 * the tile data doesn't need to change then setting this value to `true` will help with memory
 * consumption. However if your map is small or you need to update the tiles dynamically, then leave
 * the default value set.
 */
var Parse = function (name, mapFormat, data, tileWidth, tileHeight, insertNull)
{
    var newMap;

    switch(mapFormat)
    {
        case (Formats.TILEMAP_2D_ARRAY):
            newMap = Parse2DArray(name, data, tileWidth, tileHeight, insertNull);
            break;
        case (Formats.TILEMAP_CSV):
            newMap = ParseCSV(name, data, tileWidth, tileHeight, insertNull);
            break;
        case (Formats.TILEMAP_TILED_JSON):
            newMap = ParseTiledJSON(name, data, insertNull);
            break;
        default:
            console.warn('Unrecognized tilemap data format: ' + mapFormat);
            newMap = null;
    }

    return newMap;
};

module.exports = Parse;
