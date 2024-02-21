/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2024 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var AngleBetweenPoints = require('../../math/angle/BetweenPoints');
var Body = require('./Body');
var Clamp = require('../../math/Clamp');
var Class = require('../../utils/Class');
var Collider = require('./Collider');
var CONST = require('./const');
var DistanceBetween = require('../../math/distance/DistanceBetween');
var DistanceBetweenPoints = require('../../math/distance/DistanceBetweenPoints');
var EventEmitter = require('eventemitter3');
var Events = require('./events');
var FuzzyEqual = require('../../math/fuzzy/Equal');
var FuzzyGreaterThan = require('../../math/fuzzy/GreaterThan');
var FuzzyLessThan = require('../../math/fuzzy/LessThan');
var GetOverlapX = require('./GetOverlapX');
var GetOverlapY = require('./GetOverlapY');
var GetTilesWithinWorldXY = require('../../tilemaps/components/GetTilesWithinWorldXY');
var GetValue = require('../../utils/object/GetValue');
var MATH_CONST = require('../../math/const');
var ProcessQueue = require('../../structs/ProcessQueue');
var ProcessTileCallbacks = require('./tilemap/ProcessTileCallbacks');
var Rectangle = require('../../geom/rectangle/Rectangle');
var RTree = require('../../structs/RTree');
var SeparateTile = require('./tilemap/SeparateTile');
var SeparateX = require('./SeparateX');
var SeparateY = require('./SeparateY');
var Set = require('../../structs/Set');
var StaticBody = require('./StaticBody');
var TileIntersectsBody = require('./tilemap/TileIntersectsBody');
var TransformMatrix = require('../../gameobjects/components/TransformMatrix');
var Vector2 = require('../../math/Vector2');
var Wrap = require('../../math/Wrap');

/**
 * @classdesc
 * The Arcade Physics World.
 *
 * The World is responsible for creating, managing, colliding and updating all of the bodies within it.
 *
 * An instance of the World belongs to a Phaser.Scene and is accessed via the property `physics.world`.
 *
 * @class World
 * @extends Phaser.Events.EventEmitter
 * @memberof Phaser.Physics.Arcade
 * @constructor
 * @since 3.0.0
 *
 * @param {Phaser.Scene} scene - The Scene to which this World instance belongs.
 * @param {Phaser.Types.Physics.Arcade.ArcadeWorldConfig} config - An Arcade Physics Configuration object.
 */
