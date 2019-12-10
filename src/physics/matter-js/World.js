/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2019 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Bodies = require('./lib/factory/Bodies');
var Body = require('./lib/body/Body');
var Class = require('../../utils/Class');
var Common = require('./lib/core/Common');
var Composite = require('./lib/body/Composite');
var Engine = require('./lib/core/Engine');
var EventEmitter = require('eventemitter3');
var Events = require('./events');
var GetFastValue = require('../../utils/object/GetFastValue');
var GetValue = require('../../utils/object/GetValue');
var MatterBody = require('./lib/body/Body');
var MatterEvents = require('./lib/core/Events');
var MatterTileBody = require('./MatterTileBody');
var MatterWorld = require('./lib/body/World');
var Vector = require('./lib/geometry/Vector');

/**
 * @classdesc
 * The Matter World class is responsible for managing one single instance of a Matter Physics World for Phaser.
 * 
 * Access this via `this.matter.world` from within a Scene.
 * 
 * This class creates a Matter JS World Composite along with the Matter JS Engine during instantiation. It also
 * handles delta timing, bounds, body and constraint creation and debug drawing.
 * 
 * If you wish to access the Matter JS World object directly, see the `localWorld` property.
 * If you wish to access the Matter Engine directly, see the `engine` property.
 * 
 * This class is an Event Emitter and will proxy _all_ Matter JS events, as they are received.
 *
 * @class World
 * @extends Phaser.Events.EventEmitter
 * @memberof Phaser.Physics.Matter
 * @constructor
 * @since 3.0.0
 *
 * @param {Phaser.Scene} scene - The Scene to which this Matter World instance belongs.
 * @param {Phaser.Types.Physics.Matter.MatterWorldConfig} config - The Matter World configuration object.
 */
