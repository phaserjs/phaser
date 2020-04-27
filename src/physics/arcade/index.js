/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var CONST = require('./const');
var Extend = require('../../utils/object/Extend');

/**
 * @callback ArcadePhysicsCallback
 *
 * A callback receiving two Game Objects.
 *
 * When colliding a single sprite with a Group or TilemapLayer, `object1` is always the sprite.
 *
 * For all other cases, `object1` and `object2` match the same arguments in `collide()` or `overlap()`.
 *
 * @param {Phaser.GameObjects.GameObject} object1 - The first Game Object.
 * @param {Phaser.GameObjects.GameObject} object2 - The second Game Object.
 */

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
    Group: require('./PhysicsGroup'),
    Image: require('./ArcadeImage'),
    Sprite: require('./ArcadeSprite'),
    StaticBody: require('./StaticBody'),
    StaticGroup: require('./StaticPhysicsGroup'),
    World: require('./World')

};

//   Merge in the consts
Arcade = Extend(false, Arcade, CONST);

module.exports = Arcade;
