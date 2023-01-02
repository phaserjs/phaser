/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2013-2023 Photon Storm Ltd.
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
