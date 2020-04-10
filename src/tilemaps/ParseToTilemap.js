/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Formats = require('./Formats');
var MapData = require('./mapdata/MapData');
var Parse = require('./parsers/Parse');
var Tilemap = require('./Tilemap');

/**
 * Create a Tilemap from the given key or data. If neither is given, make a blank Tilemap. When
 * loading from CSV or a 2D array, you should specify the tileWidth & tileHeight. When parsing from
 * a map from Tiled, the tileWidth, tileHeight, width & height will be pulled from the map data. For
 * an empty map, you should specify tileWidth, tileHeight, width & height.
 *
 * @function Phaser.Tilemaps.ParseToTilemap
 * @since 3.0.0
 * 
 * @param {Phaser.Scene} scene - The Scene to which this Tilemap belongs.
 * @param {string} [key] - The key in the Phaser cache that corresponds to the loaded tilemap data.
 * @param {integer} [tileWidth=32] - The width of a tile in pixels.
 * @param {integer} [tileHeight=32] - The height of a tile in pixels.
 * @param {integer} [width=10] - The width of the map in tiles.
 * @param {integer} [height=10] - The height of the map in tiles.
 * @param {integer[][]} [data] - Instead of loading from the cache, you can also load directly from
 * a 2D array of tile indexes.
 * @param {boolean} [insertNull=false] - Controls how empty tiles, tiles with an index of -1, in the
 * map data are handled. If `true`, empty locations will get a value of `null`. If `false`, empty
 * location will get a Tile object with an index of -1. If you've a large sparsely populated map and
 * the tile data doesn't need to change then setting this value to `true` will help with memory
 * consumption. However if your map is small or you need to update the tiles dynamically, then leave
 * the default value set.
 * 
 * @return {Phaser.Tilemaps.Tilemap}
 */
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
        mapData = Parse(name, Formats.ARRAY_2D, data, tileWidth, tileHeight, insertNull);
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
