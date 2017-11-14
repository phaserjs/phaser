var Formats = require('./Formats');
var Parsers = require('./parsers');

var Parse = function (key, mapFormat, mapData, tileWidth, tileHeight, width, height, insertNull)
{
    var newMap;

    switch(mapFormat)
    {
        case (Formats.TILEMAP_2D_ARRAY):
            newMap = Parsers.Parse2DArray(key, mapData, tileWidth, tileHeight, width, height, insertNull);
            break;
        case (Formats.TILEMAP_CSV):
            newMap = Parsers.ParseCSV(key, mapData, tileWidth, tileHeight, width, height, insertNull);
            break;
        case (Formats.TILEMAP_TILED_JSON):
            newMap = Parsers.ParseTiledJSON(key, mapData, insertNull);
            break;
        default:
            console.warn('Unrecognized tilemap data format: ' + mapFormat);
            newMap = null;
    }

    return newMap;
};

module.exports = Parse;

