/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

var COLLIDES = require('./COLLIDES');
var SeperateX = require('./SeperateX');
var SeperateY = require('./SeperateY');

/**
 * Impact Physics Solver
 *
 * @function Phaser.Physics.Impact.Solver
 * @since 3.0.0
 *
 * @param {Phaser.Physics.Impact.World} world - [description]
 * @param {Phaser.Physics.Impact.Body} bodyA - [description]
 * @param {Phaser.Physics.Impact.Body} bodyB - [description]
 */
var Solver = function (world, bodyA, bodyB)
{
    var weak = null;

    if (bodyA.collides === COLLIDES.LITE || bodyB.collides === COLLIDES.FIXED)
    {
        weak = bodyA;
    }
    else if (bodyB.collides === COLLIDES.LITE || bodyA.collides === COLLIDES.FIXED)
    {
        weak = bodyB;
    }

    if (bodyA.last.x + bodyA.size.x > bodyB.last.x && bodyA.last.x < bodyB.last.x + bodyB.size.x)
    {
        if (bodyA.last.y < bodyB.last.y)
        {
            SeperateY(world, bodyA, bodyB, weak);
        }
        else
        {
            SeperateY(world, bodyB, bodyA, weak);
        }

        bodyA.collideWith(bodyB, 'y');
        bodyB.collideWith(bodyA, 'y');

        world.emit('collide', bodyA, bodyB, 'y');
    }
    else if (bodyA.last.y + bodyA.size.y > bodyB.last.y && bodyA.last.y < bodyB.last.y + bodyB.size.y)
    {
        if (bodyA.last.x < bodyB.last.x)
        {
            SeperateX(world, bodyA, bodyB, weak);
        }
        else
        {
            SeperateX(world, bodyB, bodyA, weak);
        }

        bodyA.collideWith(bodyB, 'x');
        bodyB.collideWith(bodyA, 'x');

        world.emit('collide', bodyA, bodyB, 'x');
    }
};

module.exports = Solver;