var World = new Class({

    Extends: EventEmitter,

    initialize:

    function World (scene, config)
    {
        EventEmitter.call(this);

        /**
         * The Scene this simulation belongs to.
         *
         * @name Phaser.Physics.Arcade.World#scene
         * @type {Phaser.Scene}
         * @since 3.0.0
         */
        this.scene = scene;

        /**
         * Dynamic Bodies in this simulation.
         *
         * @name Phaser.Physics.Arcade.World#bodies
         * @type {Phaser.Structs.Set.<Phaser.Physics.Arcade.Body>}
         * @since 3.0.0
         */
        this.bodies = new Set();

        /**
         * Static Bodies in this simulation.
         *
         * @name Phaser.Physics.Arcade.World#staticBodies
         * @type {Phaser.Structs.Set.<Phaser.Physics.Arcade.StaticBody>}
         * @since 3.0.0
         */
        this.staticBodies = new Set();

        /**
         * Static Bodies marked for deletion.
         *
         * @name Phaser.Physics.Arcade.World#pendingDestroy
         * @type {Phaser.Structs.Set.<(Phaser.Physics.Arcade.Body|Phaser.Physics.Arcade.StaticBody)>}
         * @since 3.1.0
         */
        this.pendingDestroy = new Set();

        /**
         * This simulation's collision processors.
         *
         * @name Phaser.Physics.Arcade.World#colliders
         * @type {Phaser.Structs.ProcessQueue.<Phaser.Physics.Arcade.Collider>}
         * @since 3.0.0
         */
        this.colliders = new ProcessQueue();

        /**
         * Acceleration of Bodies due to gravity, in pixels per second.
         *
         * @name Phaser.Physics.Arcade.World#gravity
         * @type {Phaser.Math.Vector2}
         * @since 3.0.0
         */
        this.gravity = new Vector2(GetValue(config, 'gravity.x', 0), GetValue(config, 'gravity.y', 0));

        /**
         * A boundary constraining Bodies.
         *
         * @name Phaser.Physics.Arcade.World#bounds
         * @type {Phaser.Geom.Rectangle}
         * @since 3.0.0
         */
        this.bounds = new Rectangle(
            GetValue(config, 'x', 0),
            GetValue(config, 'y', 0),
            GetValue(config, 'width', scene.sys.scale.width),
            GetValue(config, 'height', scene.sys.scale.height)
        );

        /**
         * The boundary edges that Bodies can collide with.
         *
         * @name Phaser.Physics.Arcade.World#checkCollision
         * @type {Phaser.Types.Physics.Arcade.CheckCollisionObject}
         * @since 3.0.0
         */
        this.checkCollision = {
            up: GetValue(config, 'checkCollision.up', true),
            down: GetValue(config, 'checkCollision.down', true),
            left: GetValue(config, 'checkCollision.left', true),
            right: GetValue(config, 'checkCollision.right', true)
        };

        /**
         * The number of physics steps to be taken per second.
         *
         * This property is read-only. Use the `setFPS` method to modify it at run-time.
         *
         * @name Phaser.Physics.Arcade.World#fps
         * @readonly
         * @type {number}
         * @default 60
         * @since 3.10.0
         */
        this.fps = GetValue(config, 'fps', 60);

        /**
         * Should Physics use a fixed update time-step (true) or sync to the render fps (false)?.
         * False value of this property disables fps and timeScale properties.
         *
         * @name Phaser.Physics.Arcade.World#fixedStep
         * @type {boolean}
         * @default true
         * @since 3.23.0
         */
        this.fixedStep = GetValue(config, 'fixedStep', true);

        /**
         * The amount of elapsed ms since the last frame.
         *
         * @name Phaser.Physics.Arcade.World#_elapsed
         * @private
         * @type {number}
         * @since 3.10.0
         */
        this._elapsed = 0;

        /**
         * Internal frame time value.
         *
         * @name Phaser.Physics.Arcade.World#_frameTime
         * @private
         * @type {number}
         * @since 3.10.0
         */
        this._frameTime = 1 / this.fps;

        /**
         * Internal frame time ms value.
         *
         * @name Phaser.Physics.Arcade.World#_frameTimeMS
         * @private
         * @type {number}
         * @since 3.10.0
         */
        this._frameTimeMS = 1000 * this._frameTime;

        /**
         * The number of steps that took place in the last frame.
         *
         * @name Phaser.Physics.Arcade.World#stepsLastFrame
         * @readonly
         * @type {number}
         * @since 3.10.0
         */
        this.stepsLastFrame = 0;

        /**
         * Scaling factor applied to the frame rate.
         *
         * - 1.0 = normal speed
         * - 2.0 = half speed
         * - 0.5 = double speed
         *
         * @name Phaser.Physics.Arcade.World#timeScale
         * @type {number}
         * @default 1
         * @since 3.10.0
         */
        this.timeScale = GetValue(config, 'timeScale', 1);

        /**
         * The maximum absolute difference of a Body's per-step velocity and its overlap with another Body that will result in separation on *each axis*.
         * Larger values favor separation.
         * Smaller values favor no separation.
         *
         * @name Phaser.Physics.Arcade.World#OVERLAP_BIAS
         * @type {number}
         * @default 4
         * @since 3.0.0
         */
        this.OVERLAP_BIAS = GetValue(config, 'overlapBias', 4);

        /**
         * The maximum absolute value of a Body's overlap with a tile that will result in separation on *each axis*.
         * Larger values favor separation.
         * Smaller values favor no separation.
         * The optimum value may be similar to the tile size.
         *
         * @name Phaser.Physics.Arcade.World#TILE_BIAS
         * @type {number}
         * @default 16
         * @since 3.0.0
         */
        this.TILE_BIAS = GetValue(config, 'tileBias', 16);

        /**
         * Always separate overlapping Bodies horizontally before vertically.
         * False (the default) means Bodies are first separated on the axis of greater gravity, or the vertical axis if neither is greater.
         *
         * @name Phaser.Physics.Arcade.World#forceX
         * @type {boolean}
         * @default false
         * @since 3.0.0
         */
        this.forceX = GetValue(config, 'forceX', false);

        /**
         * Whether the simulation advances with the game loop.
         *
         * @name Phaser.Physics.Arcade.World#isPaused
         * @type {boolean}
         * @default false
         * @since 3.0.0
         */
        this.isPaused = GetValue(config, 'isPaused', false);

        /**
         * Temporary total of colliding Bodies.
         *
         * @name Phaser.Physics.Arcade.World#_total
         * @type {number}
         * @private
         * @default 0
         * @since 3.0.0
         */
        this._total = 0;

        /**
         * Enables the debug display.
         *
         * @name Phaser.Physics.Arcade.World#drawDebug
         * @type {boolean}
         * @default false
         * @since 3.0.0
         */
        this.drawDebug = GetValue(config, 'debug', false);

        /**
         * The graphics object drawing the debug display.
         *
         * @name Phaser.Physics.Arcade.World#debugGraphic
         * @type {Phaser.GameObjects.Graphics}
         * @since 3.0.0
         */
        this.debugGraphic;

        /**
         * Default debug display settings for new Bodies.
         *
         * @name Phaser.Physics.Arcade.World#defaults
         * @type {Phaser.Types.Physics.Arcade.ArcadeWorldDefaults}
         * @since 3.0.0
         */
        this.defaults = {
            debugShowBody: GetValue(config, 'debugShowBody', true),
            debugShowStaticBody: GetValue(config, 'debugShowStaticBody', true),
            debugShowVelocity: GetValue(config, 'debugShowVelocity', true),
            bodyDebugColor: GetValue(config, 'debugBodyColor', 0xff00ff),
            staticBodyDebugColor: GetValue(config, 'debugStaticBodyColor', 0x0000ff),
            velocityDebugColor: GetValue(config, 'debugVelocityColor', 0x00ff00)
        };

        /**
         * The maximum number of items per node on the RTree.
         *
         * This is ignored if `useTree` is `false`. If you have a large number of bodies in
         * your world then you may find search performance improves by increasing this value,
         * to allow more items per node and less node division.
         *
         * @name Phaser.Physics.Arcade.World#maxEntries
         * @type {number}
         * @default 16
         * @since 3.0.0
         */
        this.maxEntries = GetValue(config, 'maxEntries', 16);

        /**
         * Should this Arcade Physics World use an RTree for Dynamic bodies?
         *
         * An RTree is a fast way of spatially sorting of all the bodies in the world.
         * However, at certain limits, the cost of clearing and inserting the bodies into the
         * tree every frame becomes more expensive than the search speed gains it provides.
         *
         * If you have a large number of dynamic bodies in your world then it may be best to
         * disable the use of the RTree by setting this property to `false` in the physics config.
         *
         * The number it can cope with depends on browser and device, but a conservative estimate
         * of around 5,000 bodies should be considered the max before disabling it.
         *
         * This only applies to dynamic bodies. Static bodies are always kept in an RTree,
         * because they don't have to be cleared every frame, so you benefit from the
         * massive search speeds all the time.
         *
         * @name Phaser.Physics.Arcade.World#useTree
         * @type {boolean}
         * @default true
         * @since 3.10.0
         */
        this.useTree = GetValue(config, 'useTree', true);

        /**
         * The spatial index of Dynamic Bodies.
         *
         * @name Phaser.Physics.Arcade.World#tree
         * @type {Phaser.Structs.RTree}
         * @since 3.0.0
         */
        this.tree = new RTree(this.maxEntries);

        /**
         * The spatial index of Static Bodies.
         *
         * @name Phaser.Physics.Arcade.World#staticTree
         * @type {Phaser.Structs.RTree}
         * @since 3.0.0
         */
        this.staticTree = new RTree(this.maxEntries);

        /**
         * Recycled input for tree searches.
         *
         * @name Phaser.Physics.Arcade.World#treeMinMax
         * @type {Phaser.Types.Physics.Arcade.ArcadeWorldTreeMinMax}
         * @since 3.0.0
         */
        this.treeMinMax = { minX: 0, minY: 0, maxX: 0, maxY: 0 };

        /**
         * A temporary Transform Matrix used by bodies for calculations without them needing their own local copy.
         *
         * @name Phaser.Physics.Arcade.World#_tempMatrix
         * @type {Phaser.GameObjects.Components.TransformMatrix}
         * @private
         * @since 3.12.0
         */
        this._tempMatrix = new TransformMatrix();

        /**
         * A temporary Transform Matrix used by bodies for calculations without them needing their own local copy.
         *
         * @name Phaser.Physics.Arcade.World#_tempMatrix2
         * @type {Phaser.GameObjects.Components.TransformMatrix}
         * @private
         * @since 3.12.0
         */
        this._tempMatrix2 = new TransformMatrix();

        /**
         * The Filtering Options passed to `GetTilesWithinWorldXY` as part of the `collideSpriteVsTilemapLayer` check.
         *
         * @name Phaser.Physics.Arcade.World#tileFilterOptions
         * @type {Phaser.Types.Tilemaps.FilteringOptions}
         * @since 3.60.0
         */
        this.tileFilterOptions = { isColliding: true, isNotEmpty: true, hasInterestingFace: true };

        if (this.drawDebug)
        {
            this.createDebugGraphic();
        }
    },

    /**
     * Adds an Arcade Physics Body to a Game Object, an array of Game Objects, or the children of a Group.
     *
     * The difference between this and the `enableBody` method is that you can pass arrays or Groups
     * to this method.
     *
     * You can specify if the bodies are to be Dynamic or Static. A dynamic body can move via velocity and
     * acceleration. A static body remains fixed in place and as such is able to use an optimized search
     * tree, making it ideal for static elements such as level objects. You can still collide and overlap
     * with static bodies.
     *
     * Normally, rather than calling this method directly, you'd use the helper methods available in the
     * Arcade Physics Factory, such as:
     *
     * ```javascript
     * this.physics.add.image(x, y, textureKey);
     * this.physics.add.sprite(x, y, textureKey);
     * ```
     *
     * Calling factory methods encapsulates the creation of a Game Object and the creation of its
     * body at the same time. If you are creating custom classes then you can pass them to this
     * method to have their bodies created.
     *
     * @method Phaser.Physics.Arcade.World#enable
     * @since 3.0.0
     *
     * @param {(Phaser.GameObjects.GameObject|Phaser.GameObjects.GameObject[]|Phaser.GameObjects.Group|Phaser.GameObjects.Group[])} object - The object, or objects, on which to create the bodies.
     * @param {number} [bodyType] - The type of Body to create. Either `DYNAMIC_BODY` or `STATIC_BODY`.
     */
    enable: function (object, bodyType)
    {
        if (bodyType === undefined) { bodyType = CONST.DYNAMIC_BODY; }

        if (!Array.isArray(object))
        {
            object = [ object ];
        }

        for (var i = 0; i < object.length; i++)
        {
            var entry = object[i];

            if (entry.isParent)
            {
                var children = entry.getChildren();

                for (var c = 0; c < children.length; c++)
                {
                    var child = children[c];

                    if (child.isParent)
                    {
                        //  Handle Groups nested inside of Groups
                        this.enable(child, bodyType);
                    }
                    else
                    {
                        this.enableBody(child, bodyType);
                    }
                }
            }
            else
            {
                this.enableBody(entry, bodyType);
            }
        }
    },

    /**
     * Creates an Arcade Physics Body on a single Game Object.
     *
     * If the Game Object already has a body, this method will simply add it back into the simulation.
     *
     * You can specify if the body is Dynamic or Static. A dynamic body can move via velocity and
     * acceleration. A static body remains fixed in place and as such is able to use an optimized search
     * tree, making it ideal for static elements such as level objects. You can still collide and overlap
     * with static bodies.
     *
     * Normally, rather than calling this method directly, you'd use the helper methods available in the
     * Arcade Physics Factory, such as:
     *
     * ```javascript
     * this.physics.add.image(x, y, textureKey);
     * this.physics.add.sprite(x, y, textureKey);
     * ```
     *
     * Calling factory methods encapsulates the creation of a Game Object and the creation of its
     * body at the same time. If you are creating custom classes then you can pass them to this
     * method to have their bodies created.
     *
     * @method Phaser.Physics.Arcade.World#enableBody
     * @since 3.0.0
     *
     * @param {Phaser.GameObjects.GameObject} object - The Game Object on which to create the body.
     * @param {number} [bodyType] - The type of Body to create. Either `DYNAMIC_BODY` or `STATIC_BODY`.
     *
     * @return {Phaser.GameObjects.GameObject} The Game Object on which the body was created.
     */
    enableBody: function (object, bodyType)
    {
        if (bodyType === undefined) { bodyType = CONST.DYNAMIC_BODY; }

        if (object.hasTransformComponent)
        {
            if (!object.body)
            {
                if (bodyType === CONST.DYNAMIC_BODY)
                {
                    object.body = new Body(this, object);
                }
                else if (bodyType === CONST.STATIC_BODY)
                {
                    object.body = new StaticBody(this, object);
                }
            }

            this.add(object.body);
        }

        return object;
    },

    /**
     * Adds an existing Arcade Physics Body or StaticBody to the simulation.
     *
     * The body is enabled and added to the local search trees.
     *
     * @method Phaser.Physics.Arcade.World#add
     * @since 3.10.0
     *
     * @param {(Phaser.Physics.Arcade.Body|Phaser.Physics.Arcade.StaticBody)} body - The Body to be added to the simulation.
     *
     * @return {(Phaser.Physics.Arcade.Body|Phaser.Physics.Arcade.StaticBody)} The Body that was added to the simulation.
     */
    add: function (body)
    {
        if (body.physicsType === CONST.DYNAMIC_BODY)
        {
            this.bodies.set(body);
        }
        else if (body.physicsType === CONST.STATIC_BODY)
        {
            this.staticBodies.set(body);

            this.staticTree.insert(body);
        }

        body.enable = true;

        return body;
    },

    /**
     * Disables the Arcade Physics Body of a Game Object, an array of Game Objects, or the children of a Group.
     *
     * The difference between this and the `disableBody` method is that you can pass arrays or Groups
     * to this method.
     *
     * The body itself is not deleted, it just has its `enable` property set to false, which
     * means you can re-enable it again at any point by passing it to enable `World.enable` or `World.add`.
     *
     * @method Phaser.Physics.Arcade.World#disable
     * @since 3.0.0
     *
     * @param {(Phaser.GameObjects.GameObject|Phaser.GameObjects.GameObject[]|Phaser.GameObjects.Group|Phaser.GameObjects.Group[])} object - The object, or objects, on which to disable the bodies.
     */
    disable: function (object)
    {
        if (!Array.isArray(object))
        {
            object = [ object ];
        }

        for (var i = 0; i < object.length; i++)
        {
            var entry = object[i];

            if (entry.isParent)
            {
                var children = entry.getChildren();

                for (var c = 0; c < children.length; c++)
                {
                    var child = children[c];

                    if (child.isParent)
                    {
                        //  Handle Groups nested inside of Groups
                        this.disable(child);
                    }
                    else
                    {
                        this.disableBody(child.body);
                    }
                }
            }
            else
            {
                this.disableBody(entry.body);
            }
        }
    },

    /**
     * Disables an existing Arcade Physics Body or StaticBody and removes it from the simulation.
     *
     * The body is disabled and removed from the local search trees.
     *
     * The body itself is not deleted, it just has its `enable` property set to false, which
     * means you can re-enable it again at any point by passing it to enable `World.enable` or `World.add`.
     *
     * @method Phaser.Physics.Arcade.World#disableBody
     * @since 3.0.0
     *
     * @param {(Phaser.Physics.Arcade.Body|Phaser.Physics.Arcade.StaticBody)} body - The Body to be disabled.
     */
    disableBody: function (body)
    {
        this.remove(body);

        body.enable = false;
    },

    /**
     * Removes an existing Arcade Physics Body or StaticBody from the simulation.
     *
     * The body is disabled and removed from the local search trees.
     *
     * The body itself is not deleted, it just has its `enabled` property set to false, which
     * means you can re-enable it again at any point by passing it to enable `enable` or `add`.
     *
     * @method Phaser.Physics.Arcade.World#remove
     * @since 3.0.0
     *
     * @param {(Phaser.Physics.Arcade.Body|Phaser.Physics.Arcade.StaticBody)} body - The body to be removed from the simulation.
     */
    remove: function (body)
    {
        if (body.physicsType === CONST.DYNAMIC_BODY)
        {
            this.tree.remove(body);
            this.bodies.delete(body);
        }
        else if (body.physicsType === CONST.STATIC_BODY)
        {
            this.staticBodies.delete(body);
            this.staticTree.remove(body);
        }
    },

    /**
     * Creates a Graphics Game Object that the world will use to render the debug display to.
     *
     * This is called automatically when the World is instantiated if the `debug` config property
     * was set to `true`. However, you can call it at any point should you need to display the
     * debug Graphic from a fixed point.
     *
     * You can control which objects are drawn to the Graphics object, and the colors they use,
     * by setting the debug properties in the physics config.
     *
     * You should not typically use this in a production game. Use it to aid during debugging.
     *
     * @method Phaser.Physics.Arcade.World#createDebugGraphic
     * @since 3.0.0
     *
     * @return {Phaser.GameObjects.Graphics} The Graphics object that was created for use by the World.
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
     * Sets the position, size and properties of the World boundary.
     *
     * The World boundary is an invisible rectangle that defines the edges of the World.
     * If a Body is set to collide with the world bounds then it will automatically stop
     * when it reaches any of the edges. You can optionally set which edges of the boundary
     * should be checked against.
     *
     * @method Phaser.Physics.Arcade.World#setBounds
     * @since 3.0.0
     *
     * @param {number} x - The top-left x coordinate of the boundary.
     * @param {number} y - The top-left y coordinate of the boundary.
     * @param {number} width - The width of the boundary.
     * @param {number} height - The height of the boundary.
     * @param {boolean} [checkLeft] - Should bodies check against the left edge of the boundary?
     * @param {boolean} [checkRight] - Should bodies check against the right edge of the boundary?
     * @param {boolean} [checkUp] - Should bodies check against the top edge of the boundary?
     * @param {boolean} [checkDown] - Should bodies check against the bottom edge of the boundary?
     *
     * @return {Phaser.Physics.Arcade.World} This World object.
     */
    setBounds: function (x, y, width, height, checkLeft, checkRight, checkUp, checkDown)
    {
        this.bounds.setTo(x, y, width, height);

        if (checkLeft !== undefined)
        {
            this.setBoundsCollision(checkLeft, checkRight, checkUp, checkDown);
        }

        return this;
    },

    /**
     * Enables or disables collisions on each edge of the World boundary.
     *
     * @method Phaser.Physics.Arcade.World#setBoundsCollision
     * @since 3.0.0
     *
     * @param {boolean} [left=true] - Should bodies check against the left edge of the boundary?
     * @param {boolean} [right=true] - Should bodies check against the right edge of the boundary?
     * @param {boolean} [up=true] - Should bodies check against the top edge of the boundary?
     * @param {boolean} [down=true] - Should bodies check against the bottom edge of the boundary?
     *
     * @return {Phaser.Physics.Arcade.World} This World object.
     */
    setBoundsCollision: function (left, right, up, down)
    {
        if (left === undefined) { left = true; }
        if (right === undefined) { right = true; }
        if (up === undefined) { up = true; }
        if (down === undefined) { down = true; }

        this.checkCollision.left = left;
        this.checkCollision.right = right;
        this.checkCollision.up = up;
        this.checkCollision.down = down;

        return this;
    },

    /**
     * Pauses the simulation.
     *
     * A paused simulation does not update any existing bodies, or run any Colliders.
     *
     * However, you can still enable and disable bodies within it, or manually run collide or overlap
     * checks.
     *
     * @method Phaser.Physics.Arcade.World#pause
     * @fires Phaser.Physics.Arcade.Events#PAUSE
     * @since 3.0.0
     *
     * @return {Phaser.Physics.Arcade.World} This World object.
     */
    pause: function ()
    {
        this.isPaused = true;

        this.emit(Events.PAUSE);

        return this;
    },

    /**
     * Resumes the simulation, if paused.
     *
     * @method Phaser.Physics.Arcade.World#resume
     * @fires Phaser.Physics.Arcade.Events#RESUME
     * @since 3.0.0
     *
     * @return {Phaser.Physics.Arcade.World} This World object.
     */
    resume: function ()
    {
        this.isPaused = false;

        this.emit(Events.RESUME);

        return this;
    },

    /**
     * Creates a new Collider object and adds it to the simulation.
     *
     * A Collider is a way to automatically perform collision checks between two objects,
     * calling the collide and process callbacks if they occur.
     *
     * Colliders are run as part of the World update, after all of the Bodies have updated.
     *
     * By creating a Collider you don't need then call `World.collide` in your `update` loop,
     * as it will be handled for you automatically.
     *
     * @method Phaser.Physics.Arcade.World#addCollider
     * @since 3.0.0
     * @see Phaser.Physics.Arcade.World#collide
     *
     * @param {Phaser.Types.Physics.Arcade.ArcadeColliderType} object1 - The first object to check for collision.
     * @param {Phaser.Types.Physics.Arcade.ArcadeColliderType} object2 - The second object to check for collision.
     * @param {Phaser.Types.Physics.Arcade.ArcadePhysicsCallback} [collideCallback] - The callback to invoke when the two objects collide.
     * @param {Phaser.Types.Physics.Arcade.ArcadePhysicsCallback} [processCallback] - The callback to invoke when the two objects collide. Must return a boolean.
     * @param {*} [callbackContext] - The scope in which to call the callbacks.
     *
     * @return {Phaser.Physics.Arcade.Collider} The Collider that was created.
     */
    addCollider: function (object1, object2, collideCallback, processCallback, callbackContext)
    {
        if (collideCallback === undefined) { collideCallback = null; }
        if (processCallback === undefined) { processCallback = null; }
        if (callbackContext === undefined) { callbackContext = collideCallback; }

        var collider = new Collider(this, false, object1, object2, collideCallback, processCallback, callbackContext);

        this.colliders.add(collider);

        return collider;
    },

    /**
     * Creates a new Overlap Collider object and adds it to the simulation.
     *
     * A Collider is a way to automatically perform overlap checks between two objects,
     * calling the collide and process callbacks if they occur.
     *
     * Colliders are run as part of the World update, after all of the Bodies have updated.
     *
     * By creating a Collider you don't need then call `World.overlap` in your `update` loop,
     * as it will be handled for you automatically.
     *
     * @method Phaser.Physics.Arcade.World#addOverlap
     * @since 3.0.0
     *
     * @param {Phaser.Types.Physics.Arcade.ArcadeColliderType} object1 - The first object to check for overlap.
     * @param {Phaser.Types.Physics.Arcade.ArcadeColliderType} object2 - The second object to check for overlap.
     * @param {Phaser.Types.Physics.Arcade.ArcadePhysicsCallback} [collideCallback] - The callback to invoke when the two objects overlap.
     * @param {Phaser.Types.Physics.Arcade.ArcadePhysicsCallback} [processCallback] - The callback to invoke when the two objects overlap. Must return a boolean.
     * @param {*} [callbackContext] - The scope in which to call the callbacks.
     *
     * @return {Phaser.Physics.Arcade.Collider} The Collider that was created.
     */
    addOverlap: function (object1, object2, collideCallback, processCallback, callbackContext)
    {
        if (collideCallback === undefined) { collideCallback = null; }
        if (processCallback === undefined) { processCallback = null; }
        if (callbackContext === undefined) { callbackContext = collideCallback; }

        var collider = new Collider(this, true, object1, object2, collideCallback, processCallback, callbackContext);

        this.colliders.add(collider);

        return collider;
    },

    /**
     * Removes a Collider from the simulation so it is no longer processed.
     *
     * This method does not destroy the Collider. If you wish to add it back at a later stage you can call
     * `World.colliders.add(Collider)`.
     *
     * If you no longer need the Collider you can call the `Collider.destroy` method instead, which will
     * automatically clear all of its references and then remove it from the World. If you call destroy on
     * a Collider you _don't_ need to pass it to this method too.
     *
     * @method Phaser.Physics.Arcade.World#removeCollider
     * @since 3.0.0
     *
     * @param {Phaser.Physics.Arcade.Collider} collider - The Collider to remove from the simulation.
     *
     * @return {Phaser.Physics.Arcade.World} This World object.
     */
    removeCollider: function (collider)
    {
        this.colliders.remove(collider);

        return this;
    },

    /**
     * Sets the frame rate to run the simulation at.
     *
     * The frame rate value is used to simulate a fixed update time step. This fixed
     * time step allows for a straightforward implementation of a deterministic game state.
     *
     * This frame rate is independent of the frequency at which the game is rendering. The
     * higher you set the fps, the more physics simulation steps will occur per game step.
     * Conversely, the lower you set it, the less will take place.
     *
     * You can optionally advance the simulation directly yourself by calling the `step` method.
     *
     * @method Phaser.Physics.Arcade.World#setFPS
     * @since 3.10.0
     *
     * @param {number} framerate - The frame rate to advance the simulation at.
     *
     * @return {this} This World object.
     */
    setFPS: function (framerate)
    {
        this.fps = framerate;
        this._frameTime = 1 / this.fps;
        this._frameTimeMS = 1000 * this._frameTime;

        return this;
    },

    /**
     * Advances the simulation based on the elapsed time and fps rate.
     *
     * This is called automatically by your Scene and does not need to be invoked directly.
     *
     * @method Phaser.Physics.Arcade.World#update
     * @fires Phaser.Physics.Arcade.Events#WORLD_STEP
     * @since 3.0.0
     *
     * @param {number} time - The current timestamp as generated by the Request Animation Frame or SetTimeout.
     * @param {number} delta - The delta time, in ms, elapsed since the last frame.
     */
    update: function (time, delta)
    {
        if (this.isPaused || this.bodies.size === 0)
        {
            return;
        }

        var i;
        var fixedDelta = this._frameTime;
        var msPerFrame = this._frameTimeMS * this.timeScale;

        this._elapsed += delta;

        //  Update all active bodies
        var body;
        var bodies = this.bodies.entries;

        //  Will a step happen this frame?
        var willStep = (this._elapsed >= msPerFrame);

        if (!this.fixedStep)
        {
            fixedDelta = delta * 0.001;
            willStep = true;
            this._elapsed = 0;
        }

        for (i = 0; i < bodies.length; i++)
        {
            body = bodies[i];

            if (body.enable)
            {
                body.preUpdate(willStep, fixedDelta);
            }
        }

        //  We know that a step will happen this frame, so let's bundle it all together to save branching and iteration costs
        if (willStep)
        {
            this._elapsed -= msPerFrame;
            this.stepsLastFrame = 1;

            //  Optionally populate our dynamic collision tree
            if (this.useTree)
            {
                this.tree.clear();
                this.tree.load(bodies);
            }

            //  Process any colliders
            var colliders = this.colliders.update();

            for (i = 0; i < colliders.length; i++)
            {
                var collider = colliders[i];

                if (collider.active)
                {
                    collider.update();
                }
            }

            this.emit(Events.WORLD_STEP, fixedDelta);
        }

        //  Process any additional steps this frame
        while (this._elapsed >= msPerFrame)
        {
            this._elapsed -= msPerFrame;

            this.step(fixedDelta);
        }
    },

    /**
     * Advances the simulation by a time increment.
     *
     * @method Phaser.Physics.Arcade.World#step
     * @fires Phaser.Physics.Arcade.Events#WORLD_STEP
     * @since 3.10.0
     *
     * @param {number} delta - The delta time amount, in seconds, by which to advance the simulation.
     */
    step: function (delta)
    {
        //  Update all active bodies
        var i;
        var body;
        var bodies = this.bodies.entries;
        var len = bodies.length;

        for (i = 0; i < len; i++)
        {
            body = bodies[i];

            if (body.enable)
            {
                body.update(delta);
            }
        }

        //  Optionally populate our dynamic collision tree
        if (this.useTree)
        {
            this.tree.clear();
            this.tree.load(bodies);
        }

        //  Process any colliders
        var colliders = this.colliders.update();

        for (i = 0; i < colliders.length; i++)
        {
            var collider = colliders[i];

            if (collider.active)
            {
                collider.update();
            }
        }

        this.emit(Events.WORLD_STEP, delta);

        this.stepsLastFrame++;
    },

    /**
     * Advances the simulation by a single step.
     *
     * @method Phaser.Physics.Arcade.World#singleStep
     * @fires Phaser.Physics.Arcade.Events#WORLD_STEP
     * @since 3.70.0
     */
    singleStep: function ()
    {
        this.update(0, this._frameTimeMS);

        this.postUpdate();
    },

    /**
     * Updates bodies, draws the debug display, and handles pending queue operations.
     *
     * @method Phaser.Physics.Arcade.World#postUpdate
     * @since 3.0.0
     */
    postUpdate: function ()
    {
        var i;
        var body;
        var bodies = this.bodies.entries;
        var len = bodies.length;

        var dynamic = this.bodies;
        var staticBodies = this.staticBodies;

        //  We don't need to postUpdate if there wasn't a step this frame
        if (this.stepsLastFrame)
        {
            this.stepsLastFrame = 0;

            for (i = 0; i < len; i++)
            {
                body = bodies[i];

                if (body.enable)
                {
                    body.postUpdate();
                }
            }
        }

        if (this.drawDebug)
        {
            var graphics = this.debugGraphic;

            graphics.clear();

            for (i = 0; i < len; i++)
            {
                body = bodies[i];

                if (body.willDrawDebug())
                {
                    body.drawDebug(graphics);
                }
            }

            bodies = staticBodies.entries;
            len = bodies.length;

            for (i = 0; i < len; i++)
            {
                body = bodies[i];

                if (body.willDrawDebug())
                {
                    body.drawDebug(graphics);
                }
            }
        }

        var pending = this.pendingDestroy;

        if (pending.size > 0)
        {
            var dynamicTree = this.tree;
            var staticTree = this.staticTree;

            bodies = pending.entries;
            len = bodies.length;

            for (i = 0; i < len; i++)
            {
                body = bodies[i];

                if (body.physicsType === CONST.DYNAMIC_BODY)
                {
                    dynamicTree.remove(body);
                    dynamic.delete(body);
                }
                else if (body.physicsType === CONST.STATIC_BODY)
                {
                    staticTree.remove(body);
                    staticBodies.delete(body);
                }

                body.world = undefined;
                body.gameObject = undefined;
            }

            pending.clear();
        }
    },

    /**
     * Calculates a Body's velocity and updates its position.
     *
     * @method Phaser.Physics.Arcade.World#updateMotion
     * @since 3.0.0
     *
     * @param {Phaser.Physics.Arcade.Body} body - The Body to be updated.
     * @param {number} delta - The delta value to be used in the motion calculations, in seconds.
     */
    updateMotion: function (body, delta)
    {
        if (body.allowRotation)
        {
            this.computeAngularVelocity(body, delta);
        }

        this.computeVelocity(body, delta);
    },

    /**
     * Calculates a Body's angular velocity.
     *
     * @method Phaser.Physics.Arcade.World#computeAngularVelocity
     * @since 3.10.0
     *
     * @param {Phaser.Physics.Arcade.Body} body - The Body to compute the velocity for.
     * @param {number} delta - The delta value to be used in the calculation, in seconds.
     */
    computeAngularVelocity: function (body, delta)
    {
        var velocity = body.angularVelocity;
        var acceleration = body.angularAcceleration;
        var drag = body.angularDrag;
        var max = body.maxAngular;

        if (acceleration)
        {
            velocity += acceleration * delta;
        }
        else if (body.allowDrag && drag)
        {
            drag *= delta;

            if (FuzzyGreaterThan(velocity - drag, 0, 0.1))
            {
                velocity -= drag;
            }
            else if (FuzzyLessThan(velocity + drag, 0, 0.1))
            {
                velocity += drag;
            }
            else
            {
                velocity = 0;
            }
        }

        velocity = Clamp(velocity, -max, max);

        var velocityDelta = velocity - body.angularVelocity;

        body.angularVelocity += velocityDelta;
        body.rotation += (body.angularVelocity * delta);
    },

    /**
     * Calculates a Body's per-axis velocity.
     *
     * @method Phaser.Physics.Arcade.World#computeVelocity
     * @since 3.0.0
     *
     * @param {Phaser.Physics.Arcade.Body} body - The Body to compute the velocity for.
     * @param {number} delta - The delta value to be used in the calculation, in seconds.
     */
    computeVelocity: function (body, delta)
    {
        var velocityX = body.velocity.x;
        var accelerationX = body.acceleration.x;
        var dragX = body.drag.x;
        var maxX = body.maxVelocity.x;

        var velocityY = body.velocity.y;
        var accelerationY = body.acceleration.y;
        var dragY = body.drag.y;
        var maxY = body.maxVelocity.y;

        var speed = body.speed;
        var maxSpeed = body.maxSpeed;
        var allowDrag = body.allowDrag;
        var useDamping = body.useDamping;

        if (body.allowGravity)
        {
            velocityX += (this.gravity.x + body.gravity.x) * delta;
            velocityY += (this.gravity.y + body.gravity.y) * delta;
        }

        if (accelerationX)
        {
            velocityX += accelerationX * delta;
        }
        else if (allowDrag && dragX)
        {
            if (useDamping)
            {
                //  Damping based deceleration
                dragX = Math.pow(dragX, delta);

                velocityX *= dragX;

                speed = Math.sqrt(velocityX * velocityX + velocityY * velocityY);

                if (FuzzyEqual(speed, 0, 0.001))
                {
                    velocityX = 0;
                }
            }
            else
            {
                //  Linear deceleration
                dragX *= delta;

                if (FuzzyGreaterThan(velocityX - dragX, 0, 0.01))
                {
                    velocityX -= dragX;
                }
                else if (FuzzyLessThan(velocityX + dragX, 0, 0.01))
                {
                    velocityX += dragX;
                }
                else
                {
                    velocityX = 0;
                }
            }
        }

        if (accelerationY)
        {
            velocityY += accelerationY * delta;
        }
        else if (allowDrag && dragY)
        {
            if (useDamping)
            {
                //  Damping based deceleration
                dragY = Math.pow(dragY, delta);

                velocityY *= dragY;

                speed = Math.sqrt(velocityX * velocityX + velocityY * velocityY);

                if (FuzzyEqual(speed, 0, 0.001))
                {
                    velocityY = 0;
                }
            }
            else
            {
                //  Linear deceleration
                dragY *= delta;

                if (FuzzyGreaterThan(velocityY - dragY, 0, 0.01))
                {
                    velocityY -= dragY;
                }
                else if (FuzzyLessThan(velocityY + dragY, 0, 0.01))
                {
                    velocityY += dragY;
                }
                else
                {
                    velocityY = 0;
                }
            }
        }

        velocityX = Clamp(velocityX, -maxX, maxX);
        velocityY = Clamp(velocityY, -maxY, maxY);

        body.velocity.set(velocityX, velocityY);

        if (maxSpeed > -1 && body.velocity.length() > maxSpeed)
        {
            body.velocity.normalize().scale(maxSpeed);
            speed = maxSpeed;
        }

        body.speed = speed;
    },

    /**
     * Separates two Bodies.
     *
     * @method Phaser.Physics.Arcade.World#separate
     * @fires Phaser.Physics.Arcade.Events#COLLIDE
     * @fires Phaser.Physics.Arcade.Events#OVERLAP
     * @since 3.0.0
     *
     * @param {Phaser.Physics.Arcade.Body} body1 - The first Body to be separated.
     * @param {Phaser.Physics.Arcade.Body} body2 - The second Body to be separated.
     * @param {Phaser.Types.Physics.Arcade.ArcadePhysicsCallback} [processCallback] - The process callback.
     * @param {*} [callbackContext] - The context in which to invoke the callback.
     * @param {boolean} [overlapOnly] - If this a collide or overlap check?
     *
     * @return {boolean} True if separation occurred, otherwise false.
     */
    separate: function (body1, body2, processCallback, callbackContext, overlapOnly)
    {
        var overlapX;
        var overlapY;

        var result = false;
        var runSeparation = true;

        if (
            !body1.enable ||
            !body2.enable ||
            body1.checkCollision.none ||
            body2.checkCollision.none ||
            !this.intersects(body1, body2))
        {
            return result;
        }

        //  They overlap. Is there a custom process callback? If it returns true then we can carry on, otherwise we should abort.
        if (processCallback && processCallback.call(callbackContext, body1.gameObject, body2.gameObject) === false)
        {
            return result;
        }

        //  Circle vs. Circle, or Circle vs. Rect
        if (body1.isCircle || body2.isCircle)
        {
            var circleResults = this.separateCircle(body1, body2, overlapOnly);

            if (circleResults.result)
            {
                //  We got a satisfactory result from the separateCircle method
                result = true;
                runSeparation = false;
            }
            else
            {
                //  Further processing required
                overlapX = circleResults.x;
                overlapY = circleResults.y;
                runSeparation = true;
            }
        }

        if (runSeparation)
        {
            var resultX = false;
            var resultY = false;
            var bias = this.OVERLAP_BIAS;

            //  Do we separate on x first or y first or both?
            if (overlapOnly)
            {
                //  No separation but we need to calculate overlapX, overlapY, etc.
                resultX = SeparateX(body1, body2, overlapOnly, bias, overlapX);
                resultY = SeparateY(body1, body2, overlapOnly, bias, overlapY);
            }
            else if (this.forceX || Math.abs(this.gravity.y + body1.gravity.y) < Math.abs(this.gravity.x + body1.gravity.x))
            {
                resultX = SeparateX(body1, body2, overlapOnly, bias, overlapX);

                //  Are they still intersecting? Let's do the other axis then
                if (this.intersects(body1, body2))
                {
                    resultY = SeparateY(body1, body2, overlapOnly, bias, overlapY);
                }
            }
            else
            {
                resultY = SeparateY(body1, body2, overlapOnly, bias, overlapY);

                //  Are they still intersecting? Let's do the other axis then
                if (this.intersects(body1, body2))
                {
                    resultX = SeparateX(body1, body2, overlapOnly, bias, overlapX);
                }
            }

            result = (resultX || resultY);
        }

        if (result)
        {
            if (overlapOnly)
            {
                if (body1.onOverlap || body2.onOverlap)
                {
                    this.emit(Events.OVERLAP, body1.gameObject, body2.gameObject, body1, body2);
                }
            }
            else if (body1.onCollide || body2.onCollide)
            {
                this.emit(Events.COLLIDE, body1.gameObject, body2.gameObject, body1, body2);
            }
        }

        return result;
    },

    /**
     * Separates two Bodies, when both are circular.
     *
     * @method Phaser.Physics.Arcade.World#separateCircle
     * @fires Phaser.Physics.Arcade.Events#COLLIDE
     * @fires Phaser.Physics.Arcade.Events#OVERLAP
     * @since 3.0.0
     *
     * @param {Phaser.Physics.Arcade.Body} body1 - The first Body to be separated.
     * @param {Phaser.Physics.Arcade.Body} body2 - The second Body to be separated.
     * @param {boolean} [overlapOnly] - If this a collide or overlap check?
     *
     * @return {boolean} True if separation occurred, otherwise false.
     */
    separateCircle: function (body1, body2, overlapOnly)
    {
        //  Set the AABB overlap, blocked and touching values into the bodies (we don't use the return values here)
        GetOverlapX(body1, body2, false, 0);
        GetOverlapY(body1, body2, false, 0);

        var body1IsCircle = body1.isCircle;
        var body2IsCircle = body2.isCircle;
        var body1Center = body1.center;
        var body2Center = body2.center;
        var body1Immovable = body1.immovable;
        var body2Immovable = body2.immovable;
        var body1Velocity = body1.velocity;
        var body2Velocity = body2.velocity;

        var overlap = 0;
        var twoCircles = true;

        if (body1IsCircle !== body2IsCircle)
        {
            twoCircles = false;

            var circleX = body1Center.x;
            var circleY = body1Center.y;
            var circleRadius = body1.halfWidth;

            var rectX = body2.position.x;
            var rectY = body2.position.y;
            var rectRight = body2.right;
            var rectBottom = body2.bottom;

            if (body2IsCircle)
            {
                circleX = body2Center.x;
                circleY = body2Center.y;
                circleRadius = body2.halfWidth;

                rectX = body1.position.x;
                rectY = body1.position.y;
                rectRight = body1.right;
                rectBottom = body1.bottom;
            }

            if (circleY < rectY)
            {
                if (circleX < rectX)
                {
                    overlap = DistanceBetween(circleX, circleY, rectX, rectY) - circleRadius;
                }
                else if (circleX > rectRight)
                {
                    overlap = DistanceBetween(circleX, circleY, rectRight, rectY) - circleRadius;
                }
            }
            else if (circleY > rectBottom)
            {
                if (circleX < rectX)
                {
                    overlap = DistanceBetween(circleX, circleY, rectX, rectBottom) - circleRadius;
                }
                else if (circleX > rectRight)
                {
                    overlap = DistanceBetween(circleX, circleY, rectRight, rectBottom) - circleRadius;
                }
            }

            //  If a collision occurs in the corner points of the rectangle
            //  then the bodies behave like circles
            overlap *= -1;
        }
        else
        {
            overlap = (body1.halfWidth + body2.halfWidth) - DistanceBetweenPoints(body1Center, body2Center);
        }

        body1.overlapR = overlap;
        body2.overlapR = overlap;

        var angle = AngleBetweenPoints(body1Center, body2Center);
        var overlapX = (overlap + MATH_CONST.EPSILON) * Math.cos(angle);
        var overlapY = (overlap + MATH_CONST.EPSILON) * Math.sin(angle);

        var results = { overlap: overlap, result: false, x: overlapX, y: overlapY };

        //  We know the AABBs already intersect before we enter this method
        if (overlapOnly && (!twoCircles || (twoCircles && overlap !== 0)))
        {
            //  Now we know the rect vs circle overlaps, or two circles do
            results.result = true;

            return results;
        }

        //  Can't separate (in this method):
        //  Two immovable bodies
        //  A body with its own custom separation logic
        //  A circle vs. a rect with a face-on collision
        if ((!twoCircles && overlap === 0) || (body1Immovable && body2Immovable) || body1.customSeparateX || body2.customSeparateX)
        {
            //  Let SeparateX / SeparateY handle this
            results.x = undefined;
            results.y = undefined;

            return results;
        }

        //  If we get this far we either have circle vs. circle
        //  or circle vs. rect with corner collision

        var deadlock = (!body1.pushable && !body2.pushable);

        if (twoCircles)
        {
            var dx = body1Center.x - body2Center.x;
            var dy = body1Center.y - body2Center.y;
            var d = Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2));
            var nx = ((body2Center.x - body1Center.x) / d) || 0;
            var ny = ((body2Center.y - body1Center.y) / d) || 0;
            var p = 2 * (body1Velocity.x * nx + body1Velocity.y * ny - body2Velocity.x * nx - body2Velocity.y * ny) / (body1.mass + body2.mass);

            if (body1Immovable || body2Immovable)
            {
                p *= 2;
            }

            if (!body1Immovable)
            {
                body1Velocity.x = (body1Velocity.x - p / body1.mass * nx);
                body1Velocity.y = (body1Velocity.y - p / body1.mass * ny);
                body1Velocity.multiply(body1.bounce);
            }

            if (!body2Immovable)
            {
                body2Velocity.x = (body2Velocity.x + p / body2.mass * nx);
                body2Velocity.y = (body2Velocity.y + p / body2.mass * ny);
                body2Velocity.multiply(body2.bounce);
            }

            if (!body1Immovable && !body2Immovable)
            {
                overlapX *= 0.5;
                overlapY *= 0.5;
            }

            if (!body1Immovable)
            {
                body1.x -= overlapX;
                body1.y -= overlapY;

                body1.updateCenter();
            }

            if (!body2Immovable)
            {
                body2.x += overlapX;
                body2.y += overlapY;

                body2.updateCenter();
            }

            results.result = true;
        }
        else
        {
            //  Circle vs. Rect
            //  We'll only move the circle (if we can) and let
            //  the runSeparation handle the rectangle

            if (!body1Immovable || body1.pushable || deadlock)
            {
                body1.x -= overlapX;
                body1.y -= overlapY;

                body1.updateCenter();
            }
            else if (!body2Immovable || body2.pushable || deadlock)
            {
                body2.x += overlapX;
                body2.y += overlapY;

                body2.updateCenter();
            }

            //  Let SeparateX / SeparateY handle this further
            results.x = undefined;
            results.y = undefined;
        }

        return results;
    },

    /**
     * Checks to see if two Bodies intersect at all.
     *
     * @method Phaser.Physics.Arcade.World#intersects
     * @since 3.0.0
     *
     * @param {Phaser.Physics.Arcade.Body} body1 - The first body to check.
     * @param {Phaser.Physics.Arcade.Body} body2 - The second body to check.
     *
     * @return {boolean} True if the two bodies intersect, otherwise false.
     */
    intersects: function (body1, body2)
    {
        if (body1 === body2)
        {
            return false;
        }

        if (!body1.isCircle && !body2.isCircle)
        {
            //  Rect vs. Rect
            return !(
                body1.right <= body2.left ||
                body1.bottom <= body2.top ||
                body1.left >= body2.right ||
                body1.top >= body2.bottom
            );
        }
        else if (body1.isCircle)
        {
            if (body2.isCircle)
            {
                //  Circle vs. Circle
                return DistanceBetweenPoints(body1.center, body2.center) <= (body1.halfWidth + body2.halfWidth);
            }
            else
            {
                //  Circle vs. Rect
                return this.circleBodyIntersects(body1, body2);
            }
        }
        else
        {
            //  Rect vs. Circle
            return this.circleBodyIntersects(body2, body1);
        }
    },

    /**
     * Tests if a circular Body intersects with another Body.
     *
     * @method Phaser.Physics.Arcade.World#circleBodyIntersects
     * @since 3.0.0
     *
     * @param {Phaser.Physics.Arcade.Body} circle - The circular body to test.
     * @param {Phaser.Physics.Arcade.Body} body - The rectangular body to test.
     *
     * @return {boolean} True if the two bodies intersect, otherwise false.
     */
    circleBodyIntersects: function (circle, body)
    {
        var x = Clamp(circle.center.x, body.left, body.right);
        var y = Clamp(circle.center.y, body.top, body.bottom);

        var dx = (circle.center.x - x) * (circle.center.x - x);
        var dy = (circle.center.y - y) * (circle.center.y - y);

        return (dx + dy) <= (circle.halfWidth * circle.halfWidth);
    },

    /**
     * Tests if Game Objects overlap.
     *
     * See details in {@link Phaser.Physics.Arcade.World#collide}.
     *
     * @method Phaser.Physics.Arcade.World#overlap
     * @since 3.0.0
     *
     * @param {Phaser.Types.Physics.Arcade.ArcadeColliderType} object1 - The first object or array of objects to check.
     * @param {Phaser.Types.Physics.Arcade.ArcadeColliderType} [object2] - The second object or array of objects to check, or `undefined`.
     * @param {Phaser.Types.Physics.Arcade.ArcadePhysicsCallback} [overlapCallback] - An optional callback function that is called if the objects overlap.
     * @param {Phaser.Types.Physics.Arcade.ArcadePhysicsCallback} [processCallback] - An optional callback function that lets you perform additional checks against the two objects if they overlap. If this is set then `overlapCallback` will only be called if this callback returns `true`.
     * @param {*} [callbackContext] - The context in which to run the callbacks.
     *
     * @return {boolean} True if at least one Game Object overlaps another.
     *
     * @see Phaser.Physics.Arcade.World#collide
     */
    overlap: function (object1, object2, overlapCallback, processCallback, callbackContext)
    {
        if (overlapCallback === undefined) { overlapCallback = null; }
        if (processCallback === undefined) { processCallback = null; }
        if (callbackContext === undefined) { callbackContext = overlapCallback; }

        return this.collideObjects(object1, object2, overlapCallback, processCallback, callbackContext, true);
    },

    /**
     * Performs a collision check and separation between the two physics enabled objects given, which can be single
     * Game Objects, arrays of Game Objects, Physics Groups, arrays of Physics Groups or normal Groups.
     *
     * If you don't require separation then use {@link Phaser.Physics.Arcade.World#overlap} instead.
     *
     * If two Groups or arrays are passed, each member of one will be tested against each member of the other.
     *
     * If **only** one Group is passed (as `object1`), each member of the Group will be collided against the other members.
     *
     * If **only** one Array is passed, the array is iterated and every element in it is tested against the others.
     *
     * Two callbacks can be provided; they receive the colliding game objects as arguments.
     * If an overlap is detected, the `processCallback` is called first. It can cancel the collision by returning false.
     * Next the objects are separated and `collideCallback` is invoked.
     *
     * Arcade Physics uses the Projection Method of collision resolution and separation. While it's fast and suitable
     * for 'arcade' style games it lacks stability when multiple objects are in close proximity or resting upon each other.
     * The separation that stops two objects penetrating may create a new penetration against a different object. If you
     * require a high level of stability please consider using an alternative physics system, such as Matter.js.
     *
     * @method Phaser.Physics.Arcade.World#collide
     * @since 3.0.0
     *
     * @param {Phaser.Types.Physics.Arcade.ArcadeColliderType} object1 - The first object or array of objects to check.
     * @param {Phaser.Types.Physics.Arcade.ArcadeColliderType} [object2] - The second object or array of objects to check, or `undefined`.
     * @param {Phaser.Types.Physics.Arcade.ArcadePhysicsCallback} [collideCallback] - An optional callback function that is called if the objects collide.
     * @param {Phaser.Types.Physics.Arcade.ArcadePhysicsCallback} [processCallback] - An optional callback function that lets you perform additional checks against the two objects if they collide. If this is set then `collideCallback` will only be called if this callback returns `true`.
     * @param {any} [callbackContext] - The context in which to run the callbacks.
     *
     * @return {boolean} `true` if any overlapping Game Objects were separated, otherwise `false`.
     */
    collide: function (object1, object2, collideCallback, processCallback, callbackContext)
    {
        if (collideCallback === undefined) { collideCallback = null; }
        if (processCallback === undefined) { processCallback = null; }
        if (callbackContext === undefined) { callbackContext = collideCallback; }

        return this.collideObjects(object1, object2, collideCallback, processCallback, callbackContext, false);
    },

    /**
     * Internal helper function. Please use Phaser.Physics.Arcade.World#collide instead.
     *
     * @method Phaser.Physics.Arcade.World#collideObjects
     * @private
     * @since 3.0.0
     *
     * @param {Phaser.Types.Physics.Arcade.ArcadeColliderType} object1 - The first object to check for collision.
     * @param {Phaser.Types.Physics.Arcade.ArcadeColliderType} [object2] - The second object to check for collision.
     * @param {Phaser.Types.Physics.Arcade.ArcadePhysicsCallback} collideCallback - The callback to invoke when the two objects collide.
     * @param {Phaser.Types.Physics.Arcade.ArcadePhysicsCallback} processCallback - The callback to invoke when the two objects collide. Must return a boolean.
     * @param {any} callbackContext - The scope in which to call the callbacks.
     * @param {boolean} overlapOnly - Whether this is a collision or overlap check.
     *
     * @return {boolean} True if any objects overlap (with `overlapOnly`); or true if any overlapping objects were separated.
     */
    collideObjects: function (object1, object2, collideCallback, processCallback, callbackContext, overlapOnly)
    {
        var i;
        var j;

        if (object1.isParent && (object1.physicsType === undefined || object2 === undefined || object1 === object2))
        {
            object1 = object1.children.entries;
        }

        if (object2 && object2.isParent && object2.physicsType === undefined)
        {
            object2 = object2.children.entries;
        }

        var object1isArray = Array.isArray(object1);
        var object2isArray = Array.isArray(object2);

        this._total = 0;

        if (!object1isArray && !object2isArray)
        {
            //  Neither of them are arrays - do this first as it's the most common use-case
            this.collideHandler(object1, object2, collideCallback, processCallback, callbackContext, overlapOnly);
        }
        else if (!object1isArray && object2isArray)
        {
            //  Object 2 is an Array
            for (i = 0; i < object2.length; i++)
            {
                this.collideHandler(object1, object2[i], collideCallback, processCallback, callbackContext, overlapOnly);
            }
        }
        else if (object1isArray && !object2isArray)
        {
            //  Object 1 is an Array
            if (!object2)
            {
                //  Special case for array vs. self
                for (i = 0; i < object1.length; i++)
                {
                    var child = object1[i];

                    for (j = i + 1; j < object1.length; j++)
                    {
                        if (i === j)
                        {
                            continue;
                        }

                        this.collideHandler(child, object1[j], collideCallback, processCallback, callbackContext, overlapOnly);
                    }
                }
            }
            else
            {
                for (i = 0; i < object1.length; i++)
                {
                    this.collideHandler(object1[i], object2, collideCallback, processCallback, callbackContext, overlapOnly);
                }
            }
        }
        else
        {
            //  They're both arrays
            for (i = 0; i < object1.length; i++)
            {
                for (j = 0; j < object2.length; j++)
                {
                    this.collideHandler(object1[i], object2[j], collideCallback, processCallback, callbackContext, overlapOnly);
                }
            }
        }

        return (this._total > 0);
    },

    /**
     * Internal helper function. Please use Phaser.Physics.Arcade.World#collide and Phaser.Physics.Arcade.World#overlap instead.
     *
     * @method Phaser.Physics.Arcade.World#collideHandler
     * @private
     * @since 3.0.0
     *
     * @param {Phaser.Types.Physics.Arcade.ArcadeColliderType} object1 - The first object or array of objects to check.
     * @param {Phaser.Types.Physics.Arcade.ArcadeColliderType} object2 - The second object or array of objects to check, or `undefined`.
     * @param {Phaser.Types.Physics.Arcade.ArcadePhysicsCallback} collideCallback - An optional callback function that is called if the objects collide.
     * @param {Phaser.Types.Physics.Arcade.ArcadePhysicsCallback} processCallback - An optional callback function that lets you perform additional checks against the two objects if they collide. If this is set then `collideCallback` will only be called if this callback returns `true`.
     * @param {any} callbackContext - The context in which to run the callbacks.
     * @param {boolean} overlapOnly - Whether this is a collision or overlap check.
     *
     * @return {boolean} True if any objects overlap (with `overlapOnly`); or true if any overlapping objects were separated.
     */
    collideHandler: function (object1, object2, collideCallback, processCallback, callbackContext, overlapOnly)
    {
        //  Collide Group with Self
        //  Only collide valid objects
        if (object2 === undefined && object1.isParent)
        {
            return this.collideGroupVsGroup(object1, object1, collideCallback, processCallback, callbackContext, overlapOnly);
        }

        //  If neither of the objects are set then bail out
        if (!object1 || !object2)
        {
            return false;
        }

        //  SPRITE
        if (object1.body || object1.isBody)
        {
            if (object2.body || object2.isBody)
            {
                return this.collideSpriteVsSprite(object1, object2, collideCallback, processCallback, callbackContext, overlapOnly);
            }
            else if (object2.isParent)
            {
                return this.collideSpriteVsGroup(object1, object2, collideCallback, processCallback, callbackContext, overlapOnly);
            }
            else if (object2.isTilemap)
            {
                return this.collideSpriteVsTilemapLayer(object1, object2, collideCallback, processCallback, callbackContext, overlapOnly);
            }
        }

        //  GROUPS
        else if (object1.isParent)
        {
            if (object2.body || object2.isBody)
            {
                return this.collideSpriteVsGroup(object2, object1, collideCallback, processCallback, callbackContext, overlapOnly);
            }
            else if (object2.isParent)
            {
                return this.collideGroupVsGroup(object1, object2, collideCallback, processCallback, callbackContext, overlapOnly);
            }
            else if (object2.isTilemap)
            {
                return this.collideGroupVsTilemapLayer(object1, object2, collideCallback, processCallback, callbackContext, overlapOnly);
            }
        }

        //  TILEMAP LAYERS
        else if (object1.isTilemap)
        {
            if (object2.body || object2.isBody)
            {
                return this.collideSpriteVsTilemapLayer(object2, object1, collideCallback, processCallback, callbackContext, overlapOnly);
            }
            else if (object2.isParent)
            {
                return this.collideGroupVsTilemapLayer(object2, object1, collideCallback, processCallback, callbackContext, overlapOnly);
            }
        }
    },

    /**
     * Checks if the two given Arcade Physics bodies will collide, or not,
     * based on their collision mask and collision categories.
     *
     * @method Phaser.Physics.Arcade.World#canCollide
     * @since 3.70.0
     *
     * @param {Phaser.Types.Physics.Arcade.ArcadeCollider} body1 - The first body to check.
     * @param {Phaser.Types.Physics.Arcade.ArcadeCollider} body2 - The second body to check.
     *
     * @return {boolean} True if the two bodies will collide, otherwise false.
     */
    canCollide: function (body1, body2)
    {
        return (
            (body1 && body2) &&
            (body1.collisionMask & body2.collisionCategory) !== 0 &&
            (body2.collisionMask & body1.collisionCategory) !== 0
        );
    },

    /**
     * Internal handler for Sprite vs. Sprite collisions.
     * Please use Phaser.Physics.Arcade.World#collide instead.
     *
     * @method Phaser.Physics.Arcade.World#collideSpriteVsSprite
     * @private
     * @since 3.0.0
     *
     * @param {Phaser.GameObjects.GameObject} sprite1 - The first object to check for collision.
     * @param {Phaser.GameObjects.GameObject} sprite2 - The second object to check for collision.
     * @param {Phaser.Types.Physics.Arcade.ArcadePhysicsCallback} [collideCallback] - An optional callback function that is called if the objects collide.
     * @param {Phaser.Types.Physics.Arcade.ArcadePhysicsCallback} [processCallback] - An optional callback function that lets you perform additional checks against the two objects if they collide. If this is set then `collideCallback` will only be called if this callback returns `true`.
     * @param {any} [callbackContext] - The context in which to run the callbacks.
     * @param {boolean} overlapOnly - Whether this is a collision or overlap check.
     *
     * @return {boolean} True if any objects overlap (with `overlapOnly`); or true if any overlapping objects were separated.
     */
    collideSpriteVsSprite: function (sprite1, sprite2, collideCallback, processCallback, callbackContext, overlapOnly)
    {
        var body1 = (sprite1.isBody) ? sprite1 : sprite1.body;
        var body2 = (sprite2.isBody) ? sprite2 : sprite2.body;

        if (!this.canCollide(body1, body2))
        {
            return false;
        }

        if (this.separate(body1, body2, processCallback, callbackContext, overlapOnly))
        {
            if (collideCallback)
            {
                collideCallback.call(callbackContext, sprite1, sprite2);
            }

            this._total++;
        }

        return true;
    },

    /**
     * Internal handler for Sprite vs. Group collisions.
     * Please use Phaser.Physics.Arcade.World#collide instead.
     *
     * @method Phaser.Physics.Arcade.World#collideSpriteVsGroup
     * @private
     * @since 3.0.0
     *
     * @param {Phaser.GameObjects.GameObject} sprite - The first object to check for collision.
     * @param {Phaser.GameObjects.Group} group - The second object to check for collision.
     * @param {Phaser.Types.Physics.Arcade.ArcadePhysicsCallback} collideCallback - The callback to invoke when the two objects collide.
     * @param {Phaser.Types.Physics.Arcade.ArcadePhysicsCallback} processCallback - The callback to invoke when the two objects collide. Must return a boolean.
     * @param {any} callbackContext - The scope in which to call the callbacks.
     * @param {boolean} overlapOnly - Whether this is a collision or overlap check.
     */
    collideSpriteVsGroup: function (sprite, group, collideCallback, processCallback, callbackContext, overlapOnly)
    {
        var bodyA = (sprite.isBody) ? sprite : sprite.body;

        if (
            group.length === 0 ||
            !bodyA ||
            !bodyA.enable ||
            bodyA.checkCollision.none ||
            !this.canCollide(bodyA, group)
        )
        {
            return;
        }

        //  Does sprite collide with anything?

        var i;
        var len;
        var bodyB;

        if (this.useTree || group.physicsType === CONST.STATIC_BODY)
        {
            var minMax = this.treeMinMax;

            minMax.minX = bodyA.left;
            minMax.minY = bodyA.top;
            minMax.maxX = bodyA.right;
            minMax.maxY = bodyA.bottom;

            var results = (group.physicsType === CONST.DYNAMIC_BODY) ? this.tree.search(minMax) : this.staticTree.search(minMax);

            len = results.length;

            for (i = 0; i < len; i++)
            {
                bodyB = results[i];

                if (bodyA === bodyB || !bodyB.enable || bodyB.checkCollision.none || !group.contains(bodyB.gameObject))
                {
                    //  Skip if comparing against itself, or if bodyB isn't collidable, or if bodyB isn't actually part of the Group
                    continue;
                }

                if (this.separate(bodyA, bodyB, processCallback, callbackContext, overlapOnly))
                {
                    if (collideCallback)
                    {
                        collideCallback.call(callbackContext, bodyA.gameObject, bodyB.gameObject);
                    }

                    this._total++;
                }
            }
        }
        else
        {
            var children = group.getChildren();
            var skipIndex = group.children.entries.indexOf(sprite);

            len = children.length;

            for (i = 0; i < len; i++)
            {
                bodyB = children[i].body;

                if (!bodyB || i === skipIndex || !bodyB.enable)
                {
                    continue;
                }

                if (this.separate(bodyA, bodyB, processCallback, callbackContext, overlapOnly))
                {
                    if (collideCallback)
                    {
                        collideCallback.call(callbackContext, bodyA.gameObject, bodyB.gameObject);
                    }

                    this._total++;
                }
            }
        }
    },

    /**
     * Internal handler for Group vs. Tilemap collisions.
     * Please use Phaser.Physics.Arcade.World#collide instead.
     *
     * @method Phaser.Physics.Arcade.World#collideGroupVsTilemapLayer
     * @private
     * @since 3.0.0
     *
     * @param {Phaser.GameObjects.Group} group - The first object to check for collision.
     * @param {Phaser.Tilemaps.TilemapLayer} tilemapLayer - The second object to check for collision.
     * @param {Phaser.Types.Physics.Arcade.ArcadePhysicsCallback} collideCallback - An optional callback function that is called if the objects collide.
     * @param {Phaser.Types.Physics.Arcade.ArcadePhysicsCallback} processCallback - An optional callback function that lets you perform additional checks against the two objects if they collide. If this is set then `collideCallback` will only be called if this callback returns `true`.
     * @param {any} callbackContext - The context in which to run the callbacks.
     * @param {boolean} overlapOnly - Whether this is a collision or overlap check.
     *
     * @return {boolean} True if any objects overlap (with `overlapOnly`); or true if any overlapping objects were separated.
     */
    collideGroupVsTilemapLayer: function (group, tilemapLayer, collideCallback, processCallback, callbackContext, overlapOnly)
    {
        if (!this.canCollide(group, tilemapLayer))
        {
            return false;
        }

        var children = group.getChildren();

        if (children.length === 0)
        {
            return false;
        }

        var didCollide = false;

        for (var i = 0; i < children.length; i++)
        {
            if (children[i].body || children[i].isBody)
            {
                if (this.collideSpriteVsTilemapLayer(children[i], tilemapLayer, collideCallback, processCallback, callbackContext, overlapOnly))
                {
                    didCollide = true;
                }
            }
        }

        return didCollide;
    },

    /**
     * This advanced method is specifically for testing for collision between a single Sprite and an array of Tile objects.
     *
     * You should generally use the `collide` method instead, with a Sprite vs. a Tilemap Layer, as that will perform
     * tile filtering and culling for you, as well as handle the interesting face collision automatically.
     *
     * This method is offered for those who would like to check for collision with specific Tiles in a layer, without
     * having to set any collision attributes on the tiles in question. This allows you to perform quick dynamic collisions
     * on small sets of Tiles. As such, no culling or checks are made to the array of Tiles given to this method,
     * you should filter them before passing them to this method.
     *
     * Important: Use of this method skips the `interesting faces` system that Tilemap Layers use. This means if you have
     * say a row or column of tiles, and you jump into, or walk over them, it's possible to get stuck on the edges of the
     * tiles as the interesting face calculations are skipped. However, for quick-fire small collision set tests on
     * dynamic maps, this method can prove very useful.
     *
     * This method does not factor in the Collision Mask or Category.
     *
     * @method Phaser.Physics.Arcade.World#collideTiles
     * @fires Phaser.Physics.Arcade.Events#TILE_COLLIDE
     * @since 3.17.0
     *
     * @param {Phaser.GameObjects.GameObject} sprite - The first object to check for collision.
     * @param {Phaser.Tilemaps.Tile[]} tiles - An array of Tiles to check for collision against.
     * @param {Phaser.Types.Physics.Arcade.ArcadePhysicsCallback} [collideCallback] - An optional callback function that is called if the objects collide.
     * @param {Phaser.Types.Physics.Arcade.ArcadePhysicsCallback} [processCallback] - An optional callback function that lets you perform additional checks against the two objects if they collide. If this is set then `collideCallback` will only be called if this callback returns `true`.
     * @param {any} [callbackContext] - The context in which to run the callbacks.
     *
     * @return {boolean} True if any objects overlap (with `overlapOnly`); or true if any overlapping objects were separated.
     */
    collideTiles: function (sprite, tiles, collideCallback, processCallback, callbackContext)
    {
        if (tiles.length === 0 || (sprite.body && !sprite.body.enable) || (sprite.isBody && !sprite.enable))
        {
            return false;
        }
        else
        {
            return this.collideSpriteVsTilesHandler(sprite, tiles, collideCallback, processCallback, callbackContext, false, false);
        }
    },

    /**
     * This advanced method is specifically for testing for overlaps between a single Sprite and an array of Tile objects.
     *
     * You should generally use the `overlap` method instead, with a Sprite vs. a Tilemap Layer, as that will perform
     * tile filtering and culling for you, as well as handle the interesting face collision automatically.
     *
     * This method is offered for those who would like to check for overlaps with specific Tiles in a layer, without
     * having to set any collision attributes on the tiles in question. This allows you to perform quick dynamic overlap
     * tests on small sets of Tiles. As such, no culling or checks are made to the array of Tiles given to this method,
     * you should filter them before passing them to this method.
     *
     * This method does not factor in the Collision Mask or Category.
     *
     * @method Phaser.Physics.Arcade.World#overlapTiles
     * @fires Phaser.Physics.Arcade.Events#TILE_OVERLAP
     * @since 3.17.0
     *
     * @param {Phaser.GameObjects.GameObject} sprite - The first object to check for collision.
     * @param {Phaser.Tilemaps.Tile[]} tiles - An array of Tiles to check for collision against.
     * @param {Phaser.Types.Physics.Arcade.ArcadePhysicsCallback} [collideCallback] - An optional callback function that is called if the objects overlap.
     * @param {Phaser.Types.Physics.Arcade.ArcadePhysicsCallback} [processCallback] - An optional callback function that lets you perform additional checks against the two objects if they collide. If this is set then `collideCallback` will only be called if this callback returns `true`.
     * @param {any} [callbackContext] - The context in which to run the callbacks.
     *
     * @return {boolean} True if any objects overlap (with `overlapOnly`); or true if any overlapping objects were separated.
     */
    overlapTiles: function (sprite, tiles, collideCallback, processCallback, callbackContext)
    {
        if (tiles.length === 0 || (sprite.body && !sprite.body.enable) || (sprite.isBody && !sprite.enable))
        {
            return false;
        }
        else
        {
            return this.collideSpriteVsTilesHandler(sprite, tiles, collideCallback, processCallback, callbackContext, true, false);
        }
    },

    /**
     * Internal handler for Sprite vs. Tilemap collisions.
     * Please use Phaser.Physics.Arcade.World#collide instead.
     *
     * @method Phaser.Physics.Arcade.World#collideSpriteVsTilemapLayer
     * @fires Phaser.Physics.Arcade.Events#TILE_COLLIDE
     * @fires Phaser.Physics.Arcade.Events#TILE_OVERLAP
     * @since 3.0.0
     *
     * @param {Phaser.GameObjects.GameObject} sprite - The first object to check for collision.
     * @param {Phaser.Tilemaps.TilemapLayer} tilemapLayer - The second object to check for collision.
     * @param {Phaser.Types.Physics.Arcade.ArcadePhysicsCallback} [collideCallback] - An optional callback function that is called if the objects collide.
     * @param {Phaser.Types.Physics.Arcade.ArcadePhysicsCallback} [processCallback] - An optional callback function that lets you perform additional checks against the two objects if they collide. If this is set then `collideCallback` will only be called if this callback returns `true`.
     * @param {any} [callbackContext] - The context in which to run the callbacks.
     * @param {boolean} [overlapOnly] - Whether this is a collision or overlap check.
     *
     * @return {boolean} True if any objects overlap (with `overlapOnly`); or true if any overlapping objects were separated.
     */
    collideSpriteVsTilemapLayer: function (sprite, tilemapLayer, collideCallback, processCallback, callbackContext, overlapOnly)
    {
        var body = (sprite.isBody) ? sprite : sprite.body;

        if (!body.enable || body.checkCollision.none || !this.canCollide(body, tilemapLayer))
        {
            return false;
        }

        var layerData = tilemapLayer.layer;

        //  Increase the hit area of the body by the size of the tiles * the scale
        //  This will allow GetTilesWithinWorldXY to include the tiles around the body

        var x = body.x - (layerData.tileWidth * tilemapLayer.scaleX);
        var y = body.y - (layerData.tileHeight * tilemapLayer.scaleY);
        var w = body.width + (layerData.tileWidth * tilemapLayer.scaleX);
        var h = body.height + layerData.tileHeight * tilemapLayer.scaleY;

        var options = (overlapOnly) ? null : this.tileFilterOptions;

        var mapData = GetTilesWithinWorldXY(x, y, w, h, options, tilemapLayer.scene.cameras.main, tilemapLayer.layer);

        if (mapData.length === 0)
        {
            return false;
        }
        else
        {
            return this.collideSpriteVsTilesHandler(sprite, mapData, collideCallback, processCallback, callbackContext, overlapOnly, true);
        }
    },

    /**
     * Internal handler for Sprite vs. Tilemap collisions.
     * Please use Phaser.Physics.Arcade.World#collide instead.
     *
     * @method Phaser.Physics.Arcade.World#collideSpriteVsTilesHandler
     * @fires Phaser.Physics.Arcade.Events#TILE_COLLIDE
     * @fires Phaser.Physics.Arcade.Events#TILE_OVERLAP
     * @private
     * @since 3.17.0
     *
     * @param {Phaser.GameObjects.GameObject} sprite - The first object to check for collision.
     * @param {Phaser.Tilemaps.TilemapLayer} tilemapLayer - The second object to check for collision.
     * @param {Phaser.Types.Physics.Arcade.ArcadePhysicsCallback} [collideCallback] - An optional callback function that is called if the objects collide.
     * @param {Phaser.Types.Physics.Arcade.ArcadePhysicsCallback} [processCallback] - An optional callback function that lets you perform additional checks against the two objects if they collide. If this is set then `collideCallback` will only be called if this callback returns `true`.
     * @param {any} [callbackContext] - The context in which to run the callbacks.
     * @param {boolean} [overlapOnly] - Whether this is a collision or overlap check.
     * @param {boolean} [isLayer] - Is this check coming from a TilemapLayer or an array of tiles?
     *
     * @return {boolean} True if any objects overlap (with `overlapOnly`); or true if any overlapping objects were separated.
     */
    collideSpriteVsTilesHandler: function (sprite, tiles, collideCallback, processCallback, callbackContext, overlapOnly, isLayer)
    {
        var body = (sprite.isBody) ? sprite : sprite.body;

        var tile;
        var tileWorldRect = { left: 0, right: 0, top: 0, bottom: 0 };
        var tilemapLayer;
        var collision = false;

        for (var i = 0; i < tiles.length; i++)
        {
            tile = tiles[i];

            tilemapLayer = tile.tilemapLayer;

            var point = tilemapLayer.tileToWorldXY(tile.x, tile.y);

            tileWorldRect.left = point.x;
            tileWorldRect.top = point.y;

            tileWorldRect.right = tileWorldRect.left + tile.width * tilemapLayer.scaleX;
            tileWorldRect.bottom = tileWorldRect.top + tile.height * tilemapLayer.scaleY;

            if (
                TileIntersectsBody(tileWorldRect, body) &&
                (!processCallback || processCallback.call(callbackContext, sprite, tile)) &&
                ProcessTileCallbacks(tile, sprite) &&
                (overlapOnly || SeparateTile(i, body, tile, tileWorldRect, tilemapLayer, this.TILE_BIAS, isLayer)))
            {
                this._total++;

                collision = true;

                if (collideCallback)
                {
                    collideCallback.call(callbackContext, sprite, tile);
                }

                if (overlapOnly && body.onOverlap)
                {
                    this.emit(Events.TILE_OVERLAP, sprite, tile, body);
                }
                else if (body.onCollide)
                {
                    this.emit(Events.TILE_COLLIDE, sprite, tile, body);
                }
            }
        }

        return collision;
    },

    /**
     * Internal helper for Group vs. Group collisions.
     * Please use Phaser.Physics.Arcade.World#collide instead.
     *
     * @method Phaser.Physics.Arcade.World#collideGroupVsGroup
     * @private
     * @since 3.0.0
     *
     * @param {Phaser.GameObjects.Group} group1 - The first object to check for collision.
     * @param {Phaser.GameObjects.Group} group2 - The second object to check for collision.
     * @param {Phaser.Types.Physics.Arcade.ArcadePhysicsCallback} [collideCallback] - An optional callback function that is called if the objects collide.
     * @param {Phaser.Types.Physics.Arcade.ArcadePhysicsCallback} [processCallback] - An optional callback function that lets you perform additional checks against the two objects if they collide. If this is set then `collideCallback` will only be called if this callback returns `true`.
     * @param {any} [callbackContext] - The context in which to run the callbacks.
     * @param {boolean} overlapOnly - Whether this is a collision or overlap check.
     *
     * @return {boolean} True if any objects overlap (with `overlapOnly`); or true if any overlapping objects were separated.
     */
    collideGroupVsGroup: function (group1, group2, collideCallback, processCallback, callbackContext, overlapOnly)
    {
        if (group1.length === 0 || group2.length === 0 || !this.canCollide(group1, group2))
        {
            return;
        }

        var children = group1.getChildren();

        for (var i = 0; i < children.length; i++)
        {
            this.collideSpriteVsGroup(children[i], group2, collideCallback, processCallback, callbackContext, overlapOnly);
        }
    },

    /**
     * Wrap an object's coordinates (or several objects' coordinates) within {@link Phaser.Physics.Arcade.World#bounds}.
     *
     * If the object is outside any boundary edge (left, top, right, bottom), it will be moved to the same offset from the opposite edge (the interior).
     *
     * @method Phaser.Physics.Arcade.World#wrap
     * @since 3.3.0
     *
     * @param {any} object - A Game Object, a Group, an object with `x` and `y` coordinates, or an array of such objects.
     * @param {number} [padding=0] - An amount added to each boundary edge during the operation.
     */
    wrap: function (object, padding)
    {
        if (object.body)
        {
            this.wrapObject(object, padding);
        }
        else if (object.getChildren)
        {
            this.wrapArray(object.getChildren(), padding);
        }
        else if (Array.isArray(object))
        {
            this.wrapArray(object, padding);
        }
        else
        {
            this.wrapObject(object, padding);
        }
    },

    /**
     * Wrap each object's coordinates within {@link Phaser.Physics.Arcade.World#bounds}.
     *
     * @method Phaser.Physics.Arcade.World#wrapArray
     * @since 3.3.0
     *
     * @param {Array.<*>} objects - An array of objects to be wrapped.
     * @param {number} [padding=0] - An amount added to the boundary.
     */
    wrapArray: function (objects, padding)
    {
        for (var i = 0; i < objects.length; i++)
        {
            this.wrapObject(objects[i], padding);
        }
    },

    /**
     * Wrap an object's coordinates within {@link Phaser.Physics.Arcade.World#bounds}.
     *
     * @method Phaser.Physics.Arcade.World#wrapObject
     * @since 3.3.0
     *
     * @param {*} object - A Game Object, a Physics Body, or any object with `x` and `y` coordinates
     * @param {number} [padding=0] - An amount added to the boundary.
     */
    wrapObject: function (object, padding)
    {
        if (padding === undefined) { padding = 0; }

        object.x = Wrap(object.x, this.bounds.left - padding, this.bounds.right + padding);
        object.y = Wrap(object.y, this.bounds.top - padding, this.bounds.bottom + padding);
    },

    /**
     * Shuts down the simulation, clearing physics data and removing listeners.
     *
     * @method Phaser.Physics.Arcade.World#shutdown
     * @since 3.0.0
     */
    shutdown: function ()
    {
        this.tree.clear();
        this.staticTree.clear();
        this.bodies.clear();
        this.staticBodies.clear();
        this.colliders.destroy();

        this.removeAllListeners();
    },

    /**
     * Shuts down the simulation and disconnects it from the current scene.
     *
     * @method Phaser.Physics.Arcade.World#destroy
     * @since 3.0.0
     */
    destroy: function ()
    {
        this.shutdown();

        this.scene = null;

        if (this.debugGraphic)
        {
            this.debugGraphic.destroy();
            this.debugGraphic = null;
        }
    }

});

module.exports = World;
