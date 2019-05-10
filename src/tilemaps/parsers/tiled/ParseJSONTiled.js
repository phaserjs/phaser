/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2019 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Formats = require('../../Formats');
var MapData = require('../../mapdata/MapData');
var ParseTileLayers = require('./ParseTileLayers');
var ParseImageLayers = require('./ParseImageLayers');
var ParseTilesets = require('./ParseTilesets');
var ParseObjectLayers = require('./ParseObjectLayers');
var BuildTilesetIndex = require('./BuildTilesetIndex');
var AssignTileProperties = require('./AssignTileProperties');

/**
 * @namespace Phaser.Tilemaps.Parsers.Tiled
 */

/**
 * Parses a Tiled JSON object into a new MapData object.
 *
 * @function Phaser.Tilemaps.Parsers.Tiled.ParseJSONTiled
 * @since 3.0.0
 *
 * @param {string} name - The name of the tilemap, used to set the name on the MapData.
 * @param {object} json - The Tiled JSON object.
 * @param {boolean} insertNull - Controls how empty tiles, tiles with an index of -1, in the map
 * data are handled. If `true`, empty locations will get a value of `null`. If `false`, empty
 * location will get a Tile object with an index of -1. If you've a large sparsely populated map and
 * the tile data doesn't need to change then setting this value to `true` will help with memory
 * consumption. However if your map is small or you need to update the tiles dynamically, then leave
 * the default value set.
 *
 * @return {?Phaser.Tilemaps.MapData} The created MapData object, or `null` if the data can't be parsed.
 */
var ParseJSONTiled = function (name, json, insertNull)
{
    if (json.orientation !== 'orthogonal')
    {
        console.warn('Only orthogonal map types are supported in this version of Phaser');
        return null;
    }

    //  Map data will consist of: layers, objects, images, tilesets, sizes
    var mapData = new MapData({
        width: json.width,
        height: json.height,
        name: name,
        tileWidth: json.tilewidth,
        tileHeight: json.tileheight,
        orientation: json.orientation,
        format: Formats.TILED_JSON,
        version: json.version,
        properties: json.properties,
        renderOrder: json.renderorder,
        infinite: json.infinite
    });

    mapData.layers = ParseTileLayers(json, insertNull);
    mapData.images = ParseImageLayers(json);

    var sets = ParseTilesets(json);
    mapData.tilesets = sets.tilesets;
    mapData.imageCollections = sets.imageCollections;

    mapData.objects = ParseObjectLayers(json);

    mapData.tiles = BuildTilesetIndex(mapData);

    AssignTileProperties(mapData);

    return mapData;
};

module.exports = ParseJSONTiled;
