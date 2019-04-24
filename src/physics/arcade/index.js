/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2019 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

var CONST = require('./const');
var Extend = require('../../utils/object/Extend');

/**
 * @callback ArcadePhysicsCallback
 *
 * @param {Phaser.GameObjects.GameObject} object1 - The first Body to separate.
 * @param {Phaser.GameObjects.GameObject} object2 - The second Body to separate.
 */

/**
 * @namespace Phaser.Physics.Arcade
 */

var Arcade = {

    ArcadePhysics: require('./ArcadePhysics'),
    BaseBody: require('./BaseBody'),
    Body: require('./Body'),
    CheckOverlap: require('./CheckOverlap'),
    Collider: require('./Collider'),
    Components: require('./components'),
    Events: require('./events'),
    Factory: require('./Factory'),
    GetOverlap: require('./GetOverlap'),
    Group: require('./PhysicsGroup'),
    Image: require('./ArcadeImage'),
    IntersectsRect: require('./IntersectsRect'),
    Sprite: require('./ArcadeSprite'),
    StaticBody: require('./StaticBody'),
    StaticGroup: require('./StaticPhysicsGroup'),
    World: require('./World')

};

//   Merge in the consts
Arcade = Extend(false, Arcade, CONST);

module.exports = Arcade;
