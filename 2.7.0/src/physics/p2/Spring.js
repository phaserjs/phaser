/**
* @author       Richard Davey <rich@photonstorm.com>
* @copyright    2016 Photon Storm Ltd.
* @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
*/

/**
* Creates a linear spring, connecting two bodies. A spring can have a resting length, a stiffness and damping.
*
* @class Phaser.Physics.P2.Spring
* @constructor
* @param {Phaser.Physics.P2} world - A reference to the P2 World.
* @param {p2.Body} bodyA - First connected body.
* @param {p2.Body} bodyB - Second connected body.
* @param {number} [restLength=1] - Rest length of the spring. A number > 0.
* @param {number} [stiffness=100] - Stiffness of the spring. A number >= 0.
* @param {number} [damping=1] - Damping of the spring. A number >= 0.
* @param {Array} [worldA] - Where to hook the spring to body A in world coordinates. This value is an array with 2 elements matching x and y, i.e: [32, 32].
* @param {Array} [worldB] - Where to hook the spring to body B in world coordinates. This value is an array with 2 elements matching x and y, i.e: [32, 32].
* @param {Array} [localA] - Where to hook the spring to body A in local body coordinates. This value is an array with 2 elements matching x and y, i.e: [32, 32].
* @param {Array} [localB] - Where to hook the spring to body B in local body coordinates. This value is an array with 2 elements matching x and y, i.e: [32, 32].
*/
Phaser.Physics.P2.Spring = function (world, bodyA, bodyB, restLength, stiffness, damping, worldA, worldB, localA, localB) {

    /**
    * @property {Phaser.Game} game - Local reference to game.
    */
    this.game = world.game;

    /**
    * @property {Phaser.Physics.P2} world - Local reference to P2 World.
    */
    this.world = world;

    if (restLength === undefined) { restLength = 1; }
    if (stiffness === undefined) { stiffness = 100; }
    if (damping === undefined) { damping = 1; }

    restLength = world.pxm(restLength);

    var options = {
        restLength: restLength,
        stiffness: stiffness,
        damping: damping
    };

    if (typeof worldA !== 'undefined' && worldA !== null)
    {
        options.worldAnchorA = [ world.pxm(worldA[0]), world.pxm(worldA[1]) ];
    }

    if (typeof worldB !== 'undefined' && worldB !== null)
    {
        options.worldAnchorB = [ world.pxm(worldB[0]), world.pxm(worldB[1]) ];
    }

    if (typeof localA !== 'undefined' && localA !== null)
    {
        options.localAnchorA = [ world.pxm(localA[0]), world.pxm(localA[1]) ];
    }

    if (typeof localB !== 'undefined' && localB !== null)
    {
        options.localAnchorB = [ world.pxm(localB[0]), world.pxm(localB[1]) ];
    }

    /**
    * @property {p2.LinearSpring} data - The actual p2 spring object.
    */
    this.data = new p2.LinearSpring(bodyA, bodyB, options);

    this.data.parent = this;

};

Phaser.Physics.P2.Spring.prototype.constructor = Phaser.Physics.P2.Spring;
