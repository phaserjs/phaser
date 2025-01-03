/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var ALIGN_CONST = require('../../display/align/const');
var Axes = require('./lib/geometry/Axes');
var Bodies = require('./lib/factory/Bodies');
var Body = require('./lib/body/Body');
var BodyBounds = require('./BodyBounds');
var Bounds = require('./lib/geometry/Bounds');
var Class = require('../../utils/Class');
var Collision = require('./lib/collision/Collision');
var Common = require('./lib/core/Common');
var Composite = require('./lib/body/Composite');
var Composites = require('./lib/factory/Composites');
var Constraint = require('./lib/constraint/Constraint');
var Detector = require('./lib/collision/Detector');
var DistanceBetween = require('../../math/distance/DistanceBetween');
var Factory = require('./Factory');
var GetFastValue = require('../../utils/object/GetFastValue');
var GetValue = require('../../utils/object/GetValue');
var Merge = require('../../utils/object/Merge');
var Pair = require('./lib/collision/Pair');
var Pairs = require('./lib/collision/Pairs');
var PluginCache = require('../../plugins/PluginCache');
var Query = require('./lib/collision/Query');
var Resolver = require('./lib/collision/Resolver');
var SceneEvents = require('../../scene/events');
var Svg = require('./lib/geometry/Svg');
var Vector = require('./lib/geometry/Vector');
var Vertices = require('./lib/geometry/Vertices');
var World = require('./World');

