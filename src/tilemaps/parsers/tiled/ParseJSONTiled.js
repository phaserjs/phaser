/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2022 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var AssignTileProperties = require('./AssignTileProperties');
var BuildTilesetIndex = require('./BuildTilesetIndex');
var CONST = require('../../const/ORIENTATION_CONST');
var DeepCopy = require("../../../utils/object/DeepCopy");
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
    var copyJsonData = DeepCopy(json);
    
    //  Map data will consist of: layers, objects, images, tilesets, sizes
    var mapData = new MapData({
        width: copyJsonData.width,
        height: copyJsonData.height,
        name: name,
        tileWidth: copyJsonData.tilewidth,
        tileHeight: copyJsonData.tileheight,
        orientation: FromOrientationString(copyJsonData.orientation),
        format: Formats.TILED_JSON,
        version: copyJsonData.version,
        properties: copyJsonData.properties,
        renderOrder: copyJsonData.renderorder,
        infinite: copyJsonData.infinite
    });

    if (mapData.orientation === CONST.HEXAGONAL)
    {
        mapData.hexSideLength = copyJsonData.hexsidelength;
    }

    mapData.layers = ParseTileLayers(copyJsonData, insertNull);
    mapData.images = ParseImageLayers(copyJsonData);

    var sets = ParseTilesets(copyJsonData);

    mapData.tilesets = sets.tilesets;
    mapData.imageCollections = sets.imageCollections;

    mapData.objects = ParseObjectLayers(copyJsonData);

    mapData.tiles = BuildTilesetIndex(mapData);

    AssignTileProperties(mapData);

    return mapData;
};

module.exports = ParseJSONTiled;
