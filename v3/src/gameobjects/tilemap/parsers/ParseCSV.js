var GenerateEmptyMapData = require('../GenerateEmptyMapData');
var Formats = require('../Formats');
var Tile = require('../Tile');

var ParseCSV = function (key, data, tileWidth, tileHeight)
{
    var map = GenerateEmptyMapData(tileWidth, tileHeight);

    var output = [];
    var rows = data.trim().split('\n');
    var height = rows.length;
    var width = 0;

    for (var y = 0; y < rows.length; y++)
    {
        output[y] = [];

        var column = rows[y].split(',');

        for (var x = 0; x < column.length; x++)
        {
            output[y][x] = new Tile(map.layers[0], parseInt(column[x], 10), x, y, tileWidth, tileHeight);
        }

        if (width === 0)
        {
            width = column.length;
        }
    }

    map.format = Formats.TILEMAP_CSV;
    map.name = key;
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

module.exports = ParseCSV;
