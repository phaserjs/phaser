/**
* @author       Richard Davey <rich@photonstorm.com>
* @copyright    2014 Photon Storm Ltd.
* @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
*/

/**
* Connects two bodies at given offset points, letting them rotate relative to each other around this point.
*
* @class Phaser.Physics.P2.PrismaticConstraint
* @classdesc Physics PrismaticConstraint Constructor
* @constructor
* @param {Phaser.Physics.P2} world - A reference to the P2 World.
* @param {p2.Body} bodyA - First connected body.
* @param {p2.Body} bodyB - Second connected body.
* @param {number} [angle=0] - The relative angle
* @param {number} [ratio=1] - The gear ratio.
*/
Phaser.Physics.P2.PrismaticConstraint = function (world, bodyA, bodyB, angle, ratio) {

    if (typeof angle === 'undefined') { angle = 0; }
    if (typeof ratio === 'undefined') { ratio = 1; }

    /**
    * @property {Phaser.Game} game - Local reference to game.
    */
    this.game = world.game;

    /**
    * @property {Phaser.Physics.P2} world - Local reference to P2 World.
    */
    this.world = world;

    var options = { angle: angle, ratio: ratio };

    p2.PrismaticConstraint.call(this, bodyA, bodyB, options);

}

Phaser.Physics.P2.PrismaticConstraint.prototype = Object.create(p2.PrismaticConstraint.prototype);
Phaser.Physics.P2.PrismaticConstraint.prototype.constructor = Phaser.Physics.P2.PrismaticConstraint;
