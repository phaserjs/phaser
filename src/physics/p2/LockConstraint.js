/**
* @author       Richard Davey <rich@photonstorm.com>
* @copyright    2014 Photon Storm Ltd.
* @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
*/

/**
* Locks the relative position between two bodies.
*
* @class Phaser.Physics.P2.LockConstraint
* @constructor
* @param {Phaser.Physics.P2} world - A reference to the P2 World.
* @param {p2.Body} bodyA - First connected body.
* @param {p2.Body} bodyB - Second connected body.
* @param {Array} [offset] - The offset of bodyB in bodyA's frame. The value is an array with 2 elements matching x and y, i.e: [32, 32].
* @param {number} [angle=0] - The angle of bodyB in bodyA's frame.
* @param {number} [maxForce] - The maximum force that should be applied to constrain the bodies.
*/
Phaser.Physics.P2.LockConstraint = function (world, bodyA, bodyB, offset, angle, maxForce) {

    if (typeof offset === 'undefined') { offset = [0, 0]; }
    if (typeof angle === 'undefined') { angle = 0; }
    if (typeof maxForce === 'undefined') { maxForce = Number.MAX_VALUE; }

    /**
    * @property {Phaser.Game} game - Local reference to game.
    */
    this.game = world.game;

    /**
    * @property {Phaser.Physics.P2} world - Local reference to P2 World.
    */
    this.world = world;

    offset = [ world.pxm(offset[0]), world.pxm(offset[1]) ];

    var options = { localOffsetB: offset, localAngleB: angle, maxForce: maxForce };

    p2.LockConstraint.call(this, bodyA, bodyB, options);

};

Phaser.Physics.P2.LockConstraint.prototype = Object.create(p2.LockConstraint.prototype);
Phaser.Physics.P2.LockConstraint.prototype.constructor = Phaser.Physics.P2.LockConstraint;
