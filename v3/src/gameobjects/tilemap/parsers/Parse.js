
var Parse2DArray = require('./Parse2DArray');
var ParseCSV = require('./ParseCSV');
var ParseTiledJSON = require('./parsetiledjson/');
var Formats = require('../Formats');

/**
 * Parses raw data of a given Tilemap format into a new MapData object.
 *
 * @param {string} name - The name of the tilemap, used to set the name on the MapData.
 * @param {number} mapFormat - See ../Formats.js.
 * @param {array|string|object} data - 2D array, CSV string or Tiled JSON object
 * @param {number} tileWidth - Required for 2D array and CSV, but ignored for Tiled JSON.
 * @param {number} tileHeight - Required for 2D array and CSV, but ignored for Tiled JSON.
 * @param {boolean} [insertNull=false] - If true, instead of placing empty tiles at locations where
 * the tile index is -1, this will place null. If you've a large sparsely populated map and the tile
 * data doesn't need to change then setting this value to `true` will help with memory consumption.
 * However if your map is small, or you need to update the tiles (perhaps the map dynamically
 * changes during the game) then leave the default value set.
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
