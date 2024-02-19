/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2024 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Extend = require('../utils/object/Extend');
var CONST = require('./const');

/**
 * @namespace Phaser.Tilemaps
 *
 * @borrows Phaser.Tilemaps.Orientation.ORTHOGONAL as ORTHOGONAL
 * @borrows Phaser.Tilemaps.Orientation.ISOMETRIC as ISOMETRIC
 * @borrows Phaser.Tilemaps.Orientation.STAGGERED as STAGGERED
 * @borrows Phaser.Tilemaps.Orientation.HEXAGONAL as HEXAGONAL
 */

var Tilemaps = {

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
    Orientation: require('./const/ORIENTATION_CONST'),

    LayerData: require('./mapdata/LayerData'),
    MapData: require('./mapdata/MapData'),
    ObjectLayer: require('./mapdata/ObjectLayer')

};

Tilemaps = Extend(false, Tilemaps, CONST.ORIENTATION);

module.exports = Tilemaps;
