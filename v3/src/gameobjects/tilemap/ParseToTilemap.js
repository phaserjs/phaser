var Formats = require('./Formats');
var Parse = require('./parsers/Parse');
var MapData = require('./mapdata/MapData');
var Tilemap = require('./Tilemap');

// Parse from key or data and create a Tilemap. If neither is given, make an empty Tilemap.
var ParseToTilemap = function (scene, key, tileWidth, tileHeight, width, height, data, insertNull)
{
    if (tileWidth === undefined) { tileWidth = 32; }
    if (tileHeight === undefined) { tileHeight = 32; }
    if (width === undefined) { width = 10; }
    if (height === undefined) { height = 10; }
    if (insertNull === undefined) { insertNull = false; }

    var mapData = null;

    if (Array.isArray(data))
    {
        var name = key !== undefined ? key : 'map';
        mapData = Parse(name, Formats.TILEMAP_2D_ARRAY, data, tileWidth, tileHeight, insertNull);
    }
    else if (key !== undefined)
    {
        var tilemapData = scene.cache.tilemap.get(key);

        if (!tilemapData)
        {
            console.warn('No map data found for key ' + key);
        }
        else
        {
            mapData = Parse(key, tilemapData.format, tilemapData.data, tileWidth, tileHeight, insertNull);
        }
    }

    if (mapData === null)
    {
        mapData = new MapData({
            tileWidth: tileWidth,
            tileHeight: tileHeight,
            width: width,
            height: height
        });
    }

    return new Tilemap(scene, mapData);
};

module.exports = ParseToTilemap;

