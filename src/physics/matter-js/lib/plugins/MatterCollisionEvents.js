/**
 * @author       @dxu https://github.com/dxu/matter-collision-events
 * @author       Richard Davey <rich@photonstorm.com>
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var MatterCollisionEvents = {

    name: 'matter-collision-events',
    version: '0.1.6',
    for: 'matter-js@^0.14.2',
    silent: true,

    install: function (matter)
    {
        matter.after('Body.create', function (body)
        {
            body.onCollideCallback;
            body.onCollideEndCallback;
            body.onCollideActiveCallback;

            body.setOnCollide = function (callback)
            {
                this.onCollideCallback = callback;

                return this;
            }

            body.setOnCollideEnd = function (callback)
            {
                this.onCollideEndCallback = callback;

                return this;
            }

            body.setOnCollideActive = function (callback)
            {
                this.onCollideActiveCallback = callback;

                return this;
            }
        });
      
        matter.after('Engine.create', function ()
        {
            matter.Events.on(this, 'collisionStart', function (event)
            {
                event.pairs.map(function (pair)
                {
                    var bodyA = pair.bodyA;
                    var bodyB = pair.bodyB;

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
                });
            });

            matter.Events.on(this, 'collisionActive', function (event)
            {
                event.pairs.map(function (pair)
                {
                    var bodyA = pair.bodyA;
                    var bodyB = pair.bodyB;

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