Common.setDecomp(require('./poly-decomp'));

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
         * An instance of the Matter Factory. This class provides lots of functions for creating a
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

        /**
         * An instance of the Body Bounds class. This class contains functions used for getting the
         * world position from various points around the bounds of a physics body.
         *
         * @name Phaser.Physics.Matter.MatterPhysics#bodyBounds
         * @type {Phaser.Physics.Matter.BodyBounds}
         * @since 3.22.0
         */
        this.bodyBounds;

        //  Body

        /**
         * A reference to the `Matter.Body` module.
         *
         * The `Matter.Body` module contains methods for creating and manipulating body models.
         * A `Matter.Body` is a rigid body that can be simulated by a `Matter.Engine`.
         * Factories for commonly used body configurations (such as rectangles, circles and other polygons) can be found in the `Bodies` module.
         *
         * @name Phaser.Physics.Matter.MatterPhysics#body
         * @type {MatterJS.BodyFactory}
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
         * @type {MatterJS.CompositeFactory}
         * @since 3.22.0
         */
        this.composite = Composite;

        //  Collision:

        /**
         * A reference to the `Matter.Collision` module.
         *
         * The `Matter.Collision` module contains methods for detecting collisions between a given pair of bodies.
         *
         * For efficient detection between a list of bodies, see `Matter.Detector` and `Matter.Query`.
         *
         * @name Phaser.Physics.Matter.MatterPhysics#collision
         * @type {MatterJS.Collision}
         * @since 3.60.0
         */
        this.collision = Collision;

        /**
         * A reference to the `Matter.Detector` module.
         *
         * The `Matter.Detector` module contains methods for detecting collisions given a set of pairs.
         *
         * @name Phaser.Physics.Matter.MatterPhysics#detector
         * @type {MatterJS.DetectorFactory}
         * @since 3.22.0
         */
        this.detector = Detector;

        /**
         * A reference to the `Matter.Pair` module.
         *
         * The `Matter.Pair` module contains methods for creating and manipulating collision pairs.
         *
         * @name Phaser.Physics.Matter.MatterPhysics#pair
         * @type {MatterJS.PairFactory}
         * @since 3.22.0
         */
        this.pair = Pair;

        /**
         * A reference to the `Matter.Pairs` module.
         *
         * The `Matter.Pairs` module contains methods for creating and manipulating collision pair sets.
         *
         * @name Phaser.Physics.Matter.MatterPhysics#pairs
         * @type {MatterJS.PairsFactory}
         * @since 3.22.0
         */
        this.pairs = Pairs;

        /**
         * A reference to the `Matter.Query` module.
         *
         * The `Matter.Query` module contains methods for performing collision queries.
         *
         * @name Phaser.Physics.Matter.MatterPhysics#query
         * @type {MatterJS.QueryFactory}
         * @since 3.22.0
         */
        this.query = Query;

        /**
         * A reference to the `Matter.Resolver` module.
         *
         * The `Matter.Resolver` module contains methods for resolving collision pairs.
         *
         * @name Phaser.Physics.Matter.MatterPhysics#resolver
         * @type {MatterJS.ResolverFactory}
         * @since 3.22.0
         */
        this.resolver = Resolver;

        //  Constraint

        /**
         * A reference to the `Matter.Constraint` module.
         *
         * The `Matter.Constraint` module contains methods for creating and manipulating constraints.
         * Constraints are used for specifying that a fixed distance must be maintained between two bodies (or a body and a fixed world-space position).
         * The stiffness of constraints can be modified to create springs or elastic.
         *
         * @name Phaser.Physics.Matter.MatterPhysics#constraint
         * @type {MatterJS.ConstraintFactory}
         * @since 3.22.0
         */
        this.constraint = Constraint;

        //  Factory

        /**
         * A reference to the `Matter.Bodies` module.
         *
         * The `Matter.Bodies` module contains factory methods for creating rigid bodies
         * with commonly used body configurations (such as rectangles, circles and other polygons).
         *
         * @name Phaser.Physics.Matter.MatterPhysics#bodies
         * @type {MatterJS.BodiesFactory}
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
         * @type {MatterJS.CompositesFactory}
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
         * @type {MatterJS.AxesFactory}
         * @since 3.22.0
         */
        this.axes = Axes;

        /**
         * A reference to the `Matter.Bounds` module.
         *
         * The `Matter.Bounds` module contains methods for creating and manipulating axis-aligned bounding boxes (AABB).
         *
         * @name Phaser.Physics.Matter.MatterPhysics#bounds
         * @type {MatterJS.BoundsFactory}
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
         * @type {MatterJS.SvgFactory}
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
         * @type {MatterJS.VectorFactory}
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
         * @type {MatterJS.VerticesFactory}
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
         * @type {MatterJS.VerticesFactory}
         * @since 3.14.0
         */
        this.verts = Vertices;

        /**
         * An internal temp vector used for velocity and force calculations.
         *
         * @name Phaser.Physics.Matter.MatterPhysics#_tempVec2
         * @type {MatterJS.Vector}
         * @private
         * @since 3.22.0
         */
        this._tempVec2 = Vector.create();

        Resolver._restingThresh = GetValue(this.config, 'restingThresh', 4);
        Resolver._restingThreshTangent = GetValue(this.config, 'restingThreshTangent', 6);
        Resolver._positionDampen = GetValue(this.config, 'positionDampen', 0.9);
        Resolver._positionWarming = GetValue(this.config, 'positionWarming', 0.8);
        Resolver._frictionNormalMultiplier = GetValue(this.config, 'frictionNormalMultiplier', 5);

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
        this.bodyBounds = new BodyBounds();

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
     * You can pass in either a single body, or an array of bodies to be checked. This method will
     * return `true` if _any_ of the bodies in the array contain the point. See the `intersectPoint` method if you need
     * to get a list of intersecting bodies.
     *
     * The point should be transformed into the Matter World coordinate system in advance. This happens by
     * default with Input Pointers, but if you wish to use points from another system you may need to
     * transform them before passing them.
     *
     * @method Phaser.Physics.Matter.MatterPhysics#containsPoint
     * @since 3.22.0
     *
     * @param {(Phaser.Types.Physics.Matter.MatterBody|Phaser.Types.Physics.Matter.MatterBody[])} body - The body, or an array of bodies, to check against the point.
     * @param {number} x - The horizontal coordinate of the point.
     * @param {number} y - The vertical coordinate of the point.
     *
     * @return {boolean} `true` if the point is within one of the bodies given, otherwise `false`.
     */
    containsPoint: function (body, x, y)
    {
        body = this.getMatterBodies(body);

        var position = Vector.create(x, y);

        var result = Query.point(body, position);

        return (result.length > 0) ? true : false;
    },

    /**
     * Checks the given coordinates to see if any vertices of the given bodies contain it.
     *
     * If no bodies are provided it will search all bodies in the Matter World, including within Composites.
     *
     * The coordinates should be transformed into the Matter World coordinate system in advance. This happens by
     * default with Input Pointers, but if you wish to use coordinates from another system you may need to
     * transform them before passing them.
     *
     * @method Phaser.Physics.Matter.MatterPhysics#intersectPoint
     * @since 3.22.0
     *
     * @param {number} x - The horizontal coordinate of the point.
     * @param {number} y - The vertical coordinate of the point.
     * @param {Phaser.Types.Physics.Matter.MatterBody[]} [bodies] - An array of bodies to check. If not provided it will search all bodies in the world.
     *
     * @return {Phaser.Types.Physics.Matter.MatterBody[]} An array of bodies which contain the given point.
     */
    intersectPoint: function (x, y, bodies)
    {
        bodies = this.getMatterBodies(bodies);

        var position = Vector.create(x, y);

        var output = [];

        var result = Query.point(bodies, position);

        result.forEach(function (body)
        {
            if (output.indexOf(body) === -1)
            {
                output.push(body);
            }
        });

        return output;
    },

    /**
     * Checks the given rectangular area to see if any vertices of the given bodies intersect with it.
     * Or, if the `outside` parameter is set to `true`, it checks to see which bodies do not
     * intersect with it.
     *
     * If no bodies are provided it will search all bodies in the Matter World, including within Composites.
     *
     * @method Phaser.Physics.Matter.MatterPhysics#intersectRect
     * @since 3.22.0
     *
     * @param {number} x - The horizontal coordinate of the top-left of the area.
     * @param {number} y - The vertical coordinate of the top-left of the area.
     * @param {number} width - The width of the area.
     * @param {number} height - The height of the area.
     * @param {boolean} [outside=false] - If `false` it checks for vertices inside the area, if `true` it checks for vertices outside the area.
     * @param {Phaser.Types.Physics.Matter.MatterBody[]} [bodies] - An array of bodies to check. If not provided it will search all bodies in the world.
     *
     * @return {Phaser.Types.Physics.Matter.MatterBody[]} An array of bodies that intersect with the given area.
     */
    intersectRect: function (x, y, width, height, outside, bodies)
    {
        if (outside === undefined) { outside = false; }

        bodies = this.getMatterBodies(bodies);

        var bounds = {
            min: { x: x, y: y },
            max: { x: x + width, y: y + height }
        };

        var output = [];

        var result = Query.region(bodies, bounds, outside);

        result.forEach(function (body)
        {
            if (output.indexOf(body) === -1)
            {
                output.push(body);
            }
        });

        return output;
    },

    /**
     * Checks the given ray segment to see if any vertices of the given bodies intersect with it.
     *
     * If no bodies are provided it will search all bodies in the Matter World.
     *
     * The width of the ray can be specified via the `rayWidth` parameter.
     *
     * @method Phaser.Physics.Matter.MatterPhysics#intersectRay
     * @since 3.22.0
     *
     * @param {number} x1 - The horizontal coordinate of the start of the ray segment.
     * @param {number} y1 - The vertical coordinate of the start of the ray segment.
     * @param {number} x2 - The horizontal coordinate of the end of the ray segment.
     * @param {number} y2 - The vertical coordinate of the end of the ray segment.
     * @param {number} [rayWidth=1] - The width of the ray segment.
     * @param {Phaser.Types.Physics.Matter.MatterBody[]} [bodies] - An array of bodies to check. If not provided it will search all bodies in the world.
     *
     * @return {Phaser.Types.Physics.Matter.MatterBody[]} An array of bodies whos vertices intersect with the ray segment.
     */
    intersectRay: function (x1, y1, x2, y2, rayWidth, bodies)
    {
        if (rayWidth === undefined) { rayWidth = 1; }

        bodies = this.getMatterBodies(bodies);

        var result = [];
        var collisions = Query.ray(bodies, Vector.create(x1, y1), Vector.create(x2, y2), rayWidth);

        for (var i = 0; i < collisions.length; i++)
        {
            result.push(collisions[i].body);
        }

        return result;
    },

    /**
     * Checks the given Matter Body to see if it intersects with any of the given bodies.
     *
     * If no bodies are provided it will check against all bodies in the Matter World.
     *
     * @method Phaser.Physics.Matter.MatterPhysics#intersectBody
     * @since 3.22.0
     *
     * @param {Phaser.Types.Physics.Matter.MatterBody} body - The target body.
     * @param {Phaser.Types.Physics.Matter.MatterBody[]} [bodies] - An array of bodies to check the target body against. If not provided it will search all bodies in the world.
     *
     * @return {Phaser.Types.Physics.Matter.MatterBody[]} An array of bodies whos vertices intersect with target body.
     */
    intersectBody: function (body, bodies)
    {
        bodies = this.getMatterBodies(bodies);

        var result = [];
        var collisions = Query.collides(body, bodies);

        for (var i = 0; i < collisions.length; i++)
        {
            var pair = collisions[i];

            if (pair.bodyA === body)
            {
                result.push(pair.bodyB);
            }
            else
            {
                result.push(pair.bodyA);
            }
        }

        return result;
    },

    /**
     * Checks to see if the target body, or an array of target bodies, intersects with any of the given bodies.
     *
     * If intersection occurs this method will return `true` and, if provided, invoke the callbacks.
     *
     * If no bodies are provided for the second parameter the target will check against all bodies in the Matter World.
     *
     * **Note that bodies can only overlap if they are in non-colliding collision groups or categories.**
     *
     * If you provide a `processCallback` then the two bodies that overlap are sent to it. This callback
     * must return a boolean and is used to allow you to perform additional processing tests before a final
     * outcome is decided. If it returns `true` then the bodies are finally passed to the `overlapCallback`, if set.
     *
     * If you provide an `overlapCallback` then the matching pairs of overlapping bodies will be sent to it.
     *
     * Both callbacks have the following signature: `function (bodyA, bodyB, collisionInfo)` where `bodyA` is always
     * the target body. The `collisionInfo` object contains additional data, such as the angle and depth of penetration.
     *
     * @method Phaser.Physics.Matter.MatterPhysics#overlap
     * @since 3.22.0
     *
     * @param {(Phaser.Types.Physics.Matter.MatterBody|Phaser.Types.Physics.Matter.MatterBody[])} target - The target body, or array of target bodies, to check.
     * @param {Phaser.Types.Physics.Matter.MatterBody[]} [bodies] - The second body, or array of bodies, to check. If falsey it will check against all bodies in the world.
     * @param {Phaser.Types.Physics.Arcade.ArcadePhysicsCallback} [overlapCallback] - An optional callback function that is called if the bodies overlap.
     * @param {Phaser.Types.Physics.Arcade.ArcadePhysicsCallback} [processCallback] - An optional callback function that lets you perform additional checks against the two bodies if they overlap. If this is set then `overlapCallback` will only be invoked if this callback returns `true`.
     * @param {*} [callbackContext] - The context, or scope, in which to run the callbacks.
     *
     * @return {boolean} `true` if the target body intersects with _any_ of the bodies given, otherwise `false`.
     */
    overlap: function (target, bodies, overlapCallback, processCallback, callbackContext)
    {
        if (overlapCallback === undefined) { overlapCallback = null; }
        if (processCallback === undefined) { processCallback = null; }
        if (callbackContext === undefined) { callbackContext = overlapCallback; }

        if (!Array.isArray(target))
        {
            target = [ target ];
        }

        target = this.getMatterBodies(target);
        bodies = this.getMatterBodies(bodies);

        var match = false;

        for (var i = 0; i < target.length; i++)
        {
            var entry = target[i];

            var collisions = Query.collides(entry, bodies);

            for (var c = 0; c < collisions.length; c++)
            {
                var info = collisions[c];
                var bodyB = (info.bodyA.id === entry.id) ? info.bodyB : info.bodyA;

                if (!processCallback || processCallback.call(callbackContext, entry, bodyB, info))
                {
                    match = true;

                    if (overlapCallback)
                    {
                        overlapCallback.call(callbackContext, entry, bodyB, info);
                    }
                    else if (!processCallback)
                    {
                        //  If there are no callbacks we don't need to test every body, just exit when the first is found
                        return true;
                    }
                }
            }
        }

        return match;
    },

    /**
     * Sets the collision filter category of all given Matter Bodies to the given value.
     *
     * This number must be a power of two between 2^0 (= 1) and 2^31.
     *
     * Bodies with different collision groups (see {@link #setCollisionGroup}) will only collide if their collision
     * categories are included in their collision masks (see {@link #setCollidesWith}).
     *
     * @method Phaser.Physics.Matter.MatterPhysics#setCollisionCategory
     * @since 3.22.0
     *
     * @param {Phaser.Types.Physics.Matter.MatterBody[]} bodies - An array of bodies to update. If falsey it will use all bodies in the world.
     * @param {number} value - Unique category bitfield.
     *
     * @return {this} This Matter Physics instance.
     */
    setCollisionCategory: function (bodies, value)
    {
        bodies = this.getMatterBodies(bodies);

        bodies.forEach(function (body)
        {
            body.collisionFilter.category = value;
        });

        return this;
    },

    /**
     * Sets the collision filter group of all given Matter Bodies to the given value.
     *
     * If the group value is zero, or if two Matter Bodies have different group values,
     * they will collide according to the usual collision filter rules (see {@link #setCollisionCategory} and {@link #setCollisionGroup}).
     *
     * If two Matter Bodies have the same positive group value, they will always collide;
     * if they have the same negative group value they will never collide.
     *
     * @method Phaser.Physics.Matter.MatterPhysics#setCollisionGroup
     * @since 3.22.0
     *
     * @param {Phaser.Types.Physics.Matter.MatterBody[]} bodies - An array of bodies to update. If falsey it will use all bodies in the world.
     * @param {number} value - Unique group index.
     *
     * @return {this} This Matter Physics instance.
     */
    setCollisionGroup: function (bodies, value)
    {
        bodies = this.getMatterBodies(bodies);

        bodies.forEach(function (body)
        {
            body.collisionFilter.group = value;
        });

        return this;
    },

    /**
     * Sets the collision filter mask of all given Matter Bodies to the given value.
     *
     * Two Matter Bodies with different collision groups will only collide if each one includes the others
     * category in its mask based on a bitwise AND operation: `(categoryA & maskB) !== 0` and
     * `(categoryB & maskA) !== 0` are both true.
     *
     * @method Phaser.Physics.Matter.MatterPhysics#setCollidesWith
     * @since 3.22.0
     *
     * @param {Phaser.Types.Physics.Matter.MatterBody[]} bodies - An array of bodies to update. If falsey it will use all bodies in the world.
     * @param {(number|number[])} categories - A unique category bitfield, or an array of them.
     *
     * @return {this} This Matter Physics instance.
     */
    setCollidesWith: function (bodies, categories)
    {
        bodies = this.getMatterBodies(bodies);

        var flags = 0;

        if (!Array.isArray(categories))
        {
            flags = categories;
        }
        else
        {
            for (var i = 0; i < categories.length; i++)
            {
                flags |= categories[i];
            }
        }

        bodies.forEach(function (body)
        {
            body.collisionFilter.mask = flags;
        });

        return this;
    },

    /**
     * Takes an array and returns a new array made from all of the Matter Bodies found in the original array.
     *
     * For example, passing in Matter Game Objects, such as a bunch of Matter Sprites, to this method, would
     * return an array containing all of their native Matter Body objects.
     *
     * If the `bodies` argument is falsey, it will return all bodies in the world.
     *
     * @method Phaser.Physics.Matter.MatterPhysics#getMatterBodies
     * @since 3.22.0
     *
     * @param {array} [bodies] - An array of objects to extract the bodies from. If falsey, it will return all bodies in the world.
     *
     * @return {MatterJS.BodyType[]} An array of native Matter Body objects.
     */
    getMatterBodies: function (bodies)
    {
        if (!bodies)
        {
            return this.world.getAllBodies();
        }

        if (!Array.isArray(bodies))
        {
            bodies = [ bodies ];
        }

        var output = [];

        for (var i = 0; i < bodies.length; i++)
        {
            var body = (bodies[i].hasOwnProperty('body')) ? bodies[i].body : bodies[i];

            output.push(body);
        }

        return output;
    },

    /**
     * Sets both the horizontal and vertical linear velocity of the physics bodies.
     *
     * @method Phaser.Physics.Matter.MatterPhysics#setVelocity
     * @since 3.22.0
     *
     * @param {(Phaser.Types.Physics.Matter.MatterBody|Phaser.Types.Physics.Matter.MatterBody[])} bodies - Either a single Body, or an array of bodies to update. If falsey it will use all bodies in the world.
     * @param {number} x - The horizontal linear velocity value.
     * @param {number} y - The vertical linear velocity value.
     *
     * @return {this} This Matter Physics instance.
     */
    setVelocity: function (bodies, x, y)
    {
        bodies = this.getMatterBodies(bodies);

        var vec2 = this._tempVec2;

        vec2.x = x;
        vec2.y = y;

        bodies.forEach(function (body)
        {
            Body.setVelocity(body, vec2);
        });

        return this;
    },

    /**
     * Sets just the horizontal linear velocity of the physics bodies.
     * The vertical velocity of the body is unchanged.
     *
     * @method Phaser.Physics.Matter.MatterPhysics#setVelocityX
     * @since 3.22.0
     *
     * @param {(Phaser.Types.Physics.Matter.MatterBody|Phaser.Types.Physics.Matter.MatterBody[])} bodies - Either a single Body, or an array of bodies to update. If falsey it will use all bodies in the world.
     * @param {number} x - The horizontal linear velocity value.
     *
     * @return {this} This Matter Physics instance.
     */
    setVelocityX: function (bodies, x)
    {
        bodies = this.getMatterBodies(bodies);

        var vec2 = this._tempVec2;

        vec2.x = x;

        bodies.forEach(function (body)
        {
            vec2.y = body.velocity.y;
            Body.setVelocity(body, vec2);
        });

        return this;
    },

    /**
     * Sets just the vertical linear velocity of the physics bodies.
     * The horizontal velocity of the body is unchanged.
     *
     * @method Phaser.Physics.Matter.MatterPhysics#setVelocityY
     * @since 3.22.0
     *
     * @param {(Phaser.Types.Physics.Matter.MatterBody|Phaser.Types.Physics.Matter.MatterBody[])} bodies - Either a single Body, or an array of bodies to update. If falsey it will use all bodies in the world.
     * @param {number} y - The vertical linear velocity value.
     *
     * @return {this} This Matter Physics instance.
     */
    setVelocityY: function (bodies, y)
    {
        bodies = this.getMatterBodies(bodies);

        var vec2 = this._tempVec2;

        vec2.y = y;

        bodies.forEach(function (body)
        {
            vec2.x = body.velocity.x;
            Body.setVelocity(body, vec2);
        });

        return this;
    },

    /**
     * Sets the angular velocity of the bodies instantly.
     * Position, angle, force etc. are unchanged.
     *
     * @method Phaser.Physics.Matter.MatterPhysics#setAngularVelocity
     * @since 3.22.0
     *
     * @param {(Phaser.Types.Physics.Matter.MatterBody|Phaser.Types.Physics.Matter.MatterBody[])} bodies - Either a single Body, or an array of bodies to update. If falsey it will use all bodies in the world.
     * @param {number} value - The angular velocity.
     *
     * @return {this} This Matter Physics instance.
     */
    setAngularVelocity: function (bodies, value)
    {
        bodies = this.getMatterBodies(bodies);

        bodies.forEach(function (body)
        {
            Body.setAngularVelocity(body, value);
        });

        return this;
    },

    /**
     * Applies a force to a body, at the bodies current position, including resulting torque.
     *
     * @method Phaser.Physics.Matter.MatterPhysics#applyForce
     * @since 3.22.0
     *
     * @param {(Phaser.Types.Physics.Matter.MatterBody|Phaser.Types.Physics.Matter.MatterBody[])} bodies - Either a single Body, or an array of bodies to update. If falsey it will use all bodies in the world.
     * @param {Phaser.Types.Math.Vector2Like} force - A Vector that specifies the force to apply.
     *
     * @return {this} This Matter Physics instance.
     */
    applyForce: function (bodies, force)
    {
        bodies = this.getMatterBodies(bodies);

        var vec2 = this._tempVec2;

        bodies.forEach(function (body)
        {
            vec2.x = body.position.x;
            vec2.y = body.position.y;

            Body.applyForce(body, vec2, force);
        });

        return this;
    },

    /**
     * Applies a force to a body, from the given world position, including resulting torque.
     * If no angle is given, the current body angle is used.
     *
     * Use very small speed values, such as 0.1, depending on the mass and required velocity.
     *
     * @method Phaser.Physics.Matter.MatterPhysics#applyForceFromPosition
     * @since 3.22.0
     *
     * @param {(Phaser.Types.Physics.Matter.MatterBody|Phaser.Types.Physics.Matter.MatterBody[])} bodies - Either a single Body, or an array of bodies to update. If falsey it will use all bodies in the world.
     * @param {Phaser.Types.Math.Vector2Like} position - A Vector that specifies the world-space position to apply the force at.
     * @param {number} speed - A speed value to be applied to a directional force.
     * @param {number} [angle] - The angle, in radians, to apply the force from. Leave undefined to use the current body angle.
     *
     * @return {this} This Matter Physics instance.
     */
    applyForceFromPosition: function (bodies, position, speed, angle)
    {
        bodies = this.getMatterBodies(bodies);

        var vec2 = this._tempVec2;

        bodies.forEach(function (body)
        {
            if (angle === undefined)
            {
                angle = body.angle;
            }

            vec2.x = speed * Math.cos(angle);
            vec2.y = speed * Math.sin(angle);

            Body.applyForce(body, position, vec2);
        });

        return this;
    },

    /**
     * Apply a force to a body based on the given angle and speed.
     * If no angle is given, the current body angle is used.
     *
     * Use very small speed values, such as 0.1, depending on the mass and required velocity.
     *
     * @method Phaser.Physics.Matter.MatterPhysics#applyForceFromAngle
     * @since 3.22.0
     *
     * @param {(Phaser.Types.Physics.Matter.MatterBody|Phaser.Types.Physics.Matter.MatterBody[])} bodies - Either a single Body, or an array of bodies to update. If falsey it will use all bodies in the world.
     * @param {number} speed - A speed value to be applied to a directional force.
     * @param {number} [angle] - The angle, in radians, to apply the force from. Leave undefined to use the current body angle.
     *
     * @return {this} This Matter Physics instance.
     */
    applyForceFromAngle: function (bodies, speed, angle)
    {
        bodies = this.getMatterBodies(bodies);

        var vec2 = this._tempVec2;

        bodies.forEach(function (body)
        {
            if (angle === undefined)
            {
                angle = body.angle;
            }

            vec2.x = speed * Math.cos(angle);
            vec2.y = speed * Math.sin(angle);

            Body.applyForce(body, { x: body.position.x, y: body.position.y }, vec2);
        });

        return this;
    },

    /**
     * Returns the length of the given constraint, which is the distance between the two points.
     *
     * @method Phaser.Physics.Matter.MatterPhysics#getConstraintLength
     * @since 3.22.0
     *
     * @param {MatterJS.ConstraintType} constraint - The constraint to get the length from.
     *
     * @return {number} The length of the constraint.
     */
    getConstraintLength: function (constraint)
    {
        var aX = constraint.pointA.x;
        var aY = constraint.pointA.y;
        var bX = constraint.pointB.x;
        var bY = constraint.pointB.y;

        if (constraint.bodyA)
        {
            aX += constraint.bodyA.position.x;
            aY += constraint.bodyA.position.y;
        }

        if (constraint.bodyB)
        {
            bX += constraint.bodyB.position.x;
            bY += constraint.bodyB.position.y;
        }

        return DistanceBetween(aX, aY, bX, bY);
    },

    /**
     * Aligns a Body, or Matter Game Object, against the given coordinates.
     *
     * The alignment takes place using the body bounds, which take into consideration things
     * like body scale and rotation.
     *
     * Although a Body has a `position` property, it is based on the center of mass for the body,
     * not a dimension based center. This makes aligning bodies difficult, especially if they have
     * rotated or scaled. This method will derive the correct position based on the body bounds and
     * its center of mass offset, in order to align the body with the given coordinate.
     *
     * For example, if you wanted to align a body so it sat in the bottom-center of the
     * Scene, and the world was 800 x 600 in size:
     *
     * ```javascript
     * this.matter.alignBody(body, 400, 600, Phaser.Display.Align.BOTTOM_CENTER);
     * ```
     *
     * You pass in 400 for the x coordinate, because that is the center of the world, and 600 for
     * the y coordinate, as that is the base of the world.
     *
     * @method Phaser.Physics.Matter.MatterPhysics#alignBody
     * @since 3.22.0
     *
     * @param {Phaser.Types.Physics.Matter.MatterBody} body - The Body to align.
     * @param {number} x - The horizontal position to align the body to.
     * @param {number} y - The vertical position to align the body to.
     * @param {number} align - One of the `Phaser.Display.Align` constants, such as `Phaser.Display.Align.TOP_LEFT`.
     *
     * @return {this} This Matter Physics instance.
     */
    alignBody: function (body, x, y, align)
    {
        body = (body.hasOwnProperty('body')) ? body.body : body;

        var pos;

        switch (align)
        {
            case ALIGN_CONST.TOP_LEFT:
            case ALIGN_CONST.LEFT_TOP:
                pos = this.bodyBounds.getTopLeft(body, x, y);
                break;

            case ALIGN_CONST.TOP_CENTER:
                pos = this.bodyBounds.getTopCenter(body, x, y);
                break;

            case ALIGN_CONST.TOP_RIGHT:
            case ALIGN_CONST.RIGHT_TOP:
                pos = this.bodyBounds.getTopRight(body, x, y);
                break;

            case ALIGN_CONST.LEFT_CENTER:
                pos = this.bodyBounds.getLeftCenter(body, x, y);
                break;

            case ALIGN_CONST.CENTER:
                pos = this.bodyBounds.getCenter(body, x, y);
                break;

            case ALIGN_CONST.RIGHT_CENTER:
                pos = this.bodyBounds.getRightCenter(body, x, y);
                break;

            case ALIGN_CONST.LEFT_BOTTOM:
            case ALIGN_CONST.BOTTOM_LEFT:
                pos = this.bodyBounds.getBottomLeft(body, x, y);
                break;

            case ALIGN_CONST.BOTTOM_CENTER:
                pos = this.bodyBounds.getBottomCenter(body, x, y);
                break;

            case ALIGN_CONST.BOTTOM_RIGHT:
            case ALIGN_CONST.RIGHT_BOTTOM:
                pos = this.bodyBounds.getBottomRight(body, x, y);
                break;
        }

        if (pos)
        {
            Body.setPosition(body, pos);
        }

        return this;
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
