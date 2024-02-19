/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2024 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * @namespace Phaser.Physics.Arcade.Tilemap
 */

var Tilemap = {

    ProcessTileCallbacks: require('./ProcessTileCallbacks'),
    ProcessTileSeparationX: require('./ProcessTileSeparationX'),
    ProcessTileSeparationY: require('./ProcessTileSeparationY'),
    SeparateTile: require('./SeparateTile'),
    TileCheckX: require('./TileCheckX'),
    TileCheckY: require('./TileCheckY'),
    TileIntersectsBody: require('./TileIntersectsBody')

};

module.exports = Tilemap;
