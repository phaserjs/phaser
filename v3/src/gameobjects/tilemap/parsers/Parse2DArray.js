var MapData = require('../mapdata/MapData');
var LayerData = require('../mapdata/LayerData');
var Formats = require('../Formats');
var Tile = require('../Tile');

var Parse2DArray = function (key, data, tileWidth, tileHeight, insertNull)
{
    var layerData = new LayerData({
        tileWidth: tileWidth,
        tileHeight: tileHeight
    });

    var mapData = new MapData({
        name: key,
        tileWidth: tileWidth,
        tileHeight: tileHeight,
        format: Formats.TILEMAP_2D_ARRAY,
        layers: [ layerData ]
    });

    var tiles = [];
    var height = data.length;
    var width = 0;

    for (var y = 0; y < data.length; y++)
    {
        tiles[y] = [];
        var row = data[y];

        for (var x = 0; x < row.length; x++)
        {
            var tileIndex = parseInt(row[x], 10);

            if (Number.isNaN(tileIndex) || tileIndex === -1)
            {
                tiles[y][x] = insertNull
                    ? null
                    : new Tile(layerData, -1, x, y, tileWidth, tileHeight);
            }
            else
            {
                tiles[y][x] = new Tile(layerData, tileIndex, x, y, tileWidth, tileHeight);
            }
        }

        if (width === 0)
        {
            width = row.length;
        }
    }

    mapData.width = layerData.width = width;
    mapData.height = layerData.height = height;
    mapData.widthInPixels = layerData.widthInPixels = width * tileWidth;
    mapData.heightInPixels = layerData.heightInPixels = height * tileHeight;
    layerData.data = tiles;

    return mapData;
};

module.exports = Parse2DArray;
