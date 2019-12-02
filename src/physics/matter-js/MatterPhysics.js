/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2019 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Axes = require('./lib/geometry/Axes');
var Bodies = require('./lib/factory/Bodies');
var Body = require('./lib/body/Body');
var Bounds = require('./lib/geometry/Bounds');
var Class = require('../../utils/Class');
var Composite = require('./lib/body/Composite');
var Composites = require('./lib/factory/Composites');
var Constraint = require('./lib/constraint/Constraint');
var Detector = require('./lib/collision/Detector');
var Factory = require('./Factory');
var GetFastValue = require('../../utils/object/GetFastValue');
var GetValue = require('../../utils/object/GetValue');
var Grid = require('./lib/collision/Grid');
var MatterAttractors = require('./lib/plugins/MatterAttractors');
var MatterCollisionEvents = require('./lib/plugins/MatterCollisionEvents');
var MatterLib = require('./lib/core/Matter');
var MatterWrap = require('./lib/plugins/MatterWrap');
var Merge = require('../../utils/object/Merge');
var Pair = require('./lib/collision/Pair');
var Pairs = require('./lib/collision/Pairs');
var Plugin = require('./lib/core/Plugin');
var PluginCache = require('../../plugins/PluginCache');
var Query = require('./lib/collision/Query');
var Resolver = require('./lib/collision/Resolver');
var SAT = require('./lib/collision/SAT');
var SceneEvents = require('../../scene/events');
var Svg = require('./lib/geometry/Svg');
var Vector = require('./lib/geometry/Vector');
var Vertices = require('./lib/geometry/Vertices');
var World = require('./World');

/**
 * @classdesc
 * The Phaser Matter plugin provides the ability to use the Matter JS Physics Engine within your Phaser games.
 * 
 * Unlike Arcade Physics, the other physics system provided with Phaser, Matter JS is a full-body physics system.
 * It features:
 * 
 * * Rigid bodies
 * * Compound bodies
 * * Composite bodies
 * * Concave and convex hulls
 * * Physical properties (mass, area, density etc.)
 * * Restitution (elastic and inelastic collisions)
 * * Collisions (broad-phase, mid-phase and narrow-phase)
 * * Stable stacking and resting
 * * Conservation of momentum
 * * Friction and resistance
 * * Constraints
 * * Gravity
 * * Sleeping and static bodies
 * * Rounded corners (chamfering)
 * * Views (translate, zoom)
 * * Collision queries (raycasting, region tests)
 * * Time scaling (slow-mo, speed-up)
 * 
 * Configuration of Matter is handled via the Matter World Config object, which can be passed in either the
 * Phaser Game Config, or Phaser Scene Config. Here is a basic example:
 * 
 * ```js
 * physics: {
 *     default: 'matter',
 *     matter: {
 *         enableSleeping: true,
 *         gravity: {
 *             y: 0
 *         },
 *         debug: {
 *             showBody: true,
 *             showStaticBody: true
 *         }
 *     }
 * }
 * ```
 * 
 * This class acts as an interface between a Phaser Scene and a single instance of the Matter Engine.
 * 
 * Use it to access the most common Matter features and helper functions.
 * 
 * You can find details, documentation and examples on the Matter JS website: https://brm.io/matter-js/
 *
 * @class MatterPhysics
 * @memberof Phaser.Physics.Matter
 * @constructor
 * @since 3.0.0
 *
 * @param {Phaser.Scene} scene - The Phaser Scene that owns this Matter Physics instance.
 */
