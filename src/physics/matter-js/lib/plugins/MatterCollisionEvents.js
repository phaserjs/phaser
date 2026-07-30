/**
 * @author       @dxu https://github.com/dxu/matter-collision-events
 * @author       Richard Davey <rich@phaser.io>
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var MatterCollisionEvents = {

    name: 'matter-collision-events',
    version: '0.1.6',
    for: 'matter-js@^0.20.0',
    silent: true,

    install: function (matter)
    {
        matter.after('Engine.create', function ()
        {
            matter.Events.on(this, 'collisionStart', function (event)
            {
                event.pairs.map(function (pair)
                {
                    var bodyA = pair.bodyA;
                    var bodyB = pair.bodyB;

                    if (bodyA.gameObject)
                    {
                        bodyA.gameObject.emit('collide', bodyA, bodyB, pair);
                    }

                    if (bodyB.gameObject)
                    {
                        bodyB.gameObject.emit('collide', bodyB, bodyA, pair);
                    }

                    matter.Events.trigger(bodyA, 'onCollide', { pair: pair });
                    matter.Events.trigger(bodyB, 'onCollide', { pair: pair });

                    if (bodyA.onCollideCallback)
                    {
                        bodyA.onCollideCallback(pair);
                    }

                    if (bodyB.onCollideCallback)
                    {
                        bodyB.onCollideCallback(pair);
                    }

                    if (bodyA.onCollideWith[bodyB.id])
                    {
                        bodyA.onCollideWith[bodyB.id](bodyB, pair);
                    }

                    if (bodyB.onCollideWith[bodyA.id])
                    {
                        bodyB.onCollideWith[bodyA.id](bodyA, pair);
                    }
                });
            });

            matter.Events.on(this, 'collisionActive', function (event)
            {
                event.pairs.map(function (pair)
                {
                    var bodyA = pair.bodyA;
                    var bodyB = pair.bodyB;

                    if (bodyA.gameObject)
                    {
                        bodyA.gameObject.emit('collideActive', bodyA, bodyB, pair);
                    }

                    if (bodyB.gameObject)
                    {
                        bodyB.gameObject.emit('collideActive', bodyB, bodyA, pair);
                    }

                    matter.Events.trigger(bodyA, 'onCollideActive', { pair: pair });
                    matter.Events.trigger(bodyB, 'onCollideActive', { pair: pair });

                    if (bodyA.onCollideActiveCallback)
                    {
                        bodyA.onCollideActiveCallback(pair);
                    }

                    if (bodyB.onCollideActiveCallback)
                    {
                        bodyB.onCollideActiveCallback(pair);
                    }
                });
            });

            matter.Events.on(this, 'collisionEnd', function (event)
            {
                event.pairs.map(function (pair)
                {
                    var bodyA = pair.bodyA;
                    var bodyB = pair.bodyB;

                    if (bodyA.gameObject)
                    {
                        bodyA.gameObject.emit('collideEnd', bodyA, bodyB, pair);
                    }

                    if (bodyB.gameObject)
                    {
                        bodyB.gameObject.emit('collideEnd', bodyB, bodyA, pair);
                    }

                    matter.Events.trigger(bodyA, 'onCollideEnd', { pair: pair });
                    matter.Events.trigger(bodyB, 'onCollideEnd', { pair: pair });

                    if (bodyA.onCollideEndCallback)
                    {
                        bodyA.onCollideEndCallback(pair);
                    }

                    if (bodyB.onCollideEndCallback)
                    {
                        bodyB.onCollideEndCallback(pair);
                    }
                });
            });
        });
    }
};

module.exports = MatterCollisionEvents;
