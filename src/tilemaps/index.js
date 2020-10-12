/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var CONST = require('./const');
var Extend = require('../utils/object/Extend');

/**
 * @namespace Phaser.Tilemaps
 */

var PhaserTilemaps = {

    Components: require('./components'),
    Parsers: require('./parsers'),

    Formats: require('./Formats'),
    ImageCollection: require('./ImageCollection'),
    ParseToTilemap: require('./ParseToTilemap'),
    Tile: require('./Tile'),
    Tilemap: require('./Tilemap'),
    TilemapCreator: require('./TilemapCreator'),
    TilemapFactory: require('./TilemapFactory'),
    Tileset: require('./Tileset'),
    TilemapLayer: require('./TilemapLayer'),

    LayerData: require('./mapdata/LayerData'),
    MapData: require('./mapdata/MapData'),
    ObjectLayer: require('./mapdata/ObjectLayer')

};

//   Merge in the consts

PhaserTilemaps = Extend(false, PhaserTilemaps, CONST);

//  Export it

module.exports = PhaserTilemaps;
