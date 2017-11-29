var Bounds = require('./lib/geometry/Bounds');
var Class = require('../../utils/Class');
var Composite = require('./lib/body/Composite');
var Constraint = require('./lib/constraint/Constraint');
var Detector = require('./lib/collision/Detector');
var GetFastValue = require('../../utils/object/GetFastValue');
var Merge = require('../../utils/object/Merge');
var Sleeping = require('./lib/core/Sleeping');
var Vertices = require('./lib/geometry/Vertices');

var PointerConstraint = new Class({

    initialize:

    function PointerConstraint (scene, world, options)
    {
        if (options === undefined) { options = {}; }

        //  Defaults
        var defaults = {
            label: 'Pointer Constraint',
            pointA: { x: 0, y: 0 },
            pointB: { x: 0, y: 0 },
            damping: 0,
            length: 0.01,
            stiffness: 0.1,
            angularStiffness: 1,
            collisionFilter: {
                category: 0x0001,
                mask: 0xFFFFFFFF,
                group: 0
            }
        };

        this.scene = scene;

        this.world = world;

        var camera = GetFastValue(options, 'camera', null);

        if (!camera)
        {
            this.camera = scene.sys.cameras.main;
        }
        else
        {
            this.camera = camera;

            delete options.camera;
        }

        this.pointer = null;

        this.active = true;

        this.constraint = Constraint.create(Merge(options, defaults));

        this.world.events.on('BEFORE_UPDATE_EVENT', this.update, 0, this);

        scene.sys.events.on('POINTER_DOWN_EVENT', this.onDown, 0, this);

        scene.sys.events.on('POINTER_UP_EVENT', this.onUp, 0, this);
    },

    onDown: function (event)
    {
        this.pointer = event.pointer;
    },

    onUp: function (event)
    {
        this.pointer = null;
    },

    getBodyPart: function (body, position)
    {
        var constraint = this.constraint;

        var start = (body.parts.length > 1) ? 1 : 0;

        for (var i = start; i < body.parts.length; i++)
        {
            var part = body.parts[i];

            if (Vertices.contains(part.vertices, position))
            {
                constraint.bodyB = body;

                constraint.pointA.x = position.x;
                constraint.pointA.y = position.y;

                constraint.pointB.x = position.x - body.position.x;
                constraint.pointB.y = position.y - body.position.y;

                constraint.angleB = body.angle;

                Sleeping.set(body, false);

                return true;
            }
        }
        
        return false;
    },

    update: function ()
    {
        if (!this.active)
        {
            return;
        }

        var pointer = this.pointer;
        var constraint = this.constraint;

        if (!pointer)
        {
            //  Pointer is up / released
            if (constraint.bodyB)
            {
                constraint.bodyB = null;
            }
        }
        else
        {
            var position = this.camera.worldToCamera({ x: pointer.position.x, y: pointer.position.y });

            if (constraint.bodyB)
            {
                //  Pointer is down and we have bodyB, so wake it up
                Sleeping.set(constraint.bodyB, false);

                constraint.pointA.x = position.x;
                constraint.pointA.y = position.y;
            }
            else
            {
                var bodies = Composite.allBodies(this.world.localWorld);

                //  Pointer is down and no bodyB, so check if we've hit anything
                for (var i = 0; i < bodies.length; i++)
                {
                    var body = bodies[i];

                    if (!body.ignorePointer && Bounds.contains(body.bounds, position) &&
                        Detector.canCollide(body.collisionFilter, constraint.collisionFilter))
                    {
                        if (this.getBodyPart(body, position))
                        {
                            break;
                        }
                    }
                }
            }
        }
    },

    destroy: function ()
    {
        this.world.remove(this.constraint);

        this.constraint = null;

        this.world.events.off('BEFORE_UPDATE_EVENT', this.update);

        this.scene.sys.events.off('POINTER_DOWN_EVENT', this.onDown, 0, this);

        this.scene.sys.events.off('POINTER_UP_EVENT', this.onUp, 0, this);
    }

});

module.exports = PointerConstraint;
