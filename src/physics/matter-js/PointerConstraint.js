/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

var Bounds = require('./lib/geometry/Bounds');
var Class = require('../../utils/Class');
var Composite = require('./lib/body/Composite');
var Constraint = require('./lib/constraint/Constraint');
var Detector = require('./lib/collision/Detector');
var GetFastValue = require('../../utils/object/GetFastValue');
var Merge = require('../../utils/object/Merge');
var Sleeping = require('./lib/core/Sleeping');
var Vector2 = require('../../math/Vector2');
var Vertices = require('./lib/geometry/Vertices');

/**
 * @classdesc
 * [description]
 *
 * @class PointerConstraint
 * @memberOf Phaser.Physics.Matter
 * @constructor
 * @since 3.0.0
 *
 * @param {Phaser.Scene} scene - [description]
 * @param {Phaser.Physics.Matter.World} world - [description]
 * @param {object} options - [description]
 */
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

        /**
         * [description]
         *
         * @name Phaser.Physics.Matter.PointerConstraint#scene
         * @type {Phaser.Scene}
         * @since 3.0.0
         */
        this.scene = scene;

        /**
         * [description]
         *
         * @name Phaser.Physics.Matter.PointerConstraint#world
         * @type {Phaser.Physics.Matter.World}
         * @since 3.0.0
         */
        this.world = world;

        /**
         * [description]
         *
         * @name Phaser.Physics.Matter.PointerConstraint#camera
         * @type {Phaser.Cameras.Scene2D.Camera}
         * @since 3.0.0
         */
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

        /**
         * [description]
         *
         * @name Phaser.Physics.Matter.PointerConstraint#pointer
         * @type {Phaser.Input.Pointer}
         * @default null
         * @since 3.0.0
         */
        this.pointer = null;

        /**
         * [description]
         *
         * @name Phaser.Physics.Matter.PointerConstraint#active
         * @type {boolean}
         * @default true
         * @since 3.0.0
         */
        this.active = true;

        /**
         * The transformed position.
         *
         * @name Phaser.Physics.Matter.PointerConstraint#position
         * @type {Phaser.Math.Vector2}
         * @since 3.0.0
         */
        this.position = new Vector2();

        /**
         * [description]
         *
         * @name Phaser.Physics.Matter.PointerConstraint#constraint
         * @type {object}
         * @since 3.0.0
         */
        this.constraint = Constraint.create(Merge(options, defaults));

        this.world.on('beforeupdate', this.update, this);

        scene.sys.input.on('pointerdown', this.onDown, this);

        scene.sys.input.on('pointerup', this.onUp, this);
    },

    /**
     * [description]
     *
     * @method Phaser.Physics.Matter.PointerConstraint#onDown
     * @since 3.0.0
     *
     * @param {Phaser.Input.Pointer} pointer - [description]
     */
    onDown: function (pointer)
    {
        this.pointer = pointer;
    },

    /**
     * [description]
     *
     * @method Phaser.Physics.Matter.PointerConstraint#onUp
     * @since 3.0.0
     */
    onUp: function ()
    {
        this.pointer = null;
    },

    /**
     * [description]
     *
     * @method Phaser.Physics.Matter.PointerConstraint#getBodyPart
     * @since 3.0.0
     *
     * @param {MatterJS.Body} body - [description]
     * @param {Phaser.Math.Vector2} position - [description]
     *
     * @return {boolean} [description]
     */
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

    /**
     * [description]
     *
     * @method Phaser.Physics.Matter.PointerConstraint#update
     * @since 3.0.0
     */
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
            var pos = this.position;

            this.camera.getWorldPoint(pointer.x, pointer.y, pos);

            if (constraint.bodyB)
            {
                //  Pointer is down and we have bodyB, so wake it up
                Sleeping.set(constraint.bodyB, false);

                constraint.pointA.x = pos.x;
                constraint.pointA.y = pos.y;
            }
            else
            {
                var bodies = Composite.allBodies(this.world.localWorld);

                //  Pointer is down and no bodyB, so check if we've hit anything
                for (var i = 0; i < bodies.length; i++)
                {
                    var body = bodies[i];

                    if (!body.ignorePointer && Bounds.contains(body.bounds, pos) &&
                        Detector.canCollide(body.collisionFilter, constraint.collisionFilter))
                    {
                        if (this.getBodyPart(body, pos))
                        {
                            break;
                        }
                    }
                }
            }
        }
    },

    /**
     * [description]
     *
     * @method Phaser.Physics.Matter.PointerConstraint#destroy
     * @since 3.0.0
     */
    destroy: function ()
    {
        this.world.removeConstraint(this.constraint);

        this.constraint = null;

        this.world.off('beforeupdate', this.update);

        this.scene.sys.input.off('pointerdown', this.onDown, this);

        this.scene.sys.input.off('pointerup', this.onUp, this);
    }

});

module.exports = PointerConstraint;
