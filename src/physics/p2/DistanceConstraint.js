/**
* @author       Richard Davey <rich@photonstorm.com>
* @copyright    2014 Photon Storm Ltd.
* @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
*/

/**
* A constraint that tries to keep the distance between two bodies constant.
*
* @class Phaser.Physics.P2.DistanceConstraint
* @classdesc Physics DistanceConstraint Constructor
* @constructor
* @param {Phaser.Physics.P2} world - A reference to the P2 World.
* @param {p2.Body} bodyA - First connected body.
* @param {p2.Body} bodyB - Second connected body.
* @param {number} distance - The distance to keep between the bodies.
* @param {number} [maxForce] - The maximum force that should be applied to constrain the bodies.
*/
Phaser.Physics.P2.DistanceConstraint = function (world, bodyA, bodyB, distance, maxForce) {

    if (typeof distance === 'undefined') { distance = 100; }

    /**
    * @property {Phaser.Game} game - Local reference to game.
    */
    this.game = world.game;

    /**
    * @property {Phaser.Physics.P2} world - Local reference to P2 World.
    */
    this.world = world;

    distance = world.pxm(distance);

    p2.DistanceConstraint.call(this, bodyA, bodyB, distance, {maxForce: maxForce});

};

Phaser.Physics.P2.DistanceConstraint.prototype = Object.create(p2.DistanceConstraint.prototype);
Phaser.Physics.P2.DistanceConstraint.prototype.constructor = Phaser.Physics.P2.DistanceConstraint;
