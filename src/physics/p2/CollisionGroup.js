/**
* @author       Richard Davey <rich@photonstorm.com>
* @copyright    2014 Photon Storm Ltd.
* @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
*/

/**
* Collision Group
*
* @class Phaser.Physics.P2.CollisionGroup
* @classdesc Physics Collision Group Constructor
* @constructor
*/
Phaser.Physics.P2.CollisionGroup = function (bitmask) {

    /**
    * @property {number} mask - The CollisionGroup bitmask.
    */
    this.mask = bitmask;

};
