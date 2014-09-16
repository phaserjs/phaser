/**
* @author       Richard Davey <rich@photonstorm.com>
* @copyright    2014 Photon Storm Ltd.
* @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
*/

/**
* Collision Group
*
* @class Phaser.Physics.P2.CollisionGroup
* @constructor
* @param {number} bitmask - The CollisionGroup bitmask.
*/
Phaser.Physics.P2.CollisionGroup = function (bitmask) {

    /**
    * @property {number} mask - The CollisionGroup bitmask.
    */
    this.mask = bitmask;

};
