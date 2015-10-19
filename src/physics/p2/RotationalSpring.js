/**
* @author       Richard Davey <rich@photonstorm.com>
* @copyright    2015 Photon Storm Ltd.
* @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
*/

/**
* Creates a rotational spring, connecting two bodies. A spring can have a resting length, a stiffness and damping.
*
* @class Phaser.Physics.P2.RotationalSpring
* @constructor
* @param {Phaser.Physics.P2} world - A reference to the P2 World.
* @param {p2.Body} bodyA - First connected body.
* @param {p2.Body} bodyB - Second connected body.
* @param {number} [restAngle] - The relative angle of bodies at which the spring is at rest. If not given, it's set to the current relative angle between the bodies.
* @param {number} [stiffness=100] - Stiffness of the spring. A number >= 0.
* @param {number} [damping=1] - Damping of the spring. A number >= 0.
*/
Phaser.Physics.P2.RotationalSpring = function (world, bodyA, bodyB, restAngle, stiffness, damping) {

    /**
    * @property {Phaser.Game} game - Local reference to game.
    */
    this.game = world.game;

    /**
    * @property {Phaser.Physics.P2} world - Local reference to P2 World.
    */
    this.world = world;

    if (restAngle === undefined) { restAngle = null; }
    if (stiffness === undefined) { stiffness = 100; }
    if (damping === undefined) { damping = 1; }

    if (restAngle)
    {
        restAngle = world.pxm(restAngle);
    }

    var options = {
        restAngle: restAngle,
        stiffness: stiffness,
        damping: damping
    };

    /**
    * @property {p2.RotationalSpring} data - The actual p2 spring object.
    */
    this.data = new p2.RotationalSpring(bodyA, bodyB, options);

    this.data.parent = this;

};

Phaser.Physics.P2.Spring.prototype.constructor = Phaser.Physics.P2.Spring;
