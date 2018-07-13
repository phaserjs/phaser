/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

var CONST = require('./const');
var Extend = require('../../utils/object/Extend');

/**
 * @callback ArcadePhysicsCallback
 *
 * @param {Phaser.GameObjects.GameObject} object1 - [description]
 * @param {Phaser.GameObjects.GameObject} object2 - [description]
 */

/**
 * @namespace Phaser.Physics.Arcade
 */

var Arcade = {

    ArcadePhysics: require('./ArcadePhysics'),
    Body: require('./Body'),
    Collider: require('./Collider'),
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
