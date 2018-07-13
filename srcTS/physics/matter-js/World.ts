/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

var Bodies = require('./lib/factory/Bodies');
var Class = require('../../utils/Class');
var Common = require('./lib/core/Common');
var Composite = require('./lib/body/Composite');
var Engine = require('./lib/core/Engine');
var EventEmitter = require('eventemitter3');
var GetFastValue = require('../../utils/object/GetFastValue');
var GetValue = require('../../utils/object/GetValue');
var MatterBody = require('./lib/body/Body');
var MatterEvents = require('./lib/core/Events');
var MatterTileBody = require('./MatterTileBody');
var MatterWorld = require('./lib/body/World');
var Vector = require('./lib/geometry/Vector');

/**
 * @classdesc
 * [description]
 *
 * @class World
 * @extends Phaser.Events.EventEmitter
 * @memberOf Phaser.Physics.Matter
 * @constructor
 * @since 3.0.0
 *
 * @param {Phaser.Scene} scene - [description]
 * @param {object} config - [description]
 */
var World = new Class({

    Extends: EventEmitter,

    initialize:

    function World (scene, config)
    {
        EventEmitter.call(this);

        /**
         * [description]
         *
         * @name Phaser.Physics.Matter.World#scene
         * @type {Phaser.Scene}
         * @since 3.0.0
         */
        this.scene = scene;

        /**
         * [description]
         *
         * @name Phaser.Physics.Matter.World#engine
         * @type {MatterJS.Engine}
         * @since 3.0.0
         */
        this.engine = Engine.create(config);

        /**
         * A `World` composite object that will contain all simulated bodies and constraints.
         *
         * @name Phaser.Physics.Matter.World#localWorld
         * @type {MatterJS.World}
         * @since 3.0.0
         */
        this.localWorld = this.engine.world;

        var gravity = GetValue(config, 'gravity', null);

        if (gravity)
        {
            this.setGravity(gravity.x, gravity.y, gravity.scale);
        }

        /**
         * An object containing the 4 wall bodies that bound the physics world.
         *
         * @name Phaser.Physics.Matter.World#walls
         * @type {object}
         * @since 3.0.0
         */
        this.walls = { left: null, right: null, top: null, bottom: null };

        if (GetFastValue(config, 'setBounds', false))
        {
            var boundsConfig = config['setBounds'];

            if (typeof boundsConfig === 'boolean')
            {
                this.setBounds();
            }
            else
            {
                var x = GetFastValue(boundsConfig, 'x', 0);
                var y = GetFastValue(boundsConfig, 'y', 0);
                var width = GetFastValue(boundsConfig, 'width', scene.sys.game.config.width);
                var height = GetFastValue(boundsConfig, 'height', scene.sys.game.config.height);
                var thickness = GetFastValue(boundsConfig, 'thickness', 64);
                var left = GetFastValue(boundsConfig, 'left', true);
                var right = GetFastValue(boundsConfig, 'right', true);
                var top = GetFastValue(boundsConfig, 'top', true);
                var bottom = GetFastValue(boundsConfig, 'bottom', true);

                this.setBounds(x, y, width, height, thickness, left, right, top, bottom);
            }
        }

        /**
         * [description]
         *
         * @name Phaser.Physics.Matter.World#enabled
         * @type {boolean}
         * @default true
         * @since 3.0.0
         */
        this.enabled = GetValue(config, 'enabled', true);

        /**
         * The correction argument is an optional Number that specifies the time correction factor to apply to the update.
         * This can help improve the accuracy of the simulation in cases where delta is changing between updates.
         * The value of correction is defined as delta / lastDelta, i.e. the percentage change of delta over the last step.
         * Therefore the value is always 1 (no correction) when delta constant (or when no correction is desired, which is the default).
         * See the paper on Time Corrected Verlet for more information.
         *
         * @name Phaser.Physics.Matter.World#correction
         * @type {number}
         * @default 1
         * @since 3.4.0
         */
        this.correction = GetValue(config, 'correction', 1);

        /**
         * This function is called every time the core game loop steps, which is bound to the
         * Request Animation Frame frequency unless otherwise modified.
         * 
         * The function is passed two values: `time` and `delta`, both of which come from the game step values.
         * 
         * It must return a number. This number is used as the delta value passed to Matter.Engine.update.
         * 
         * You can override this function with your own to define your own timestep.
         * 
         * If you need to update the Engine multiple times in a single game step then call
         * `World.update` as many times as required. Each call will trigger the `getDelta` function.
         * If you wish to have full control over when the Engine updates then see the property `autoUpdate`.
         *
         * You can also adjust the number of iterations that Engine.update performs.
         * Use the Scene Matter Physics config object to set the following properties:
         *
         * positionIterations (defaults to 6)
         * velocityIterations (defaults to 4)
         * constraintIterations (defaults to 2)
         *
         * Adjusting these values can help performance in certain situations, depending on the physics requirements
         * of your game.
         *
         * @name Phaser.Physics.Matter.World#getDelta
         * @type {function}
         * @since 3.4.0
         */
        this.getDelta = GetValue(config, 'getDelta', this.update60Hz);

        /**
         * Automatically call Engine.update every time the game steps.
         * If you disable this then you are responsible for calling `World.step` directly from your game.
         * If you call `set60Hz` or `set30Hz` then `autoUpdate` is reset to `true`.
         *
         * @name Phaser.Physics.Matter.World#autoUpdate
         * @type {boolean}
         * @default true
         * @since 3.4.0
         */
        this.autoUpdate = GetValue(config, 'autoUpdate', true);

        /**
         * [description]
         *
         * @name Phaser.Physics.Matter.World#drawDebug
         * @type {boolean}
         * @default false
         * @since 3.0.0
         */
        this.drawDebug = GetValue(config, 'debug', false);

        /**
         * [description]
         *
         * @name Phaser.Physics.Matter.World#debugGraphic
         * @type {Phaser.GameObjects.Graphics}
         * @since 3.0.0
         */
        this.debugGraphic;

        /**
         * [description]
         *
         * @name Phaser.Physics.Matter.World#defaults
         * @type {object}
         * @since 3.0.0
         */
        this.defaults = {
            debugShowBody: GetValue(config, 'debugShowBody', true),
            debugShowStaticBody: GetValue(config, 'debugShowStaticBody', true),
            debugShowVelocity: GetValue(config, 'debugShowVelocity', true),
            bodyDebugColor: GetValue(config, 'debugBodyColor', 0xff00ff),
            staticBodyDebugColor: GetValue(config, 'debugBodyColor', 0x0000ff),
            velocityDebugColor: GetValue(config, 'debugVelocityColor', 0x00ff00),
            debugShowJoint: GetValue(config, 'debugShowJoint', true),
            jointDebugColor: GetValue(config, 'debugJointColor', 0x000000)
        };

        if (this.drawDebug)
        {
            this.createDebugGraphic();
        }

        this.setEventsProxy();
    },

    /**
     * [description]
     *
     * @method Phaser.Physics.Matter.World#setEventsProxy
     * @since 3.0.0
     */
    setEventsProxy: function ()
    {
        var _this = this;
        var engine = this.engine;

        MatterEvents.on(engine, 'beforeUpdate', function (event)
        {
            _this.emit('beforeupdate', event);
        });

        MatterEvents.on(engine, 'afterUpdate', function (event)
        {
            _this.emit('afterupdate', event);
        });

        MatterEvents.on(engine, 'collisionStart', function (event)
        {
            var pairs = event.pairs;
            var bodyA;
            var bodyB;

            if (pairs.length > 0)
            {
                bodyA = pairs[0].bodyA;
                bodyB = pairs[0].bodyB;
            }

            _this.emit('collisionstart', event, bodyA, bodyB);
        });

        MatterEvents.on(engine, 'collisionActive', function (event)
        {
            var pairs = event.pairs;
            var bodyA;
            var bodyB;

            if (pairs.length > 0)
            {
                bodyA = pairs[0].bodyA;
                bodyB = pairs[0].bodyB;
            }

            _this.emit('collisionactive', event, bodyA, bodyB);
        });

        MatterEvents.on(engine, 'collisionEnd', function (event)
        {
            var pairs = event.pairs;
            var bodyA;
            var bodyB;

            if (pairs.length > 0)
            {
                bodyA = pairs[0].bodyA;
                bodyB = pairs[0].bodyB;
            }

            _this.emit('collisionend', event, bodyA, bodyB);
        });
    },

    /**
     * Sets the bounds of the Physics world to match the given world pixel dimensions.
     * You can optionally set which 'walls' to create: left, right, top or bottom.
     * If none of the walls are given it will default to use the walls settings it had previously.
     * I.e. if you previously told it to not have the left or right walls, and you then adjust the world size
     * the newly created bounds will also not have the left and right walls.
     * Explicitly state them in the parameters to override this.
     *
     * @method Phaser.Physics.Matter.World#setBounds
     * @since 3.0.0
     *
     * @param {number} [x=0] - The x coordinate of the top-left corner of the bounds.
     * @param {number} [y=0] - The y coordinate of the top-left corner of the bounds.
     * @param {number} [width] - The width of the bounds.
     * @param {number} [height] - The height of the bounds.
     * @param {number} [thickness=128] - The thickness of each wall, in pixels.
     * @param {boolean} [left=true] - If true will create the left bounds wall.
     * @param {boolean} [right=true] - If true will create the right bounds wall.
     * @param {boolean} [top=true] - If true will create the top bounds wall.
     * @param {boolean} [bottom=true] - If true will create the bottom bounds wall.
     *
     * @return {Phaser.Physics.Matter.World} This Matter World object.
     */
    setBounds: function (x, y, width, height, thickness, left, right, top, bottom)
    {
        if (x === undefined) { x = 0; }
        if (y === undefined) { y = 0; }
        if (width === undefined) { width = this.scene.sys.game.config.width; }
        if (height === undefined) { height = this.scene.sys.game.config.height; }
        if (thickness === undefined) { thickness = 128; }
        if (left === undefined) { left = true; }
        if (right === undefined) { right = true; }
        if (top === undefined) { top = true; }
        if (bottom === undefined) { bottom = true; }

        this.updateWall(left, 'left', x - thickness, y, thickness, height);
        this.updateWall(right, 'right', x + width, y, thickness, height);
        this.updateWall(top, 'top', x, y - thickness, width, thickness);
        this.updateWall(bottom, 'bottom', x, y + height, width, thickness);

        return this;
    },

    //  position = 'left', 'right', 'top' or 'bottom'
    /**
     * [description]
     *
     * @method Phaser.Physics.Matter.World#updateWall
     * @since 3.0.0
     *
     * @param {boolean} add - [description]
     * @param {string} position - [description]
     * @param {number} x - [description]
     * @param {number} y - [description]
     * @param {number} width - [description]
     * @param {number} height - [description]
     */
    updateWall: function (add, position, x, y, width, height)
    {
        var wall = this.walls[position];

        if (add)
        {
            if (wall)
            {
                MatterWorld.remove(this.localWorld, wall);
            }

            //  adjust center
            x += (width / 2);
            y += (height / 2);

            this.walls[position] = this.create(x, y, width, height, { isStatic: true, friction: 0, frictionStatic: 0 });
        }
        else
        {
            if (wall)
            {
                MatterWorld.remove(this.localWorld, wall);
            }

            this.walls[position] = null;
        }
    },

    /**
     * [description]
     *
     * @method Phaser.Physics.Matter.World#createDebugGraphic
     * @since 3.0.0
     *
     * @return {Phaser.GameObjects.Graphics} [description]
     */
    createDebugGraphic: function ()
    {
        var graphic = this.scene.sys.add.graphics({ x: 0, y: 0 });

        graphic.setDepth(Number.MAX_VALUE);

        this.debugGraphic = graphic;

        this.drawDebug = true;

        return graphic;
    },

    /**
     * [description]
     *
     * @method Phaser.Physics.Matter.World#disableGravity
     * @since 3.0.0
     *
     * @return {Phaser.Physics.Matter.World} This Matter World object.
     */
    disableGravity: function ()
    {
        this.localWorld.gravity.x = 0;
        this.localWorld.gravity.y = 0;
        this.localWorld.gravity.scale = 0;

        return this;
    },

    /**
     * [description]
     *
     * @method Phaser.Physics.Matter.World#setGravity
     * @since 3.0.0
     *
     * @param {number} [x=0] - [description]
     * @param {number} [y=1] - [description]
     * @param {number} [scale] - [description]
     *
     * @return {Phaser.Physics.Matter.World} This Matter World object.
     */
    setGravity: function (x, y, scale)
    {
        if (x === undefined) { x = 0; }
        if (y === undefined) { y = 1; }

        this.localWorld.gravity.x = x;
        this.localWorld.gravity.y = y;

        if (scale !== undefined)
        {
            this.localWorld.gravity.scale = scale;
        }

        return this;
    },

    /**
     * [description]
     *
     * @method Phaser.Physics.Matter.World#create
     * @since 3.0.0
     *
     * @param {number} x - [description]
     * @param {number} y - [description]
     * @param {number} width - [description]
     * @param {number} height - [description]
     * @param {object} options - [description]
     *
     * @return {MatterJS.Body} [description]
     */
    create: function (x, y, width, height, options)
    {
        var body = Bodies.rectangle(x, y, width, height, options);

        MatterWorld.add(this.localWorld, body);

        return body;
    },

    /**
     * [description]
     *
     * @method Phaser.Physics.Matter.World#add
     * @since 3.0.0
     *
     * @param {(object|object[])} object - Can be single or an array, and can be a body, composite or constraint
     *
     * @return {Phaser.Physics.Matter.World} This Matter World object.
     */
    add: function (object)
    {
        MatterWorld.add(this.localWorld, object);

        return this;
    },

    /**
     * [description]
     *
     * @method Phaser.Physics.Matter.World#remove
     * @since 3.0.0
     *
     * @param {object} object - The object to be removed from the world.
     * @param {boolean} deep - [description]
     *
     * @return {Phaser.Physics.Matter.World} This Matter World object.
     */
    remove: function (object, deep)
    {
        var body = (object.body) ? object.body : object;

        Composite.removeBody(this.localWorld, body, deep);

        return this;
    },

    /**
     * [description]
     *
     * @method Phaser.Physics.Matter.World#removeConstraint
     * @since 3.0.0
     *
     * @param {MatterJS.Constraint} constraint - [description]
     * @param {boolean} deep - [description]
     *
     * @return {Phaser.Physics.Matter.World} This Matter World object.
     */
    removeConstraint: function (constraint, deep)
    {
        Composite.remove(this.localWorld, constraint, deep);

        return this;
    },

    /**
     * Adds MatterTileBody instances for all the colliding tiles within the given tilemap layer. Set
     * the appropriate tiles in your layer to collide before calling this method!
     *
     * @method Phaser.Physics.Matter.World#convertTilemapLayer
     * @since 3.0.0
     *
     * @param {(Phaser.Tilemaps.DynamicTilemapLayer|Phaser.Tilemaps.StaticTilemapLayer)} tilemapLayer -
     * An array of tiles.
     * @param {object} [options] - Options to be passed to the MatterTileBody constructor. {@ee Phaser.Physics.Matter.TileBody}
     *
     * @return {Phaser.Physics.Matter.World} This Matter World object.
     */
    convertTilemapLayer: function (tilemapLayer, options)
    {
        var layerData = tilemapLayer.layer;
        var tiles = tilemapLayer.getTilesWithin(0, 0, layerData.width, layerData.height, {isColliding: true});

        this.convertTiles(tiles, options);

        return this;
    },

    /**
     * Adds MatterTileBody instances for the given tiles. This adds bodies regardless of whether the
     * tiles are set to collide or not.
     *
     * @method Phaser.Physics.Matter.World#convertTiles
     * @since 3.0.0
     *
     * @param {Phaser.Tilemaps.Tile[]} tiles - An array of tiles.
     * @param {object} [options] - Options to be passed to the MatterTileBody constructor. {@see Phaser.Physics.Matter.TileBody}
     *
     * @return {Phaser.Physics.Matter.World} This Matter World object.
     */
    convertTiles: function (tiles, options)
    {
        if (tiles.length === 0)
        {
            return this;
        }

        for (var i = 0; i < tiles.length; i++)
        {
            new MatterTileBody(this, tiles[i], options);
        }

        return this;
    },

    /**
     * [description]
     *
     * @method Phaser.Physics.Matter.World#nextGroup
     * @since 3.0.0
     *
     * @param {boolean} isNonColliding - [description]
     *
     * @return {number} [description]
     */
    nextGroup: function (isNonColliding)
    {
        return MatterBody.nextGroup(isNonColliding);
    },

    /**
     * [description]
     *
     * @method Phaser.Physics.Matter.World#nextCategory
     * @since 3.0.0
     *
     * @return {number} [description]
     */
    nextCategory: function ()
    {
        return MatterBody.nextCategory();
    },

    /**
     * [description]
     *
     * @method Phaser.Physics.Matter.World#pause
     * @since 3.0.0
     *
     * @return {Phaser.Physics.Matter.World} This Matter World object.
     */
    pause: function ()
    {
        this.enabled = false;

        this.emit('pause');

        return this;
    },

    /**
     * [description]
     *
     * @method Phaser.Physics.Matter.World#resume
     * @since 3.0.0
     *
     * @return {Phaser.Physics.Matter.World} This Matter World object.
     */
    resume: function ()
    {
        this.enabled = true;

        this.emit('resume');

        return this;
    },

    /**
     * [description]
     *
     * @method Phaser.Physics.Matter.World#update
     * @since 3.0.0
     *
     * @param {number} time - [description]
     * @param {number} delta - [description]
     */
    update: function (time, delta)
    {
        if (this.enabled && this.autoUpdate)
        {
            Engine.update(this.engine, this.getDelta(time, delta), this.correction);
        }
    },

    /**
     * Manually advances the physics simulation by one iteration.
     * 
     * You can optionally pass in the `delta` and `correction` values to be used by Engine.update.
     * If undefined they use the Matter defaults of 60Hz and no correction.
     * 
     * Calling `step` directly bypasses any checks of `enabled` or `autoUpdate`.
     * 
     * It also ignores any custom `getDelta` functions, as you should be passing the delta
     * value in to this call.
     *
     * You can adjust the number of iterations that Engine.update performs internally.
     * Use the Scene Matter Physics config object to set the following properties:
     *
     * positionIterations (defaults to 6)
     * velocityIterations (defaults to 4)
     * constraintIterations (defaults to 2)
     *
     * Adjusting these values can help performance in certain situations, depending on the physics requirements
     * of your game.
     *
     * @method Phaser.Physics.Matter.World#step
     * @since 3.4.0
     *
     * @param {number} [delta=16.666] - [description]
     * @param {number} [correction=1] - [description]
     */
    step: function (delta, correction)
    {
        Engine.update(this.engine, delta, correction);
    },

    /**
     * Runs the Matter Engine.update at a fixed timestep of 60Hz.
     *
     * @method Phaser.Physics.Matter.World#update60Hz
     * @since 3.4.0
     *
     * @return {number} The delta value to be passed to Engine.update.
     */
    update60Hz: function ()
    {
        return 1000 / 60;
    },

    /**
     * Runs the Matter Engine.update at a fixed timestep of 30Hz.
     *
     * @method Phaser.Physics.Matter.World#update30Hz
     * @since 3.4.0
     *
     * @return {number} The delta value to be passed to Engine.update.
     */
    update30Hz: function ()
    {
        return 1000 / 30;
    },

    /**
     * [description]
     *
     * @method Phaser.Physics.Matter.World#postUpdate
     * @since 3.0.0
     */
    postUpdate: function ()
    {
        if (!this.drawDebug)
        {
            return;
        }

        var graphics = this.debugGraphic;
        var bodies = Composite.allBodies(this.localWorld);

        graphics.clear();
        graphics.lineStyle(1, this.defaults.bodyDebugColor);
        graphics.beginPath();

        var i,j;

        for (i = 0; i < bodies.length; i++)
        {
            if (!bodies[i].render.visible)
            {
                return;
            }

            // Handle drawing both single bodies and compound bodies. If compound, draw both the
            // convex hull (first part) and the rest of the bodies.
            for (j = 0; j < bodies[i].parts.length; j++)
            {
                var body = bodies[i].parts[j];

                var vertices = body.vertices;

                graphics.moveTo(vertices[0].x, vertices[0].y);

                for (var k = 1; k < vertices.length; k++)
                {
                    graphics.lineTo(vertices[k].x, vertices[k].y);
                }

                graphics.lineTo(vertices[0].x, vertices[0].y);

                graphics.strokePath();
            }
        }

        graphics.closePath();

        if (this.defaults.debugShowJoint)
        {
            graphics.lineStyle(2, this.defaults.jointDebugColor);

            // Render constraints 
            var constraints = Composite.allConstraints(this.localWorld);

            for (i = 0; i < constraints.length; i++)
            {
                var constraint = constraints[i];

                if (!constraint.render.visible || !constraint.pointA || !constraint.pointB)
                {
                    continue;
                }

                if (constraint.render.lineWidth)
                {
                    graphics.lineStyle(constraint.render.lineWidth, Common.colorToNumber(constraint.render.strokeStyle));
                }

                var bodyA = constraint.bodyA;
                var bodyB = constraint.bodyB;
                var start;
                var end;

                if (bodyA)
                {
                    start = Vector.add(bodyA.position, constraint.pointA);
                }
                else
                {
                    start = constraint.pointA;
                }

                if (constraint.render.type === 'pin')
                {
                    graphics.beginPath();
                    graphics.arc(start.x, start.y, 3, 0, 2 * Math.PI);
                    graphics.closePath();
                }
                else
                {
                    if (bodyB)
                    {
                        end = Vector.add(bodyB.position, constraint.pointB);
                    }
                    else
                    {
                        end = constraint.pointB;
                    }

                    graphics.beginPath();
                    graphics.moveTo(start.x, start.y);

                    if (constraint.render.type === 'spring')
                    {
                        var delta = Vector.sub(end, start);
                        var normal = Vector.perp(Vector.normalise(delta));
                        var coils = Math.ceil(Common.clamp(constraint.length / 5, 12, 20));
                        var offset;

                        for (j = 1; j < coils; j += 1)
                        {
                            offset = (j % 2 === 0) ? 1 : -1;

                            graphics.lineTo(
                                start.x + delta.x * (j / coils) + normal.x * offset * 4,
                                start.y + delta.y * (j / coils) + normal.y * offset * 4
                            );
                        }
                    }

                    graphics.lineTo(end.x, end.y);
                }

                if (constraint.render.lineWidth)
                {
                    graphics.strokePath();
                }

                if (constraint.render.anchors)
                {
                    graphics.fillStyle(Common.colorToNumber(constraint.render.strokeStyle));
                    graphics.beginPath();
                    graphics.arc(start.x, start.y, 6, 0, 2 * Math.PI);
                    graphics.arc(end.x, end.y, 6, 0, 2 * Math.PI);
                    graphics.closePath();
                    graphics.fillPath();
                }
            }
        }
    },

    /**
     * [description]
     *
     * @method Phaser.Physics.Matter.World#fromPath
     * @since 3.0.0
     *
     * @param {string} path - [description]
     * @param {array} points - [description]
     *
     * @return {array} [description]
     */
    fromPath: function (path, points)
    {
        if (points === undefined) { points = []; }

        // var pathPattern = /L?\s*([-\d.e]+)[\s,]*([-\d.e]+)*/ig;

        // eslint-disable-next-line no-useless-escape
        var pathPattern = /L?\s*([\-\d\.e]+)[\s,]*([\-\d\.e]+)*/ig;

        path.replace(pathPattern, function (match, x, y)
        {
            points.push({ x: parseFloat(x), y: parseFloat(y) });
        });

        return points;
    },

    /**
     * [description]
     *
     * @method Phaser.Physics.Matter.World#shutdown
     * @since 3.0.0
     */
    shutdown: function ()
    {
        MatterEvents.off(this.engine);

        this.removeAllListeners();

        MatterWorld.clear(this.localWorld, false);

        Engine.clear(this.engine);
    },

    /**
     * [description]
     *
     * @method Phaser.Physics.Matter.World#destroy
     * @since 3.0.0
     */
    destroy: function ()
    {
        this.shutdown();
    }

});

module.exports = World;
