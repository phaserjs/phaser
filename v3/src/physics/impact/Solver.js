var SeperateX = require('./SeperateX');
var SeperateY = require('./SeperateY');
var COLLIDES = require('./COLLIDES');
var Events = require('./events');

//  Impact Physics Solver

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

        world.events.dispatch(new Events.COLLIDE(bodyA, bodyB));
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

        world.events.dispatch(new Events.COLLIDE(bodyA, bodyB));
    }
};

module.exports = Solver;
