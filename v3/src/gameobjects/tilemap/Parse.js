var Formats = require('./Formats');
var Parsers = require('./parsers');

var Parse = function (key, map, tileWidth, tileHeight, width, height)
{
    var newMap;

    switch(map.format)
    {
        case (Formats.TILEMAP_CSV):
            newMap = Parsers.ParseCSV(key, map.data, tileWidth, tileHeight, width, height);
            break;
        case (Formats.TILEMAP_TILED_JSON):
            newMap = Parsers.ParseTiledJSON(key, map.data);
            break;
        default:
            console.warn('Unrecognized tilemap data format: ' + map.format);
            newMap = null;
    }

    return newMap;
};

module.exports = Parse;