var MatterPhysics = new Class({

    initialize:

    function MatterPhysics (scene)
    {
        /**
         * The Phaser Scene that owns this Matter Physics instance
         *
         * @name Phaser.Physics.Matter.MatterPhysics#scene
         * @type {Phaser.Scene}
         * @since 3.0.0
         */
        this.scene = scene;

        /**
         * A reference to the Scene Systems that belong to the Scene owning this Matter Physics instance.
         *
         * @name Phaser.Physics.Matter.MatterPhysics#systems
         * @type {Phaser.Scenes.Systems}
         * @since 3.0.0
         */
        this.systems = scene.sys;

        /**
         * The parsed Matter Configuration object.
         *
         * @name Phaser.Physics.Matter.MatterPhysics#config
         * @type {Phaser.Types.Physics.Matter.MatterWorldConfig}
         * @since 3.0.0
         */
        this.config = this.getConfig();

        /**
         * An instance of the Matter World class. This class is responsible for the updating of the
         * Matter Physics world, as well as handling debug drawing functions.
         *
         * @name Phaser.Physics.Matter.MatterPhysics#world
         * @type {Phaser.Physics.Matter.World}
         * @since 3.0.0
         */
        this.world;

        /**
         * An instance of the Matter Factory. This class provides lots of functions for creatying a
         * wide variety of physics objects and adds them automatically to the Matter World.
         * 
         * You can use this class to cut-down on the amount of code required in your game, however,
         * use of the Factory is entirely optional and should be seen as a development aid. It's
         * perfectly possible to create and add components to the Matter world without using it.
         *
         * @name Phaser.Physics.Matter.MatterPhysics#add
         * @type {Phaser.Physics.Matter.Factory}
         * @since 3.0.0
         */
        this.add;

        //  Body

        /**
         * A reference to the `Matter.Body` module.
         * 
         * The `Matter.Body` module contains methods for creating and manipulating body models.
         * A `Matter.Body` is a rigid body that can be simulated by a `Matter.Engine`.
         * Factories for commonly used body configurations (such as rectangles, circles and other polygons) can be found in the `Bodies` module.
         *
         * @name Phaser.Physics.Matter.MatterPhysics#body
         * @type {MatterJS.Body}
         * @since 3.18.0
         */
        this.body = Body;

        /**
         * A reference to the `Matter.Composite` module.
         * 
         * The `Matter.Composite` module contains methods for creating and manipulating composite bodies.
         * A composite body is a collection of `Matter.Body`, `Matter.Constraint` and other `Matter.Composite`, therefore composites form a tree structure.
         * It is important to use the functions in this module to modify composites, rather than directly modifying their properties.
         * Note that the `Matter.World` object is also a type of `Matter.Composite` and as such all composite methods here can also operate on a `Matter.World`.
         *
         * @name Phaser.Physics.Matter.MatterPhysics#composite
         * @type {MatterJS.Composite}
         * @since 3.22.0
         */
        this.composite = Composite;

        //  Collision:

        /**
         * A reference to the `Matter.Detector` module.
         * 
         * The `Matter.Detector` module contains methods for detecting collisions given a set of pairs.
         *
         * @name Phaser.Physics.Matter.MatterPhysics#detector
         * @type {MatterJS.Detector}
         * @since 3.22.0
         */
        this.detector = Detector;

        /**
         * A reference to the `Matter.Grid` module.
         * 
         * The `Matter.Grid` module contains methods for creating and manipulating collision broadphase grid structures.
         *
         * @name Phaser.Physics.Matter.MatterPhysics#grid
         * @type {MatterJS.Grid}
         * @since 3.22.0
         */
        this.grid = Grid;

        /**
         * A reference to the `Matter.Pair` module.
         * 
         * The `Matter.Pair` module contains methods for creating and manipulating collision pairs.
         *
         * @name Phaser.Physics.Matter.MatterPhysics#pair
         * @type {MatterJS.Pair}
         * @since 3.22.0
         */
        this.pair = Pair;

        /**
         * A reference to the `Matter.Pairs` module.
         * 
         * The `Matter.Pairs` module contains methods for creating and manipulating collision pair sets.
         *
         * @name Phaser.Physics.Matter.MatterPhysics#pairs
         * @type {MatterJS.Pairs}
         * @since 3.22.0
         */
        this.pairs = Pairs;

        /**
         * A reference to the `Matter.Query` module.
         * 
         * The `Matter.Query` module contains methods for performing collision queries.
         *
         * @name Phaser.Physics.Matter.MatterPhysics#query
         * @type {MatterJS.Query}
         * @since 3.22.0
         */
        this.query = Query;

        /**
         * A reference to the `Matter.Resolver` module.
         * 
         * The `Matter.Resolver` module contains methods for resolving collision pairs.
         *
         * @name Phaser.Physics.Matter.MatterPhysics#resolver
         * @type {MatterJS.Resolver}
         * @since 3.22.0
         */
        this.resolver = Resolver;

        /**
         * A reference to the `Matter.SAT` module.
         * 
         * The `Matter.SAT` module contains methods for detecting collisions using the Separating Axis Theorem.
         *
         * @name Phaser.Physics.Matter.MatterPhysics#sat
         * @type {MatterJS.SAT}
         * @since 3.22.0
         */
        this.sat = SAT;

        //  Constraint

        /**
         * A reference to the `Matter.Constraint` module.
         * 
         * The `Matter.Constraint` module contains methods for creating and manipulating constraints.
         * Constraints are used for specifying that a fixed distance must be maintained between two bodies (or a body and a fixed world-space position).
         * The stiffness of constraints can be modified to create springs or elastic.
         *
         * @name Phaser.Physics.Matter.MatterPhysics#constraint
         * @type {MatterJS.Constraint}
         * @since 3.22.0
         */
        this.constraint = Constraint;

        //  Factory

        /**
         * A reference to the `Matter.Bodies` module.
         * 
         * The `Matter.Bodies` module contains factory methods for creating rigid body models 
         * with commonly used body configurations (such as rectangles, circles and other polygons).
         *
         * @name Phaser.Physics.Matter.MatterPhysics#bodies
         * @type {MatterJS.Bodies}
         * @since 3.18.0
         */
        this.bodies = Bodies;

        /**
         * A reference to the `Matter.Composites` module.
         * 
         * The `Matter.Composites` module contains factory methods for creating composite bodies
         * with commonly used configurations (such as stacks and chains).
         *
         * @name Phaser.Physics.Matter.MatterPhysics#composites
         * @type {MatterJS.Composites}
         * @since 3.22.0
         */
        this.composites = Composites;

        //  Geometry

        /**
         * A reference to the `Matter.Axes` module.
         * 
         * The `Matter.Axes` module contains methods for creating and manipulating sets of axes.
         *
         * @name Phaser.Physics.Matter.MatterPhysics#axes
         * @type {MatterJS.Axes}
         * @since 3.22.0
         */
        this.axes = Axes;

        /**
         * A reference to the `Matter.Bounds` module.
         * 
         * The `Matter.Bounds` module contains methods for creating and manipulating axis-aligned bounding boxes (AABB).
         *
         * @name Phaser.Physics.Matter.MatterPhysics#bounds
         * @type {MatterJS.Bounds}
         * @since 3.22.0
         */
        this.bounds = Bounds;

        /**
         * A reference to the `Matter.Svg` module.
         * 
         * The `Matter.Svg` module contains methods for converting SVG images into an array of vector points.
         *
         * To use this module you also need the SVGPathSeg polyfill: https://github.com/progers/pathseg
         *
         * @name Phaser.Physics.Matter.MatterPhysics#svg
         * @type {MatterJS.Svg}
         * @since 3.22.0
         */
        this.svg = Svg;

        /**
         * A reference to the `Matter.Vector` module.
         * 
         * The `Matter.Vector` module contains methods for creating and manipulating vectors.
         * Vectors are the basis of all the geometry related operations in the engine.
         * A `Matter.Vector` object is of the form `{ x: 0, y: 0 }`.
         *
         * @name Phaser.Physics.Matter.MatterPhysics#vector
         * @type {MatterJS.Vector}
         * @since 3.22.0
         */
        this.vector = Vector;

        /**
         * A reference to the `Matter.Vertices` module.
         * 
         * The `Matter.Vertices` module contains methods for creating and manipulating sets of vertices.
         * A set of vertices is an array of `Matter.Vector` with additional indexing properties inserted by `Vertices.create`.
         * A `Matter.Body` maintains a set of vertices to represent the shape of the object (its convex hull).
         *
         * @name Phaser.Physics.Matter.MatterPhysics#vertices
         * @type {MatterJS.Vertices}
         * @since 3.22.0
         */
        this.vertices = Vertices;

        /**
         * A reference to the `Matter.Vertices` module.
         * 
         * The `Matter.Vertices` module contains methods for creating and manipulating sets of vertices.
         * A set of vertices is an array of `Matter.Vector` with additional indexing properties inserted by `Vertices.create`.
         * A `Matter.Body` maintains a set of vertices to represent the shape of the object (its convex hull).
         *
         * @name Phaser.Physics.Matter.MatterPhysics#verts
         * @type {MatterJS.Vertices}
         * @since 3.14.0
         */
        this.verts = Vertices;

        //  Matter plugins

        if (GetValue(this.config, 'plugins.collisionevents', true))
        {
            this.enableCollisionEventsPlugin();
        }

        if (GetValue(this.config, 'plugins.attractors', false))
        {
            this.enableAttractorPlugin();
        }

        if (GetValue(this.config, 'plugins.wrap', false))
        {
            this.enableWrapPlugin();
        }

        scene.sys.events.once(SceneEvents.BOOT, this.boot, this);
        scene.sys.events.on(SceneEvents.START, this.start, this);
    },

    /**
     * This method is called automatically, only once, when the Scene is first created.
     * Do not invoke it directly.
     *
     * @method Phaser.Physics.Matter.MatterPhysics#boot
     * @private
     * @since 3.5.1
     */
    boot: function ()
    {
        this.world = new World(this.scene, this.config);
        this.add = new Factory(this.world);

        this.systems.events.once(SceneEvents.DESTROY, this.destroy, this);
    },

    /**
     * This method is called automatically by the Scene when it is starting up.
     * It is responsible for creating local systems, properties and listening for Scene events.
     * Do not invoke it directly.
     *
     * @method Phaser.Physics.Matter.MatterPhysics#start
     * @private
     * @since 3.5.0
     */
    start: function ()
    {
        if (!this.world)
        {
            this.world = new World(this.scene, this.config);
            this.add = new Factory(this.world);
        }

        var eventEmitter = this.systems.events;

        eventEmitter.on(SceneEvents.UPDATE, this.world.update, this.world);
        eventEmitter.on(SceneEvents.POST_UPDATE, this.world.postUpdate, this.world);
        eventEmitter.once(SceneEvents.SHUTDOWN, this.shutdown, this);
    },

    /**
     * This internal method is called when this class starts and retrieves the final Matter World Config.
     *
     * @method Phaser.Physics.Matter.MatterPhysics#getConfig
     * @since 3.0.0
     *
     * @return {Phaser.Types.Physics.Matter.MatterWorldConfig} The Matter World Config.
     */
    getConfig: function ()
    {
        var gameConfig = this.systems.game.config.physics;
        var sceneConfig = this.systems.settings.physics;

        var config = Merge(
            GetFastValue(sceneConfig, 'matter', {}),
            GetFastValue(gameConfig, 'matter', {})
        );

        return config;
    },

    /**
     * Enables the Matter Attractors Plugin.
     * 
     * The attractors plugin that makes it easy to apply continual forces on bodies.
     * It's possible to simulate effects such as wind, gravity and magnetism.
     * 
     * https://github.com/liabru/matter-attractors
     * 
     * This method is called automatically if `plugins.attractors` is set in the Matter World Config.
     * However, you can also call it directly from within your game.
     *
     * @method Phaser.Physics.Matter.MatterPhysics#enableAttractorPlugin
     * @since 3.0.0
     * 
     * @return {this} This Matter Physics instance.
     */
    enableAttractorPlugin: function ()
    {
        Plugin.register(MatterAttractors);
        Plugin.use(MatterLib, MatterAttractors);

        return this;
    },

    /**
     * Enables the Matter Wrap Plugin.
     * 
     * The coordinate wrapping plugin that automatically wraps the position of bodies such that they always stay
     * within the given bounds. Upon crossing a boundary the body will appear on the opposite side of the bounds,
     * while maintaining its velocity.
     * 
     * https://github.com/liabru/matter-wrap
     * 
     * This method is called automatically if `plugins.wrap` is set in the Matter World Config.
     * However, you can also call it directly from within your game.
     *
     * @method Phaser.Physics.Matter.MatterPhysics#enableWrapPlugin
     * @since 3.0.0
     * 
     * @return {this} This Matter Physics instance.
     */
    enableWrapPlugin: function ()
    {
        Plugin.register(MatterWrap);
        Plugin.use(MatterLib, MatterWrap);

        return this;
    },

    /**
     * Enables the Matter Collision Events Plugin.
     * 
     * Note that this plugin is enabled by default. So you should only ever need to call this
     * method if you have specifically disabled the plugin in your Matter World Config.
     * You can disable it by setting `plugins.collisionevents: false` in your Matter World Config.
     * 
     * This plugin triggers three new events on Matter.Body:
     * 
     * 1. `onCollide`
     * 2. `onCollideEnd`
     * 3. `onCollideActive`
     * 
     * These events correspond to the Matter.js events `collisionStart`, `collisionActive` and `collisionEnd`, respectively.
     * You can listen to these events via Matter.Events or they will also be emitted from the Matter World.
     * 
     * This plugin also extends Matter.Body with three convenience functions:
     * 
     * `Matter.Body.onCollide(callback)`
     * `Matter.Body.onCollideEnd(callback)`
     * `Matter.Body.onCollideActive(callback)`
     * 
     * You can register event callbacks by providing a function of type ( pair: Matter.Pair) => void:
     * 
     * https://github.com/dxu/matter-collision-events
     *
     * @method Phaser.Physics.Matter.MatterPhysics#enableCollisionEventsPlugin
     * @since 3.22.0
     * 
     * @return {this} This Matter Physics instance.
     */
    enableCollisionEventsPlugin: function ()
    {
        Plugin.register(MatterCollisionEvents);
        Plugin.use(MatterLib, MatterCollisionEvents);

        return this;
    },

    /**
     * Pauses the Matter World instance and sets `enabled` to `false`.
     * 
     * A paused world will not run any simulations for the duration it is paused.
     *
     * @method Phaser.Physics.Matter.MatterPhysics#pause
     * @fires Phaser.Physics.Matter.Events#PAUSE
     * @since 3.0.0
     *
     * @return {Phaser.Physics.Matter.World} The Matter World object.
     */
    pause: function ()
    {
        return this.world.pause();
    },

    /**
     * Resumes this Matter World instance from a paused state and sets `enabled` to `true`.
     *
     * @method Phaser.Physics.Matter.MatterPhysics#resume
     * @since 3.0.0
     *
     * @return {Phaser.Physics.Matter.World} The Matter World object.
     */
    resume: function ()
    {
        return this.world.resume();
    },

    /**
     * Sets the Matter Engine to run at fixed timestep of 60Hz and enables `autoUpdate`.
     * If you have set a custom `getDelta` function then this will override it.
     *
     * @method Phaser.Physics.Matter.MatterPhysics#set60Hz
     * @since 3.4.0
     *
     * @return {this} This Matter Physics instance.
     */
    set60Hz: function ()
    {
        this.world.getDelta = this.world.update60Hz;
        this.world.autoUpdate = true;

        return this;
    },

    /**
     * Sets the Matter Engine to run at fixed timestep of 30Hz and enables `autoUpdate`.
     * If you have set a custom `getDelta` function then this will override it.
     *
     * @method Phaser.Physics.Matter.MatterPhysics#set30Hz
     * @since 3.4.0
     *
     * @return {this} This Matter Physics instance.
     */
    set30Hz: function ()
    {
        this.world.getDelta = this.world.update30Hz;
        this.world.autoUpdate = true;

        return this;
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
     * @method Phaser.Physics.Matter.MatterPhysics#step
     * @since 3.4.0
     *
     * @param {number} [delta=16.666] - The delta value.
     * @param {number} [correction=1] - Optional delta correction value.
     */
    step: function (delta, correction)
    {
        this.world.step(delta, correction);
    },

    /**
     * Checks if the vertices of the given body, or an array of bodies, contains the given point, or not.
     * 
     * If you wish to check this against a Phaser Game Object, such as a Matter Sprite,
     * then pass in the body property, i.e. `this.matter.containsPoint(sprite.body, x, y)`
     * 
     * You can pass in either a single body, or an array of bodies to be checked. This method will
     * return `true` if _any_ of the bodies in the array contain the point. See also the `getBodiesBelowPoint` method.
     * 
     * The point should be transformed into the Matter World coordinate system in advance. This happens by
     * default with Input Pointers, but if you wish to use points from another system you may need to
     * transform them before passing them.
     * 
     * @method Phaser.Physics.Matter.MatterPhysics#containsPoint
     * @since 3.22.0
     *
     * @param {(MatterJS.Body|MatterJS.Body[])} body - The body, or an array of bodies, to check against the point.
     * @param {number} x - The horizontal coordinate of the point.
     * @param {number} y - The vertical coordinate of the point.
     * 
     * @return {boolean} `true` if the point is within one of the bodies given, otherwise `false`.
     */
    containsPoint: function (body, x, y)
    {
        if (!Array.isArray(body))
        {
            body = [ body ];
        }

        var position = Vector.create(x, y);

        var result = Query.point(body, position);

        return (result.length > 0) ? true : false;
    },

    /**
     * Checks the given point to see if it lays within the vertices of any bodies in the Matter World.
     * 
     * The point should be transformed into the Matter World coordinate system in advance. This happens by
     * default with Input Pointers, but if you wish to use points from another system you may need to
     * transform them before passing them.
     * 
     * @method Phaser.Physics.Matter.MatterPhysics#getBodiesBelowPoint
     * @since 3.22.0
     *
     * @param {number} x - The horizontal coordinate of the point.
     * @param {number} y - The vertical coordinate of the point.
     * 
     * @return {MatterJS.Body[]} An array of bodies whos vertices contain the given point.
     */
    getBodiesBelowPoint: function (x, y)
    {
        var bodies = this.world.getAllBodies();
        var position = Vector.create(x, y);

        return Query.point(bodies, position);
    },

    /**
     * The Scene that owns this plugin is shutting down.
     * We need to kill and reset all internal properties as well as stop listening to Scene events.
     *
     * @method Phaser.Physics.Matter.MatterPhysics#shutdown
     * @private
     * @since 3.0.0
     */
    shutdown: function ()
    {
        var eventEmitter = this.systems.events;

        if (this.world)
        {
            eventEmitter.off(SceneEvents.UPDATE, this.world.update, this.world);
            eventEmitter.off(SceneEvents.POST_UPDATE, this.world.postUpdate, this.world);
        }

        eventEmitter.off(SceneEvents.SHUTDOWN, this.shutdown, this);

        if (this.add)
        {
            this.add.destroy();
        }

        if (this.world)
        {
            this.world.destroy();
        }

        this.add = null;
        this.world = null;
    },

    /**
     * The Scene that owns this plugin is being destroyed.
     * We need to shutdown and then kill off all external references.
     *
     * @method Phaser.Physics.Matter.MatterPhysics#destroy
     * @private
     * @since 3.0.0
     */
    destroy: function ()
    {
        this.shutdown();

        this.scene.sys.events.off(SceneEvents.START, this.start, this);

        this.scene = null;
        this.systems = null;
    }

});

PluginCache.register('MatterPhysics', MatterPhysics, 'matterPhysics');

module.exports = MatterPhysics;
