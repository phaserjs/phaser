
var Parse2DArray = require('./Parse2DArray');
var ParseCSV = require('./ParseCSV');
var ParseTiledJSON = require('./ParseTiledJSON');
var Formats = require('../Formats');

var Parse = function (key, mapFormat, mapData, tileWidth, tileHeight, insertNull)
{
    var newMap;

    switch(mapFormat)
    {
        case (Formats.TILEMAP_2D_ARRAY):
            newMap = Parse2DArray(key, mapData, tileWidth, tileHeight, insertNull);
            break;
        case (Formats.TILEMAP_CSV):
            newMap = ParseCSV(key, mapData, tileWidth, tileHeight, insertNull);
            break;
        case (Formats.TILEMAP_TILED_JSON):
            newMap = ParseTiledJSON(key, mapData, insertNull);
            break;
        default:
            console.warn('Unrecognized tilemap data format: ' + mapFormat);
            newMap = null;
    }

    return newMap;
};

module.exports = Parse;
