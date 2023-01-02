/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2013-2023 Photon Storm Ltd.
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
