/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2024 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var AssignTileProperties = require('./AssignTileProperties');
var BuildTilesetIndex = require('./BuildTilesetIndex');
var CONST = require('../../const/ORIENTATION_CONST');
var DeepCopy = require('../../../utils/object/DeepCopy');
var Formats = require('../../Formats');
var FromOrientationString = require('../FromOrientationString');
var MapData = require('../../mapdata/MapData');
var ParseImageLayers = require('./ParseImageLayers');
var ParseObjectLayers = require('./ParseObjectLayers');
var ParseTileLayers = require('./ParseTileLayers');
var ParseTilesets = require('./ParseTilesets');

/**
 * Parses a Tiled JSON object into a new MapData object.
 *
 * @function Phaser.Tilemaps.Parsers.Tiled.ParseJSONTiled
 * @since 3.0.0
 *
 * @param {string} name - The name of the tilemap, used to set the name on the MapData.
 * @param {object} source - The original Tiled JSON object. This is deep copied by this function.
 * @param {boolean} insertNull - Controls how empty tiles, tiles with an index of -1, in the map
 * data are handled. If `true`, empty locations will get a value of `null`. If `false`, empty
 * location will get a Tile object with an index of -1. If you've a large sparsely populated map and
 * the tile data doesn't need to change then setting this value to `true` will help with memory
 * consumption. However if your map is small or you need to update the tiles dynamically, then leave
 * the default value set.
 *
 * @return {?Phaser.Tilemaps.MapData} The created MapData object, or `null` if the data can't be parsed.
 */
var ParseJSONTiled = function (name, source, insertNull)
{
    var json = DeepCopy(source);

    //  Map data will consist of: layers, objects, images, tilesets, sizes
    var mapData = new MapData({
        width: json.width,
        height: json.height,
        name: name,
        tileWidth: json.tilewidth,
        tileHeight: json.tileheight,
        orientation: FromOrientationString(json.orientation),
        format: Formats.TILED_JSON,
        version: json.version,
        properties: json.properties,
        renderOrder: json.renderorder,
        infinite: json.infinite
    });

    if (mapData.orientation === CONST.HEXAGONAL)
    {
        mapData.hexSideLength = json.hexsidelength;
        mapData.staggerAxis = json.staggeraxis;
        mapData.staggerIndex = json.staggerindex;
    }

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
