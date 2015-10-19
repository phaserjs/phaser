/**
* @author       Richard Davey <rich@photonstorm.com>
* @copyright    2015 Photon Storm Ltd.
* @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
*/

/**
* A constraint that tries to keep the distance between two bodies constant.
*
* @class Phaser.Physics.P2.DistanceConstraint
* @constructor
* @param {Phaser.Physics.P2} world - A reference to the P2 World.
* @param {p2.Body} bodyA - First connected body.
* @param {p2.Body} bodyB - Second connected body.
* @param {number} distance - The distance to keep between the bodies.
* @param {Array} [localAnchorA] - The anchor point for bodyA, defined locally in bodyA frame. Defaults to [0,0].
* @param {Array} [localAnchorB] - The anchor point for bodyB, defined locally in bodyB frame. Defaults to [0,0].
* @param {object} [maxForce=Number.MAX_VALUE] - Maximum force to apply.
*/
Phaser.Physics.P2.DistanceConstraint = function (world, bodyA, bodyB, distance, localAnchorA, localAnchorB, maxForce) {

    if (distance === undefined) { distance = 100; }
    if (localAnchorA === undefined) { localAnchorA = [0, 0]; }
    if (localAnchorB === undefined) { localAnchorB = [0, 0]; }
    if (maxForce === undefined) { maxForce = Number.MAX_VALUE; }

    /**
    * @property {Phaser.Game} game - Local reference to game.
    */
    this.game = world.game;

    /**
    * @property {Phaser.Physics.P2} world - Local reference to P2 World.
    */
    this.world = world;

    distance = world.pxm(distance);

    localAnchorA = [ world.pxmi(localAnchorA[0]), world.pxmi(localAnchorA[1]) ];
    localAnchorB = [ world.pxmi(localAnchorB[0]), world.pxmi(localAnchorB[1]) ];

    var options = { distance: distance, localAnchorA: localAnchorA, localAnchorB: localAnchorB, maxForce: maxForce };

    p2.DistanceConstraint.call(this, bodyA, bodyB, options);

};

Phaser.Physics.P2.DistanceConstraint.prototype = Object.create(p2.DistanceConstraint.prototype);
Phaser.Physics.P2.DistanceConstraint.prototype.constructor = Phaser.Physics.P2.DistanceConstraint;
