/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var CONST = require('./const');
var Extend = require('../../utils/object/Extend');

/**
 * @namespace Phaser.Physics.Arcade
 */

var Arcade = {

    ArcadePhysics: require('./ArcadePhysics'),
    Body: require('./Body'),
    Collider: require('./Collider'),
    Components: require('./components'),
    Events: require('./events'),
    Factory: require('./Factory'),
    GetCollidesWith: require('./GetCollidesWith'),
    GetOverlapX: require('./GetOverlapX'),
    GetOverlapY: require('./GetOverlapY'),
    SeparateX: require('./SeparateX'),
    SeparateY: require('./SeparateY'),
    Group: require('./PhysicsGroup'),
    Image: require('./ArcadeImage'),
    Sprite: require('./ArcadeSprite'),
    StaticBody: require('./StaticBody'),
    StaticGroup: require('./StaticPhysicsGroup'),
    Tilemap: require('./tilemap/'),
    World: require('./World')

};

//   Merge in the consts
Arcade = Extend(false, Arcade, CONST);

module.exports = Arcade;