var World = new Class({

    Extends: EventEmitter,

    initialize:

    function World (scene, config)
    {
        EventEmitter.call(this);

        /**
         * The Scene to which this Matter World instance belongs.
         *
         * @name Phaser.Physics.Matter.World#scene
         * @type {Phaser.Scene}
         * @since 3.0.0
         */
        this.scene = scene;

        /**
         * An instance of the MatterJS Engine.
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

        /**
         * A flag that toggles if the world is enabled or not.
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

        var debugConfig = GetValue(config, 'debug', false);

        /**
         * A flag that controls if the debug graphics will be drawn to or not.
         *
         * @name Phaser.Physics.Matter.World#drawDebug
         * @type {boolean}
         * @default false
         * @since 3.0.0
         */
        this.drawDebug = (typeof(debugConfig) === 'object') ? true : debugConfig;

        /**
         * An instance of the Graphics object the debug bodies are drawn to, if enabled.
         *
         * @name Phaser.Physics.Matter.World#debugGraphic
         * @type {Phaser.GameObjects.Graphics}
         * @since 3.0.0
         */
        this.debugGraphic;

        /**
         * The debug configuration object.
         * 
         * The values stored in this object are read from the Matter World Config `debug` property.
         * 
         * When a new Body or Constraint is _added to the World_, they are given the values stored in this object,
         * unless they have their own `render` object set that will override them.
         * 
         * Note that while you can modify the values of properties in this object at run-time, it will not change
         * any of the Matter objects _already added_. It will only impact objects newly added to the world, or one
         * that is removed and then re-added at a later time.
         *
         * @name Phaser.Physics.Matter.World#debugConfig
         * @type {Phaser.Types.Physics.Matter.MatterDebugConfig}
         * @since 3.22.0
         */
        this.debugConfig = {
            showBody: GetFastValue(debugConfig, 'showBody', true),
            showStaticBody: GetFastValue(debugConfig, 'showStaticBody', true),
            showSleeping: GetFastValue(debugConfig, 'showSleeping', false),
            showJoint: GetFastValue(debugConfig, 'showJoint', true),
            showInternalEdges: GetFastValue(debugConfig, 'showInternalEdges', false),
            showConvexHulls: GetFastValue(debugConfig, 'showConvexHulls', false),

            renderFill: GetFastValue(debugConfig, 'renderFill', false),
            renderLine: GetFastValue(debugConfig, 'renderLine', true),

            fillColor: GetFastValue(debugConfig, 'fillColor', 0x106909),
            fillOpacity: GetFastValue(debugConfig, 'fillOpacity', 1),
            lineColor: GetFastValue(debugConfig, 'lineColor', 0x28de19),
            lineOpacity: GetFastValue(debugConfig, 'lineOpacity', 1),
            lineThickness: GetFastValue(debugConfig, 'lineThickness', 1),

            staticFillColor: GetFastValue(debugConfig, 'staticFillColor', 0x0d177b),
            staticLineColor: GetFastValue(debugConfig, 'staticLineColor', 0x1327e4),

            staticBodySleepOpacity: GetFastValue(debugConfig, 'staticBodySleepOpacity', 0.7),
            sleepFillColor: GetFastValue(debugConfig, 'sleepFillColor', 0x464646),
            sleepLineColor: GetFastValue(debugConfig, 'sleepLineColor', 0x999a99),

            jointColor: GetFastValue(debugConfig, 'jointColor', 0xe0e042),
            jointLineOpacity: GetFastValue(debugConfig, 'jointLineOpacity', 1),
            jointLineThickness: GetFastValue(debugConfig, 'jointLineThickness', 2),

            pinSize: GetFastValue(debugConfig, 'pinSize', 4),
            pinColor: GetFastValue(debugConfig, 'pinColor', 0x42e0e0),

            springColor: GetFastValue(debugConfig, 'springColor', 0xe042e0),

            anchorColor: GetFastValue(debugConfig, 'anchorColor', 0xefefef),
            anchorSize: GetFastValue(debugConfig, 'anchorSize', 6),

            hullColor: GetFastValue(debugConfig, 'hullColor', 0xd703d0)
        };

        if (this.drawDebug)
        {
            this.createDebugGraphic();
        }

        this.setEventsProxy();

        //  Create the walls

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
                var width = GetFastValue(boundsConfig, 'width', scene.sys.scale.width);
                var height = GetFastValue(boundsConfig, 'height', scene.sys.scale.height);
                var thickness = GetFastValue(boundsConfig, 'thickness', 64);
                var left = GetFastValue(boundsConfig, 'left', true);
                var right = GetFastValue(boundsConfig, 'right', true);
                var top = GetFastValue(boundsConfig, 'top', true);
                var bottom = GetFastValue(boundsConfig, 'bottom', true);

                this.setBounds(x, y, width, height, thickness, left, right, top, bottom);
            }
        }
    },

    /**
     * Sets the debug render style for the given Matter Body.
     * 
     * If you are using this on a Phaser Game Object, such as a Matter Sprite, then pass in the body property
     * to this method, not the Game Object itself.
     * 
     * If you wish to skip a parameter, so it retains its current value, pass `false` for it.
     * 
     * If you wish to reset the Body render colors to the defaults found in the World Debug Config, then call
     * this method with just the `body` parameter provided and no others.
     * 
     * @method Phaser.Physics.Matter.World#setBodyRenderStyle
     * @since 3.22.0
     *
     * @param {MatterJS.Body} body - The Matter Body to set the render style on.
     * @param {number} [lineColor] - The line color. If `null` it will use the World Debug Config value.
     * @param {number} [lineOpacity] - The line opacity, between 0 and 1. If `null` it will use the World Debug Config value.
     * @param {number} [lineThickness] - The line thickness. If `null` it will use the World Debug Config value.
     * @param {number} [fillColor] - The fill color. If `null` it will use the World Debug Config value.
     * @param {number} [fillOpacity] - The fill opacity, between 0 and 1. If `null` it will use the World Debug Config value.
     * 
     * @return {this} This Matter World instance for method chaining.
     */
    setBodyRenderStyle: function (body, lineColor, lineOpacity, lineThickness, fillColor, fillOpacity)
    {
        var render = body.render;
        var config = this.debugConfig;

        if (!render)
        {
            return this;
        }

        if (lineColor === undefined || lineColor === null)
        {
            lineColor = (body.isStatic) ? config.staticLineColor : config.lineColor;
        }

        if (lineOpacity === undefined || lineOpacity === null)
        {
            lineOpacity = config.lineOpacity;
        }

        if (lineThickness === undefined || lineThickness === null)
        {
            lineThickness = config.lineThickness;
        }

        if (fillColor === undefined || fillColor === null)
        {
            fillColor = (body.isStatic) ? config.staticFillColor : config.fillColor;
        }

        if (fillOpacity === undefined || fillOpacity === null)
        {
            fillOpacity = config.fillOpacity;
        }

        if (lineColor !== false)
        {
            render.lineColor = lineColor;
        }

        if (lineOpacity !== false)
        {
            render.lineOpacity = lineOpacity;
        }

        if (lineThickness !== false)
        {
            render.lineThickness = lineThickness;
        }

        if (fillColor !== false)
        {
            render.fillColor = fillColor;
        }

        if (fillOpacity !== false)
        {
            render.fillOpacity = fillOpacity;
        }

        return this;
    },

    /**
     * Sets the debug render style for the given Matter Constraint.
     * 
     * If you are using this on a Phaser Game Object, then pass in the body property
     * to this method, not the Game Object itself.
     * 
     * If you wish to skip a parameter, so it retains its current value, pass `false` for it.
     * 
     * If you wish to reset the Constraint render colors to the defaults found in the World Debug Config, then call
     * this method with just the `constraint` parameter provided and no others.
     * 
     * @method Phaser.Physics.Matter.World#setConstraintRenderStyle
     * @since 3.22.0
     *
     * @param {MatterJS.Constraint} constraint - The Matter Constraint to set the render style on.
     * @param {number} [lineColor] - The line color. If `null` it will use the World Debug Config value.
     * @param {number} [lineOpacity] - The line opacity, between 0 and 1. If `null` it will use the World Debug Config value.
     * @param {number} [lineThickness] - The line thickness. If `null` it will use the World Debug Config value.
     * @param {number} [pinSize] - If this constraint is a pin, this sets the size of the pin circle. If `null` it will use the World Debug Config value.
     * @param {number} [anchorColor] - The color used when rendering this constraints anchors.  If `null` it will use the World Debug Config value.
     * @param {number} [anchorSize] - The size of the anchor circle, if this constraint has anchors. If `null` it will use the World Debug Config value.
     * 
     * @return {this} This Matter World instance for method chaining.
     */
    setConstraintRenderStyle: function (constraint, lineColor, lineOpacity, lineThickness, pinSize, anchorColor, anchorSize)
    {
        var render = constraint.render;
        var config = this.debugConfig;

        if (!render)
        {
            return this;
        }

        //  Reset them
        if (lineColor === undefined || lineColor === null)
        {
            var type = render.type;

            if (type === 'line')
            {
                lineColor = config.jointColor;
            }
            else if (type === 'pin')
            {
                lineColor = config.pinColor;
            }
            else if (type === 'spring')
            {
                lineColor = config.springColor;
            }
        }

        if (lineOpacity === undefined || lineOpacity === null)
        {
            lineOpacity = config.jointLineOpacity;
        }

        if (lineThickness === undefined || lineThickness === null)
        {
            lineThickness = config.jointLineThickness;
        }

        if (pinSize === undefined || pinSize === null)
        {
            pinSize = config.pinSize;
        }

        if (anchorColor === undefined || anchorColor === null)
        {
            anchorColor = config.anchorColor;
        }

        if (anchorSize === undefined || anchorSize === null)
        {
            anchorSize = config.anchorSize;
        }

        if (lineColor !== false)
        {
            render.lineColor = lineColor;
        }

        if (lineOpacity !== false)
        {
            render.lineOpacity = lineOpacity;
        }

        if (lineThickness !== false)
        {
            render.lineThickness = lineThickness;
        }

        if (pinSize !== false)
        {
            render.pinSize = pinSize;
        }

        if (anchorColor !== false)
        {
            render.anchorColor = anchorColor;
        }

        if (anchorSize !== false)
        {
            render.anchorSize = anchorSize;
        }

        return this;
    },

    /**
     * This internal method acts as a proxy between all of the Matter JS events and then re-emits them
     * via this class.
     *
     * @method Phaser.Physics.Matter.World#setEventsProxy
     * @since 3.0.0
     */
    setEventsProxy: function ()
    {
        var _this = this;
        var engine = this.engine;
        var world = this.localWorld;

        //  Inject debug styles

        if (this.drawDebug)
        {
            MatterEvents.on(world, 'beforeAdd', function (event)
            {
                var objects = [].concat(event.object);
    
                for (var i = 0; i < objects.length; i++)
                {
                    var obj = objects[i];
                    var render = obj.render;
    
                    if (obj.type === 'body')
                    {
                        _this.setBodyRenderStyle(obj, render.lineColor, render.lineOpacity, render.lineThickness, render.fillColor, render.fillOpacity);

                    }
                    else if (obj.type === 'constraint')
                    {
                        _this.setConstraintRenderStyle(obj, render.lineColor, render.lineOpacity, render.lineThickness, render.pinSize, render.anchorColor, render.anchorSize);
                    }
                }
            });
        }

        MatterEvents.on(world, 'beforeAdd', function (event)
        {
            _this.emit(Events.BEFORE_ADD, event);
        });

        MatterEvents.on(world, 'afterAdd', function (event)
        {
            _this.emit(Events.AFTER_ADD, event);
        });

        MatterEvents.on(world, 'beforeRemove', function (event)
        {
            _this.emit(Events.BEFORE_REMOVE, event);
        });

        MatterEvents.on(world, 'afterRemove', function (event)
        {
            _this.emit(Events.AFTER_REMOVE, event);
        });

        MatterEvents.on(engine, 'beforeUpdate', function (event)
        {
            _this.emit(Events.BEFORE_UPDATE, event);
        });

        MatterEvents.on(engine, 'afterUpdate', function (event)
        {
            _this.emit(Events.AFTER_UPDATE, event);
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

            _this.emit(Events.COLLISION_START, event, bodyA, bodyB);
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

            _this.emit(Events.COLLISION_ACTIVE, event, bodyA, bodyB);
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

            _this.emit(Events.COLLISION_END, event, bodyA, bodyB);
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
     * @param {number} [thickness=64] - The thickness of each wall, in pixels.
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
        if (width === undefined) { width = this.scene.sys.scale.width; }
        if (height === undefined) { height = this.scene.sys.scale.height; }
        if (thickness === undefined) { thickness = 64; }
        if (left === undefined) { left = true; }
        if (right === undefined) { right = true; }
        if (top === undefined) { top = true; }
        if (bottom === undefined) { bottom = true; }

        this.updateWall(left, 'left', x - thickness, y - thickness, thickness, height + (thickness * 2));
        this.updateWall(right, 'right', x + width, y - thickness, thickness, height + (thickness * 2));
        this.updateWall(top, 'top', x, y - thickness, width, thickness);
        this.updateWall(bottom, 'bottom', x, y + height, width, thickness);

        return this;
    },

    /**
     * Updates the 4 rectangle bodies that were created, if `setBounds` was set in the Matter config, to use
     * the new positions and sizes. This method is usually only called internally via the `setBounds` method.
     *
     * @method Phaser.Physics.Matter.World#updateWall
     * @since 3.0.0
     *
     * @param {boolean} add - `true` if the walls are being added or updated, `false` to remove them from the world.
     * @param {string} [position] - Either `left`, `right`, `top` or `bottom`. Only optional if `add` is `false`.
     * @param {number} [x] - The horizontal position to place the walls at. Only optional if `add` is `false`.
     * @param {number} [y] - The vertical position to place the walls at. Only optional if `add` is `false`.
     * @param {number} [width] - The width of the walls, in pixels. Only optional if `add` is `false`.
     * @param {number} [height] - The height of the walls, in pixels. Only optional if `add` is `false`.
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
     * Creates a Phaser.GameObjects.Graphics object that is used to render all of the debug bodies and joints to.
     * 
     * This method is called automatically by the constructor, if debugging has been enabled.
     * 
     * The created Graphics object is automatically added to the Scene at 0x0 and given a depth of `Number.MAX_VALUE`,
     * so it renders above all else in the Scene.
     * 
     * The Graphics object is assigned to the `debugGraphic` property of this class and `drawDebug` is enabled.
     *
     * @method Phaser.Physics.Matter.World#createDebugGraphic
     * @since 3.0.0
     *
     * @return {Phaser.GameObjects.Graphics} The newly created Graphics object.
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
     * Sets the world gravity and gravity scale to 0.
     *
     * @method Phaser.Physics.Matter.World#disableGravity
     * @since 3.0.0
     *
     * @return {this} This Matter World object.
     */
    disableGravity: function ()
    {
        this.localWorld.gravity.x = 0;
        this.localWorld.gravity.y = 0;
        this.localWorld.gravity.scale = 0;

        return this;
    },

    /**
     * Sets the worlds gravity to the values given.
     * 
     * Gravity effects all bodies in the world, unless they have the `ignoreGravity` flag set.
     *
     * @method Phaser.Physics.Matter.World#setGravity
     * @since 3.0.0
     *
     * @param {number} [x=0] - The world gravity x component.
     * @param {number} [y=1] - The world gravity y component.
     * @param {number} [scale=0.001] - The gravity scale factor.
     *
     * @return {this} This Matter World object.
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
     * Creates a rectangle Matter body and adds it to the world.
     *
     * @method Phaser.Physics.Matter.World#create
     * @since 3.0.0
     *
     * @param {number} x - The horizontal position of the body in the world.
     * @param {number} y - The vertical position of the body in the world.
     * @param {number} width - The width of the body.
     * @param {number} height - The height of the body.
     * @param {object} options - Optional Matter configuration object.
     *
     * @return {MatterJS.Body} The Matter.js body that was created.
     */
    create: function (x, y, width, height, options)
    {
        var body = Bodies.rectangle(x, y, width, height, options);

        MatterWorld.add(this.localWorld, body);

        return body;
    },

    /**
     * Adds a Matter JS object, or array of objects, to the world.
     * 
     * The objects should be valid Matter JS entities, such as a Body, Composite or Constraint.
     * 
     * Triggers `beforeAdd` and `afterAdd` events.
     *
     * @method Phaser.Physics.Matter.World#add
     * @since 3.0.0
     *
     * @param {(object|object[])} object - Can be single object, or an array, and can be a body, composite or constraint.
     *
     * @return {this} This Matter World object.
     */
    add: function (object)
    {
        MatterWorld.add(this.localWorld, object);

        return this;
    },

    /**
     * Removes a Matter JS object, or array of objects, from the world.
     * 
     * The objects should be valid Matter JS entities, such as a Body, Composite or Constraint.
     * 
     * Triggers `beforeRemove` and `afterRemove` events.
     *
     * @method Phaser.Physics.Matter.World#remove
     * @since 3.0.0
     *
     * @param {(object|object[])} object - Can be single object, or an array, and can be a body, composite or constraint.
     * @param {boolean} [deep=false] - Optionally search the objects children and recursively remove those as well.
     *
     * @return {this} This Matter World object.
     */
    remove: function (object, deep)
    {
        if (!Array.isArray(object))
        {
            object = [ object ];
        }

        for (var i = 0; i < object.length; i++)
        {
            var entity = object[i];

            var body = (entity.body) ? entity.body : entity;

            Composite.remove(this.localWorld, body, deep);
        }

        return this;
    },

    /**
     * Removes a Matter JS constraint, or array of constraints, from the world.
     * 
     * Triggers `beforeRemove` and `afterRemove` events.
     *
     * @method Phaser.Physics.Matter.World#removeConstraint
     * @since 3.0.0
     *
     * @param {(MatterJS.Constraint|MatterJS.Constraint[])} constraint - A Matter JS Constraint, or an array of constraints, to be removed.
     * @param {boolean} [deep=false] - Optionally search the objects children and recursively remove those as well.
     *
     * @return {this} This Matter World object.
     */
    removeConstraint: function (constraint, deep)
    {
        Composite.remove(this.localWorld, constraint, deep);

        return this;
    },

    /**
     * Adds `MatterTileBody` instances for all the colliding tiles within the given tilemap layer.
     * 
     * Set the appropriate tiles in your layer to collide before calling this method!
     *
     * @method Phaser.Physics.Matter.World#convertTilemapLayer
     * @since 3.0.0
     *
     * @param {(Phaser.Tilemaps.DynamicTilemapLayer|Phaser.Tilemaps.StaticTilemapLayer)} tilemapLayer -
     * An array of tiles.
     * @param {object} [options] - Options to be passed to the MatterTileBody constructor. {@see Phaser.Physics.Matter.TileBody}
     *
     * @return {this} This Matter World object.
     */
    convertTilemapLayer: function (tilemapLayer, options)
    {
        var layerData = tilemapLayer.layer;
        var tiles = tilemapLayer.getTilesWithin(0, 0, layerData.width, layerData.height, { isColliding: true });

        this.convertTiles(tiles, options);

        return this;
    },

    /**
     * Adds `MatterTileBody` instances for the given tiles. This adds bodies regardless of whether the
     * tiles are set to collide or not.
     *
     * @method Phaser.Physics.Matter.World#convertTiles
     * @since 3.0.0
     *
     * @param {Phaser.Tilemaps.Tile[]} tiles - An array of tiles.
     * @param {object} [options] - Options to be passed to the MatterTileBody constructor. {@see Phaser.Physics.Matter.TileBody}
     *
     * @return {this} This Matter World object.
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
     * Returns the next unique group index for which bodies will collide.
     * If `isNonColliding` is `true`, returns the next unique group index for which bodies will not collide.
     *
     * @method Phaser.Physics.Matter.World#nextGroup
     * @since 3.0.0
     *
     * @param {boolean} [isNonColliding=false] - If `true`, returns the next unique group index for which bodies will _not_ collide.
     *
     * @return {number} Unique category bitfield
     */
    nextGroup: function (isNonColliding)
    {
        return MatterBody.nextGroup(isNonColliding);
    },

    /**
     * Returns the next unique category bitfield (starting after the initial default category 0x0001).
     * There are 32 available.
     *
     * @method Phaser.Physics.Matter.World#nextCategory
     * @since 3.0.0
     *
     * @return {number} Unique category bitfield
     */
    nextCategory: function ()
    {
        return MatterBody.nextCategory();
    },

    /**
     * Pauses this Matter World instance and sets `enabled` to `false`.
     * 
     * A paused world will not run any simulations for the duration it is paused.
     *
     * @method Phaser.Physics.Matter.World#pause
     * @fires Phaser.Physics.Matter.Events#PAUSE
     * @since 3.0.0
     *
     * @return {this} This Matter World object.
     */
    pause: function ()
    {
        this.enabled = false;

        this.emit(Events.PAUSE);

        return this;
    },

    /**
     * Resumes this Matter World instance from a paused state and sets `enabled` to `true`.
     *
     * @method Phaser.Physics.Matter.World#resume
     * @fires Phaser.Physics.Matter.Events#RESUME
     * @since 3.0.0
     *
     * @return {this} This Matter World object.
     */
    resume: function ()
    {
        this.enabled = true;

        this.emit(Events.RESUME);

        return this;
    },

    /**
     * The internal update method. This is called automatically by the parent Scene.
     * 
     * Moves the simulation forward in time by delta ms. Uses `World.correction` value as an optional number that
     * specifies the time correction factor to apply to the update. This can help improve the accuracy of the
     * simulation in cases where delta is changing between updates. The value of correction is defined as `delta / lastDelta`,
     * i.e. the percentage change of delta over the last step. Therefore the value is always 1 (no correction) when
     * delta is constant (or when no correction is desired, which is the default).
     * See the paper on Time Corrected Verlet for more information.
     * 
     * Triggers `beforeUpdate` and `afterUpdate` events. Triggers `collisionStart`, `collisionActive` and `collisionEnd` events.
     * 
     * If the World is paused, `update` is still run, but exits early and does not update the Matter Engine.
     *
     * @method Phaser.Physics.Matter.World#update
     * @since 3.0.0
     *
     * @param {number} time - The current time. Either a High Resolution Timer value if it comes from Request Animation Frame, or Date.now if using SetTimeout.
     * @param {number} delta - The delta time in ms since the last frame. This is a smoothed and capped value based on the FPS rate.
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
     * @param {number} [delta=16.666] - The delta value.
     * @param {number} [correction=1] - Optional delta correction value.
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
     * Returns all the bodies in the Matter World, including all bodies in children, recursively.
     *
     * @method Phaser.Physics.Matter.World#getAllBodies
     * @since 3.22.0
     * 
     * @return {MatterJS.Body[]} An array of all the Matter JS Bodies in this World.
     */
    getAllBodies: function ()
    {
        return Composite.allBodies(this.localWorld);
    },

    /**
     * Returns all the constraints in the Matter World, including all constraints in children, recursively.
     *
     * @method Phaser.Physics.Matter.World#getAllConstraints
     * @since 3.22.0
     * 
     * @return {MatterJS.Constraint[]} An array of all the Matter JS Constraints in this World.
     */
    getAllConstraints: function ()
    {
        return Composite.allConstraints(this.localWorld);
    },

    /**
     * Returns all the composites in the Matter World, including all composites in children, recursively.
     *
     * @method Phaser.Physics.Matter.World#getAllComposites
     * @since 3.22.0
     * 
     * @return {MatterJS.Composite[]} An array of all the Matter JS Composites in this World.
     */
    getAllComposites: function ()
    {
        return Composite.allComposites(this.localWorld);
    },

    /**
     * Handles the rendering of bodies and debug information to the debug Graphics object, if enabled.
     * 
     * This method is called automatically by the Scene after all processing has taken place.
     *
     * @method Phaser.Physics.Matter.World#postUpdate
     * @private
     * @since 3.0.0
     */
    postUpdate: function ()
    {
        var config = this.debugConfig;

        var showBody = config.showBody;
        var showStaticBody = config.showStaticBody;
        var showJoint = config.showJoint;

        if (!this.drawDebug || (!showBody && !showStaticBody && !showJoint))
        {
            return;
        }

        this.debugGraphic.clear();

        var bodies = Composite.allBodies(this.localWorld);

        this.renderBodies(bodies);

        if (showJoint)
        {
            this.renderJoints();
        }
    },

    /**
     * Renders the given array of Bodies to the debug graphics instance.
     * 
     * Called automatically by the `postUpdate` method.
     *
     * @method Phaser.Physics.Matter.World#renderBodies
     * @private
     * @since 3.14.0
     * 
     * @param {array} bodies - An array of bodies from the localWorld.
     */
    renderBodies: function (bodies)
    {
        var graphics = this.debugGraphic;

        var config = this.debugConfig;

        var showBody = config.showBody;
        var showStaticBody = config.showStaticBody;
        var showSleeping = config.showSleeping;
        var showInternalEdges = config.showInternalEdges;
        var showConvexHulls = config.showConvexHulls;

        var renderFill = config.renderFill;
        var renderLine = config.renderLine;

        var staticBodySleepOpacity = config.staticBodySleepOpacity;
        var sleepFillColor = config.sleepFillColor;
        var sleepLineColor = config.sleepLineColor;

        var hullColor = config.hullColor;

        for (var i = 0; i < bodies.length; i++)
        {
            var body = bodies[i];

            //  1) Don't show invisible bodies
            if (!body.render.visible)
            {
                continue;
            }

            //  2) Don't show static bodies, OR
            //  3) Don't show dynamic bodies
            if ((!showStaticBody && body.isStatic) || (!showBody && !body.isStatic))
            {
                continue;
            }

            var lineColor = body.render.lineColor;
            var lineOpacity = body.render.lineOpacity;
            var lineThickness = body.render.lineThickness;
            var fillColor = body.render.fillColor;
            var fillOpacity = body.render.fillOpacity;

            if (showSleeping && body.isSleeping)
            {
                if (body.isStatic)
                {
                    lineOpacity *= staticBodySleepOpacity;
                    fillOpacity *= staticBodySleepOpacity;
                }
                else
                {
                    lineColor = sleepLineColor;
                    fillColor = sleepFillColor;
                }
            }

            if (!renderFill)
            {
                fillColor = null;
            }

            if (!renderLine)
            {
                lineColor = null;
            }

            this.renderBody(body, graphics, showInternalEdges, lineColor, lineOpacity, lineThickness, fillColor, fillOpacity);

            var partsLength = body.parts.length;

            if (showConvexHulls && partsLength > 1)
            {
                this.renderConvexHull(body, graphics, hullColor, lineThickness);
            }
        }
    },

    /**
     * Renders a single Matter Body to the given Phaser Graphics Game Object.
     * 
     * This method is used internally by the Matter Debug Renderer, but is also exposed publically should
     * you wish to render a Body to your own Graphics instance.
     * 
     * If you don't wish to render a line around the body, set the `lineColor` parameter to `null`.
     * Equally, if you don't wish to render a fill, set the `fillColor` parameter to `null`.
     * 
     * @method Phaser.Physics.Matter.World#renderBody
     * @since 3.22.0
     * 
     * @param {MatterJS.Body} body - The Matter Body to be rendered.
     * @param {Phaser.GameObjects.Graphics} graphics - The Graphics object to render to.
     * @param {boolean} showInternalEdges - Render internal edges of the polygon?
     * @param {number} [lineColor] - The line color.
     * @param {number} [lineOpacity] - The line opacity, between 0 and 1.
     * @param {number} [lineThickness=1] - The line thickness.
     * @param {number} [fillColor] - The fill color.
     * @param {number} [fillOpacity] - The fill opacity, between 0 and 1.
     * 
     * @return {this} This Matter World instance for method chaining.
     */
    renderBody: function (body, graphics, showInternalEdges, lineColor, lineOpacity, lineThickness, fillColor, fillOpacity)
    {
        if (lineColor === undefined) { lineColor = null; }
        if (lineOpacity === undefined) { lineOpacity = null; }
        if (lineThickness === undefined) { lineThickness = 1; }
        if (fillColor === undefined) { fillColor = null; }
        if (fillOpacity === undefined) { fillOpacity = null; }

        //  Handle compound parts
        var parts = body.parts;
        var partsLength = parts.length;

        if (!body.isStatic)
        {
            var w = body.bounds.max.x - body.bounds.min.x;
            var h = body.bounds.max.y - body.bounds.min.y;

            graphics.fillStyle(0x6d6d6d, 0.3);
            graphics.fillRect(body.bounds.min.x, body.bounds.min.y, w, h);
        }

        for (var k = (partsLength > 1) ? 1 : 0; k < partsLength; k++)
        {
            var part = parts[k];
            var render = part.render;
            var opacity = render.opacity;

            if (!render.visible || opacity === 0)
            {
                continue;
            }

            //  Part polygon
            var circleRadius = part.circleRadius;

            graphics.beginPath();

            if (fillColor !== null)
            {
                graphics.fillStyle(fillColor, fillOpacity * opacity);
            }

            if (lineColor !== null)
            {
                graphics.lineStyle(lineThickness, lineColor, lineOpacity * opacity);
            }

            if (circleRadius)
            {
                graphics.arc(part.position.x, part.position.y, circleRadius, 0, 2 * Math.PI);
            }
            else
            {
                var vertices = part.vertices;
                var vertLength = vertices.length;

                graphics.moveTo(vertices[0].x, vertices[0].y);

                for (var j = 1; j < vertLength; j++)
                {
                    var vert = vertices[j];

                    if (!vertices[j - 1].isInternal || showInternalEdges)
                    {
                        graphics.lineTo(vert.x, vert.y);
                    }
                    else
                    {
                        graphics.moveTo(vert.x, vert.y);
                    }

                    if (vert.isInternal && !showInternalEdges)
                    {
                        var nextIndex = (j + 1) % vertLength;

                        graphics.moveTo(vertices[nextIndex].x, vertices[nextIndex].y);
                    }
                }
                
                graphics.closePath();
            }

            if (fillColor !== null)
            {
                graphics.fillPath();
            }

            if (lineColor !== null)
            {
                graphics.strokePath();
            }
        }

        if (!body.isStatic)
        {
            var px = body.position.x;
            var py = body.position.y;

            graphics.fillStyle(0xff00ff, 1);
            graphics.fillRect(px - 3, py - 3, 6, 6);
        }

        return this;
    },

    /**
     * Renders the Convex Hull for a single Matter Body to the given Phaser Graphics Game Object.
     * 
     * This method is used internally by the Matter Debug Renderer, but is also exposed publically should
     * you wish to render a Body hull to your own Graphics instance.
     * 
     * @method Phaser.Physics.Matter.World#renderConvexHull
     * @since 3.22.0
     * 
     * @param {MatterJS.Body} body - The Matter Body to be rendered.
     * @param {Phaser.GameObjects.Graphics} graphics - The Graphics object to render to.
     * @param {number} hullColor - The color used to render the hull.
     * @param {number} [lineThickness=1] - The hull line thickness.
     * 
     * @return {this} This Matter World instance for method chaining.
     */
    renderConvexHull: function (body, graphics, hullColor, lineThickness)
    {
        if (lineThickness === undefined) { lineThickness = 1; }

        var parts = body.parts;
        var partsLength = parts.length;

        //  Render Convex Hulls
        if (partsLength > 1)
        {
            var verts = body.vertices;

            graphics.lineStyle(lineThickness, hullColor);

            graphics.beginPath();

            graphics.moveTo(verts[0].x, verts[0].y);

            for (var v = 1; v < verts.length; v++)
            {
                graphics.lineTo(verts[v].x, verts[v].y);
            }
            
            graphics.lineTo(verts[0].x, verts[0].y);

            graphics.strokePath();
        }

        return this;
    },

    /**
     * Renders all of the constraints in the world (unless they are specifically set to invisible).
     * 
     * Called automatically by the `postUpdate` method.
     *
     * @method Phaser.Physics.Matter.World#renderJoints
     * @private
     * @since 3.14.0
     */
    renderJoints: function ()
    {
        var graphics = this.debugGraphic;

        // Render constraints 
        var constraints = Composite.allConstraints(this.localWorld);

        for (var i = 0; i < constraints.length; i++)
        {
            var config = constraints[i].render;

            var lineColor = config.lineColor;
            var lineOpacity = config.lineOpacity;
            var lineThickness = config.lineThickness;
            var pinSize = config.pinSize;
            var anchorColor = config.anchorColor;
            var anchorSize = config.anchorSize;

            this.renderConstraint(constraints[i], graphics, lineColor, lineOpacity, lineThickness, pinSize, anchorColor, anchorSize);
        }
    },

    /**
     * Renders a single Matter Constraint, such as a Pin or a Spring, to the given Phaser Graphics Game Object.
     * 
     * This method is used internally by the Matter Debug Renderer, but is also exposed publically should
     * you wish to render a Constraint to your own Graphics instance.
     * 
     * @method Phaser.Physics.Matter.World#renderConstraint
     * @since 3.22.0
     * 
     * @param {MatterJS.Constraint} constraint - The Matter Constraint to render.
     * @param {Phaser.GameObjects.Graphics} graphics - The Graphics object to render to.
     * @param {number} lineColor - The line color.
     * @param {number} lineOpacity - The line opacity, between 0 and 1.
     * @param {number} lineThickness - The line thickness.
     * @param {number} pinSize - If this constraint is a pin, this sets the size of the pin circle.
     * @param {number} anchorColor - The color used when rendering this constraints anchors. Set to `null` to not render anchors.
     * @param {number} anchorSize - The size of the anchor circle, if this constraint has anchors and is rendering them.
     * 
     * @return {this} This Matter World instance for method chaining.
     */
    renderConstraint: function (constraint, graphics, lineColor, lineOpacity, lineThickness, pinSize, anchorColor, anchorSize)
    {
        var render = constraint.render;

        if (!render.visible || !constraint.pointA || !constraint.pointB)
        {
            return this;
        }

        graphics.lineStyle(lineThickness, lineColor, lineOpacity * render.opacity);

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

        if (render.type === 'pin')
        {
            graphics.strokeCircle(start.x, start.y, pinSize);
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

            if (render.type === 'spring')
            {
                var delta = Vector.sub(end, start);
                var normal = Vector.perp(Vector.normalise(delta));
                var coils = Math.ceil(Common.clamp(constraint.length / 5, 12, 20));
                var offset;

                for (var j = 1; j < coils; j += 1)
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

        graphics.strokePath();

        if (render.anchors && anchorSize > 0)
        {
            graphics.fillStyle(anchorColor);
            graphics.fillCircle(start.x, start.y, anchorSize);
            graphics.fillCircle(end.x, end.y, anchorSize);
        }

        return this;
    },

    /**
     * Resets the internal collision IDs that Matter.JS uses for Body collision groups.
     * 
     * You should call this before destroying your game if you need to restart the game
     * again on the same page, without first reloading the page. Or, if you wish to
     * consistently destroy a Scene that contains Matter.js and then run it again
     * later in the same game.
     *
     * @method Phaser.Physics.Matter.World#resetCollisionIDs
     * @since 3.17.0
     */
    resetCollisionIDs: function ()
    {
        Body._nextCollidingGroupId = 1;
        Body._nextNonCollidingGroupId = -1;
        Body._nextCategory = 0x0001;

        return this;
    },

    /**
     * Will remove all Matter physics event listeners and clear the matter physics world,
     * engine and any debug graphics, if any.
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

        if (this.drawDebug)
        {
            this.debugGraphic.destroy();
        }
    },

    /**
     * Will remove all Matter physics event listeners and clear the matter physics world,
     * engine and any debug graphics, if any.
     *
     * After destroying the world it cannot be re-used again.
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
