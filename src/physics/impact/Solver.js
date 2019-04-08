/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2019 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

var COLLIDES = require('./COLLIDES');
var Events = require('./events');
var SeparateX = require('./SeparateX');
var SeparateY = require('./SeparateY');

/**
 * Impact Physics Solver
 *
 * @function Phaser.Physics.Impact.Solver
 * @fires Phaser.Physics.Impact.Events#COLLIDE
 * @since 3.0.0
 *
 * @param {Phaser.Physics.Impact.World} world - The Impact simulation to run the solver in.
 * @param {Phaser.Physics.Impact.Body} bodyA - The first body in the collision.
 * @param {Phaser.Physics.Impact.Body} bodyB - The second body in the collision.
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
            SeparateY(world, bodyA, bodyB, weak);
        }
        else
        {
            SeparateY(world, bodyB, bodyA, weak);
        }

        bodyA.collideWith(bodyB, 'y');
        bodyB.collideWith(bodyA, 'y');

        world.emit(Events.COLLIDE, bodyA, bodyB, 'y');
    }
    else if (bodyA.last.y + bodyA.size.y > bodyB.last.y && bodyA.last.y < bodyB.last.y + bodyB.size.y)
    {
        if (bodyA.last.x < bodyB.last.x)
        {
            SeparateX(world, bodyA, bodyB, weak);
        }
        else
        {
            SeparateX(world, bodyB, bodyA, weak);
        }

        bodyA.collideWith(bodyB, 'x');
        bodyB.collideWith(bodyA, 'x');

        world.emit(Events.COLLIDE, bodyA, bodyB, 'x');
    }
};

module.exports = Solver;
