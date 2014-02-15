/**
* @author       Richard Davey <rich@photonstorm.com>
* @copyright    2014 Photon Storm Ltd.
* @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
*/

/**
* Creates a spring, connecting two bodies.
*
* @class Phaser.Physics.Spring
* @classdesc Physics Spring Constructor
* @constructor
* @param {Phaser.Game} game - A reference to the current game.
* @param {p2.Body} bodyA - First connected body.
* @param {p2.Body} bodyB - Second connected body.
* @param {number} [restLength=1] - Rest length of the spring. A number > 0.
* @param {number} [stiffness=100] - Stiffness of the spring. A number >= 0.
* @param {number} [damping=1] - Damping of the spring. A number >= 0.
* @param {Array} [worldA] - Where to hook the spring to body A, in world coordinates, i.e. [32, 32].
* @param {Array} [worldB] - Where to hook the spring to body B, in world coordinates, i.e. [32, 32].
* @param {Array} [localA] - Where to hook the spring to body A, in local body coordinates.
* @param {Array} [localB] - Where to hook the spring to body B, in local body coordinates.
*/
Phaser.Physics.Spring = function (game, bodyA, bodyB, restLength, stiffness, damping, worldA, worldB, localA, localB) {

    /**
    * @property {Phaser.Game} game - Local reference to game.
    */
    this.game = game;

    if (typeof restLength === 'undefined') { restLength = 1; }
    if (typeof stiffness === 'undefined') { stiffness = 100; }
    if (typeof damping === 'undefined') { damping = 1; }

    var options = {
        restLength: restLength,
        stiffness: stiffness,
        damping: damping
    };

    if (typeof worldA !== 'undefined')
    {
        options.worldAnchorA = [ game.math.px2p(worldA[0]), game.math.px2p(worldA[1]) ];
    }

    if (typeof worldB !== 'undefined')
    {
        options.worldAnchorB = [ game.math.px2p(worldB[0]), game.math.px2p(worldB[1]) ];
    }

    if (typeof localA !== 'undefined')
    {
        options.localAnchorA = [ game.math.px2p(localA[0]), game.math.px2p(localA[1]) ];
    }

    if (typeof localB !== 'undefined')
    {
        options.localAnchorB = [ game.math.px2p(localB[0]), game.math.px2p(localB[1]) ];
    }

    p2.Spring.call(this, bodyA, bodyB, options);

}

Phaser.Physics.Spring.prototype = Object.create(p2.Spring.prototype);
Phaser.Physics.Spring.prototype.constructor = Phaser.Physics.Spring;
