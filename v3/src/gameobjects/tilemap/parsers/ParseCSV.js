var Formats = require('../Formats');
var Parse2DArray = require('./Parse2DArray');

var ParseCSV = function (key, data, tileWidth, tileHeight)
{
    var array2D = data
        .trim()
        .split('\n')
        .map(function (row) { return row.split(','); });

    var map = Parse2DArray(key, array2D, tileWidth, tileHeight);
    map.format = Formats.TILEMAP_CSV;

    return map;
};

module.exports = ParseCSV;
