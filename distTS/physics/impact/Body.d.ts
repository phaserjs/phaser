/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */
declare var Class: any;
declare var COLLIDES: any;
declare var GetVelocity: any;
declare var TYPE: any;
declare var UpdateMotion: any;
/**
 * @callback BodyUpdateCallback
 *
 * @param {Phaser.Physics.Impact.Body} body - [description]
 */
/**
 * @typedef {object} JSONImpactBody
 * @todo Replace object types
 *
 * @property {string} name - [description]
 * @property {object} size - [description]
 * @property {object} pos - [description]
 * @property {object} vel - [description]
 * @property {object} accel - [description]
 * @property {object} friction - [description]
 * @property {object} maxVel - [description]
 * @property {number} gravityFactor - [description]
 * @property {number} bounciness - [description]
 * @property {number} minBounceVelocity - [description]
 * @property {Phaser.Physics.Impact.TYPE} type - [description]
 * @property {Phaser.Physics.Impact.TYPE} checkAgainst - [description]
 * @property {Phaser.Physics.Impact.COLLIDES} collides - [description]
 */
/**
 * @classdesc
 * An Impact.js compatible physics body.
 * This re-creates the properties you'd get on an Entity and the math needed to update them.
 *
 * @class Body
 * @memberOf Phaser.Physics.Impact
 * @constructor
 * @since 3.0.0
 *
 * @param {Phaser.Physics.Impact.World} world - [description]
 * @param {number} x - [description]
 * @param {number} y - [description]
 * @param {number} [sx=16] - [description]
 * @param {number} [sy=16] - [description]
 */
declare var Body: any;
