var GenerateEmptyMapData = require('../GenerateEmptyMapData');
var Formats = require('../Formats');
var Tile = require('../Tile');

var Parse2DArray = function (key, data, tileWidth, tileHeight, insertNull)
{
    var map = GenerateEmptyMapData(Formats.TILEMAP_2D_ARRAY, key, tileWidth, tileHeight);

    var output = [];
    var height = data.length;
    var width = 0;

    for (var y = 0; y < data.length; y++)
    {
        output[y] = [];
        var row = data[y];

        for (var x = 0; x < row.length; x++)
        {
            var tileIndex = parseInt(row[x], 10);

            if (Number.isNaN(tileIndex))
            {
                output[y][x] = insertNull
                    ? null
                    : new Tile(map.layers[0], -1, x, y, tileWidth, tileHeight);
            }
            else
            {
                output[y][x] = new Tile(map.layers[0], tileIndex, x, y, tileWidth, tileHeight);
            }
        }

        if (width === 0)
        {
            width = row.length;
        }
    }

    map.width = width;
    map.height = height;
    map.tileWidth = tileWidth;
    map.tileHeight = tileHeight;
    map.widthInPixels = width * tileWidth;
    map.heightInPixels = height * tileHeight;

    map.layers[0].width = width;
    map.layers[0].height = height;
    map.layers[0].widthInPixels = map.widthInPixels;
    map.layers[0].heightInPixels = map.heightInPixels;
    map.layers[0].data = output;

    return map;
};

module.exports = Parse2DArray;
