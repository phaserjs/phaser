/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

var Body = require('./Body');
var Clamp = require('../../math/Clamp');
var Class = require('../../utils/Class');
var Collider = require('./Collider');
var CONST = require('./const');
var DistanceBetween = require('../../math/distance/DistanceBetween');
var EventEmitter = require('eventemitter3');
var GetOverlapX = require('./GetOverlapX');
var GetOverlapY = require('./GetOverlapY');
var GetValue = require('../../utils/object/GetValue');
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
var Vector2 = require('../../math/Vector2');
var Wrap = require('../../math/Wrap');

/**
 * @event Phaser.Physics.Arcade.World#pause
 */

/**
 * @event Phaser.Physics.Arcade.World#resume
 */

/**
 * @event Phaser.Physics.Arcade.World#collide
 * @param {Phaser.GameObjects.GameObject} gameObject1
 * @param {Phaser.GameObjects.GameObject} gameObject2
 * @param {Phaser.Physics.Arcade.Body|Phaser.Physics.Arcade.StaticBody} body1
 * @param {Phaser.Physics.Arcade.Body|Phaser.Physics.Arcade.StaticBody} body2
 */

/**
 * @event Phaser.Physics.Arcade.World#overlap
 * @param {Phaser.GameObjects.GameObject} gameObject1
 * @param {Phaser.GameObjects.GameObject} gameObject2
 * @param {Phaser.Physics.Arcade.Body|Phaser.Physics.Arcade.StaticBody} body1
 * @param {Phaser.Physics.Arcade.Body|Phaser.Physics.Arcade.StaticBody} body2
 */

/**
 * @event Phaser.Physics.Arcade.World#worldbounds
 * @param {Phaser.Physics.Arcade.Body} body
 * @param {boolean} up
 * @param {boolean} down
 * @param {boolean} left
 * @param {boolean} right
 */

/**
 * @typedef {object} ArcadeWorldConfig
 *
 * @property {object} [gravity] - Sets {@link Phaser.Physics.Arcade.World#gravity}.
 * @property {number} [gravity.x=0] - [description]
 * @property {number} [gravity.y=0] - [description]
 * @property {number} [x=0] - Sets {@link Phaser.Physics.Arcade.World#bounds bounds.x}.
 * @property {number} [y=0] - Sets {@link Phaser.Physics.Arcade.World#bounds bounds.y}.
 * @property {number} [width=0] - Sets {@link Phaser.Physics.Arcade.World#bounds bounds.width}.
 * @property {number} [height=0] - Sets {@link Phaser.Physics.Arcade.World#bounds bounds.height}.
 * @property {object} [checkCollision] - Sets {@link Phaser.Physics.Arcade.World#checkCollision}.
 * @property {boolean} [checkCollision.up=true] - [description]
 * @property {boolean} [checkCollision.down=true] - [description]
 * @property {boolean} [checkCollision.left=true] - [description]
 * @property {boolean} [checkCollision.right=true] - [description]
 * @property {number} [overlapBias=4] - Sets {@link Phaser.Physics.Arcade.World#OVERLAP_BIAS}.
 * @property {number} [tileBias=16] - Sets {@link Phaser.Physics.Arcade.World#TILE_BIAS}.
 * @property {boolean} [forceX=false] - Sets {@link Phaser.Physics.Arcade.World#forceX}.
 * @property {boolean} [isPaused=false] - Sets {@link Phaser.Physics.Arcade.World#isPaused}.
 * @property {boolean} [debug=false] - Sets {@link Phaser.Physics.Arcade.World#debug}.
 * @property {boolean} [debugShowBody=true] - Sets {@link Phaser.Physics.Arcade.World#defaults debugShowBody}.
 * @property {boolean} [debugShowStaticBody=true] - Sets {@link Phaser.Physics.Arcade.World#defaults debugShowStaticBody}.
 * @property {boolean} [debugShowVelocity=true] - Sets {@link Phaser.Physics.Arcade.World#defaults debugShowStaticBody}.
 * @property {number} [debugBodyColor=0xff00ff] - Sets {@link Phaser.Physics.Arcade.World#defaults debugBodyColor}.
 * @property {number} [debugStaticBodyColor=0x0000ff] - Sets {@link Phaser.Physics.Arcade.World#defaults debugStaticBodyColor}.
 * @property {number} [debugVelocityColor=0x00ff00] - Sets {@link Phaser.Physics.Arcade.World#defaults debugVelocityColor}.
 * @property {number} [maxEntries=16] - Sets {@link Phaser.Physics.Arcade.World#maxEntries}.
 */

/**
 * @typedef {object} CheckCollisionObject
 *
 * @property {boolean} up - [description]
 * @property {boolean} down - [description]
 * @property {boolean} left - [description]
 * @property {boolean} right - [description]
 */

/**
 * @typedef {object} ArcadeWorldDefaults
 *
 * @property {boolean} debugShowBody - [description]
 * @property {boolean} debugShowStaticBody - [description]
 * @property {boolean} debugShowVelocity - [description]
 * @property {number} bodyDebugColor - [description]
 * @property {number} staticBodyDebugColor - [description]
 * @property {number} velocityDebugColor - [description]
 */

/**
 * @typedef {object} ArcadeWorldTreeMinMax
 *
 * @property {number} minX - [description]
 * @property {number} minY - [description]
 * @property {number} maxX - [description]
 * @property {number} maxY - [description]
 */

/**
 * @classdesc
 * [description]
 *
 * @class World
 * @extends Phaser.Events.EventEmitter
 * @memberOf Phaser.Physics.Arcade
 * @constructor
 * @since 3.0.0
 *
 * @param {Phaser.Scene} scene - [description]
 * @param {ArcadeWorldConfig} config - [description]
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
            GetValue(config, 'width', scene.sys.game.config.width),
            GetValue(config, 'height', scene.sys.game.config.height)
        );

        /**
         * The boundary edges that Bodies can collide with.
         *
         * @name Phaser.Physics.Arcade.World#checkCollision
         * @type {CheckCollisionObject}
         * @since 3.0.0
         */
        this.checkCollision = {
            up: GetValue(config, 'checkCollision.up', true),
            down: GetValue(config, 'checkCollision.down', true),
            left: GetValue(config, 'checkCollision.left', true),
            right: GetValue(config, 'checkCollision.right', true)
        };

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
         * @type {ArcadeWorldDefaults}
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
         * The maximum number of items per tree node.
         *
         * @name Phaser.Physics.Arcade.World#maxEntries
         * @type {integer}
         * @default 16
         * @since 3.0.0
         */
        this.maxEntries = GetValue(config, 'maxEntries', 16);

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
         * @type {ArcadeWorldTreeMinMax}
         * @since 3.0.0
         */
        this.treeMinMax = { minX: 0, minY: 0, maxX: 0, maxY: 0 };

        if (this.drawDebug)
        {
            this.createDebugGraphic();
        }
    },

    /**
     * Adds an Arcade Physics Body to a Game Object.
     *
     * @method Phaser.Physics.Arcade.World#enable
     * @since 3.0.0
     *
     * @param {(Phaser.GameObjects.GameObject|Phaser.GameObjects.GameObject[])} object - [description]
     * @param {integer} [bodyType] - The type of Body to create. Either `DYNAMIC_BODY` or `STATIC_BODY`.
     */
    enable: function (object, bodyType)
    {
        if (bodyType === undefined) { bodyType = CONST.DYNAMIC_BODY; }

        var i = 1;

        if (Array.isArray(object))
        {
            i = object.length;

            while (i--)
            {
                if (object[i].hasOwnProperty('children'))
                {
                    //  If it's a Group then we do it on the children regardless
                    this.enable(object[i].children.entries, bodyType);
                }
                else
                {
                    this.enableBody(object[i], bodyType);
                }
            }
        }
        else if (object.hasOwnProperty('children'))
        {
            //  If it's a Group then we do it on the children regardless
            this.enable(object.children.entries, bodyType);
        }
        else
        {
            this.enableBody(object, bodyType);
        }
    },

    /**
     * Helper for Phaser.Physics.Arcade.World#enable.
     *
     * @method Phaser.Physics.Arcade.World#enableBody
     * @since 3.0.0
     *
     * @param {Phaser.GameObjects.GameObject} object - [description]
     * @param {integer} [bodyType] - The type of Body to create. Either `DYNAMIC_BODY` or `STATIC_BODY`.
     *
     * @return {Phaser.GameObjects.GameObject} [description]
     */
    enableBody: function (object, bodyType)
    {
        if (object.body === null)
        {
            if (bodyType === CONST.DYNAMIC_BODY)
            {
                object.body = new Body(this, object);

                this.bodies.set(object.body);
            }
            else if (bodyType === CONST.STATIC_BODY)
            {
                object.body = new StaticBody(this, object);

                this.staticBodies.set(object.body);

                this.staticTree.insert(object.body);
            }
        }

        return object;
    },

    /**
     * Remove a Body from the simulation.
     *
     * @method Phaser.Physics.Arcade.World#remove
     * @since 3.0.0
     *
     * @param {Phaser.Physics.Arcade.Body} object - [description]
     */
    remove: function (object)
    {
        this.disableBody(object);
    },

    /**
     * Disables the Body of a Game Object, or the Bodies of several Game Objects.
     *
     * @method Phaser.Physics.Arcade.World#disable
     * @since 3.0.0
     *
     * @param {(Phaser.GameObjects.GameObject|Phaser.GameObjects.GameObject[])} object - [description]
     */
    disable: function (object)
    {
        var i = 1;

        if (Array.isArray(object))
        {
            i = object.length;

            while (i--)
            {
                if (object[i].hasOwnProperty('children'))
                {
                    //  If it's a Group then we do it on the children regardless
                    this.disable(object[i].children.entries);
                }
                else
                {
                    this.disableGameObjectBody(object[i]);
                }
            }
        }
        else if (object.hasOwnProperty('children'))
        {
            //  If it's a Group then we do it on the children regardless
            this.disable(object.children.entries);
        }
        else
        {
            this.disableGameObjectBody(object);
        }
    },

    /**
     * Disables the Body of a Game Object.
     *
     * @method Phaser.Physics.Arcade.World#disableGameObjectBody
     * @since 3.1.0
     *
     * @param {Phaser.GameObjects.GameObject} object - [description]
     *
     * @return {Phaser.GameObjects.GameObject} [description]
     */
    disableGameObjectBody: function (object)
    {
        if (object.body)
        {
            if (object.body.physicsType === CONST.DYNAMIC_BODY)
            {
                this.bodies.delete(object.body);
            }
            else if (object.body.physicsType === CONST.STATIC_BODY)
            {
                this.staticBodies.delete(object.body);
                this.staticTree.remove(object.body);
            }

            object.body.enable = false;
        }

        return object;
    },

    /**
     * Disables a Body.
     * A disabled Body is ignored by the simulation. It doesn't move or interact with other Bodies.
     *
     * @method Phaser.Physics.Arcade.World#disableBody
     * @since 3.0.0
     *
     * @param {Phaser.Physics.Arcade.Body} body - [description]
     */
    disableBody: function (body)
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

        body.enable = false;
    },

    /**
     * Creates the graphics object responsible for debug display.
     *
     * @method Phaser.Physics.Arcade.World#createDebugGraphic
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
     * Sets the dimensions of the world boundary.
     *
     * @method Phaser.Physics.Arcade.World#setBounds
     * @since 3.0.0
     *
     * @param {number} x - [description]
     * @param {number} y - [description]
     * @param {number} width - [description]
     * @param {number} height - [description]
     * @param {boolean} [checkLeft] - [description]
     * @param {boolean} [checkRight] - [description]
     * @param {boolean} [checkUp] - [description]
     * @param {boolean} [checkDown] - [description]
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
     * Enables or disables collisions on each boundary edge.
     *
     * @method Phaser.Physics.Arcade.World#setBoundsCollision
     * @since 3.0.0
     *
     * @param {boolean} [left=true] - [description]
     * @param {boolean} [right=true] - [description]
     * @param {boolean} [up=true] - [description]
     * @param {boolean} [down=true] - [description]
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
     * @method Phaser.Physics.Arcade.World#pause
     * @fires Phaser.Physics.Arcade.World#pause
     * @since 3.0.0
     *
     * @return {Phaser.Physics.Arcade.World} This World object.
     */
    pause: function ()
    {
        this.isPaused = true;

        this.emit('pause');

        return this;
    },

    /**
     * Resumes the simulation, if paused.
     *
     * @method Phaser.Physics.Arcade.World#resume
     * @fires Phaser.Physics.Arcade.World#resume
     * @since 3.0.0
     *
     * @return {Phaser.Physics.Arcade.World} This World object.
     */
    resume: function ()
    {
        this.isPaused = false;

        this.emit('resume');

        return this;
    },

    /**
     * Adds a collision processor, which runs automatically.
     *
     * @method Phaser.Physics.Arcade.World#addCollider
     * @since 3.0.0
     * @see Phaser.Physics.Arcade.World#collide
     *
     * @param {(Phaser.GameObjects.GameObject|Phaser.GameObjects.GameObject[])} object1 - The first object to check for collision.
     * @param {(Phaser.GameObjects.GameObject|Phaser.GameObjects.GameObject[])} object2 - The second object to check for collision.
     * @param {ArcadePhysicsCallback} [collideCallback] - The callback to invoke when the two objects collide.
     * @param {ArcadePhysicsCallback} [processCallback] - The callback to invoke when the two objects collide. Must return a boolean.
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
     * Adds an overlap processor, which runs automatically.
     *
     * @method Phaser.Physics.Arcade.World#addOverlap
     * @since 3.0.0
     *
     * @param {(Phaser.GameObjects.GameObject|Phaser.GameObjects.GameObject[])} object1 - The first object to check for overlap.
     * @param {(Phaser.GameObjects.GameObject|Phaser.GameObjects.GameObject[])} object2 - The second object to check for overlap.
     * @param {ArcadePhysicsCallback} [collideCallback] - The callback to invoke when the two objects overlap.
     * @param {ArcadePhysicsCallback} [processCallback] - The callback to invoke when the two objects overlap. Must return a boolean.
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
     * Removes a collision or overlap processor.
     *
     * @method Phaser.Physics.Arcade.World#removeCollider
     * @since 3.0.0
     *
     * @param {Phaser.Physics.Arcade.Collider} collider - [description]
     *
     * @return {Phaser.Physics.Arcade.World} This World object.
     */
    removeCollider: function (collider)
    {
        this.colliders.remove(collider);

        return this;
    },

    /**
     * Advances the simulation.
     *
     * @method Phaser.Physics.Arcade.World#update
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

        // this.delta = Math.min(delta / 1000, this.maxStep) * this.timeScale;
        delta /= 1000;

        this.delta = delta;

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

        //  Populate our dynamic collision tree
        this.tree.clear();
        this.tree.load(bodies);

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

        var dynamic = this.bodies;
        var staticBodies = this.staticBodies;
        var pending = this.pendingDestroy;

        var bodies = dynamic.entries;
        var len = bodies.length;

        for (i = 0; i < len; i++)
        {
            body = bodies[i];

            if (body.enable)
            {
                body.postUpdate();
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
     * @param {Phaser.Physics.Arcade.Body} body - [description]
     */
    updateMotion: function (body)
    {
        if (body.allowRotation)
        {
            var velocityDelta = this.computeVelocity(0, body, body.angularVelocity, body.angularAcceleration, body.angularDrag, body.maxAngular) - body.angularVelocity;

            body.angularVelocity += velocityDelta;
            body.rotation += (body.angularVelocity * this.delta);
        }

        body.velocity.x = this.computeVelocity(1, body, body.velocity.x, body.acceleration.x, body.drag.x, body.maxVelocity.x);
        body.velocity.y = this.computeVelocity(2, body, body.velocity.y, body.acceleration.y, body.drag.y, body.maxVelocity.y);
    },

    /**
     * Calculates a Body's per-axis velocity.
     *
     * @method Phaser.Physics.Arcade.World#computeVelocity
     * @since 3.0.0
     *
     * @param {integer} axis - [description]
     * @param {Phaser.Physics.Arcade.Body} body - [description]
     * @param {number} velocity - [description]
     * @param {number} acceleration - [description]
     * @param {number} drag - [description]
     * @param {number} max - [description]
     *
     * @return {number} [description]
     */
    computeVelocity: function (axis, body, velocity, acceleration, drag, max)
    {
        if (max === undefined) { max = 10000; }

        if (axis === 1 && body.allowGravity)
        {
            velocity += (this.gravity.x + body.gravity.x) * this.delta;
        }
        else if (axis === 2 && body.allowGravity)
        {
            velocity += (this.gravity.y + body.gravity.y) * this.delta;
        }

        if (acceleration)
        {
            velocity += acceleration * this.delta;
        }
        else if (drag && body.allowDrag)
        {
            drag *= this.delta;

            if (velocity - drag > 0)
            {
                velocity -= drag;
            }
            else if (velocity + drag < 0)
            {
                velocity += drag;
            }
            else
            {
                velocity = 0;
            }
        }

        if (velocity > max)
        {
            velocity = max;
        }
        else if (velocity < -max)
        {
            velocity = -max;
        }

        return velocity;
    },

    /**
     * Separates two Bodies, when at least one is rectangular.
     *
     * @method Phaser.Physics.Arcade.World#separate
     * @fires Phaser.Physics.Arcade.World#collide
     * @fires Phaser.Physics.Arcade.World#overlap
     * @since 3.0.0
     *
     * @param {Phaser.Physics.Arcade.Body} body1 - [description]
     * @param {Phaser.Physics.Arcade.Body} body2 - [description]
     * @param {ArcadePhysicsCallback} [processCallback] - [description]
     * @param {*} [callbackContext] - [description]
     * @param {boolean} [overlapOnly] - [description]
     *
     * @return {boolean} [description]
     */
    separate: function (body1, body2, processCallback, callbackContext, overlapOnly)
    {
        if (
            !body1.enable ||
            !body2.enable ||
            body1.checkCollision.none ||
            body2.checkCollision.none ||
            !this.intersects(body1, body2))
        {
            return false;
        }

        //  They overlap. Is there a custom process callback? If it returns true then we can carry on, otherwise we should abort.
        if (processCallback && processCallback.call(callbackContext, body1.gameObject, body2.gameObject) === false)
        {
            return false;
        }

        //  Circle vs. Circle quick bail out
        if (body1.isCircle && body2.isCircle)
        {
            return this.separateCircle(body1, body2, overlapOnly);
        }

        // We define the behavior of bodies in a collision circle and rectangle
        // If a collision occurs in the corner points of the rectangle, the body behave like circles

        //  Either body1 or body2 is a circle
        if (body1.isCircle !== body2.isCircle)
        {
            var bodyRect = (body1.isCircle) ? body2 : body1;
            var bodyCircle = (body1.isCircle) ? body1 : body2;

            var rect = {
                x: bodyRect.x,
                y: bodyRect.y,
                right: bodyRect.right,
                bottom: bodyRect.bottom
            };

            var circle = bodyCircle.center;

            if (circle.y < rect.y || circle.y > rect.bottom)
            {
                if (circle.x < rect.x || circle.x > rect.right)
                {
                    return this.separateCircle(body1, body2, overlapOnly);
                }
            }
        }

        var resultX = false;
        var resultY = false;

        //  Do we separate on x or y first?
        if (this.forceX || Math.abs(this.gravity.y + body1.gravity.y) < Math.abs(this.gravity.x + body1.gravity.x))
        {
            resultX = SeparateX(body1, body2, overlapOnly, this.OVERLAP_BIAS);

            //  Are they still intersecting? Let's do the other axis then
            if (this.intersects(body1, body2))
            {
                resultY = SeparateY(body1, body2, overlapOnly, this.OVERLAP_BIAS);
            }
        }
        else
        {
            resultY = SeparateY(body1, body2, overlapOnly, this.OVERLAP_BIAS);

            //  Are they still intersecting? Let's do the other axis then
            if (this.intersects(body1, body2))
            {
                resultX = SeparateX(body1, body2, overlapOnly, this.OVERLAP_BIAS);
            }
        }

        var result = (resultX || resultY);

        if (result)
        {
            if (overlapOnly && (body1.onOverlap || body2.onOverlap))
            {
                this.emit('overlap', body1.gameObject, body2.gameObject, body1, body2);
            }
            else if (body1.onCollide || body2.onCollide)
            {
                this.emit('collide', body1.gameObject, body2.gameObject, body1, body2);
            }
        }

        return result;
    },

    /**
     * Separates two Bodies, when both are circular.
     *
     * @method Phaser.Physics.Arcade.World#separateCircle
     * @fires Phaser.Physics.Arcade.World#collide
     * @fires Phaser.Physics.Arcade.World#overlap
     * @since 3.0.0
     *
     * @param {Phaser.Physics.Arcade.Body} body1 - [description]
     * @param {Phaser.Physics.Arcade.Body} body2 - [description]
     * @param {boolean} overlapOnly - [description]
     * @param {number} bias - [description]
     *
     * @return {boolean} [description]
     */
    separateCircle: function (body1, body2, overlapOnly, bias)
    {
        //  Set the bounding box overlap values into the bodies themselves (hence we don't use the return values here)
        GetOverlapX(body1, body2, false, bias);
        GetOverlapY(body1, body2, false, bias);

        var dx = body2.center.x - body1.center.x;
        var dy = body2.center.y - body1.center.y;

        var angleCollision = Math.atan2(dy, dx);

        var overlap = 0;

        if (body1.isCircle !== body2.isCircle)
        {
            var rect = {
                x: (body2.isCircle) ? body1.position.x : body2.position.x,
                y: (body2.isCircle) ? body1.position.y : body2.position.y,
                right: (body2.isCircle) ? body1.right : body2.right,
                bottom: (body2.isCircle) ? body1.bottom : body2.bottom
            };

            var circle = {
                x: (body1.isCircle) ? body1.center.x : body2.center.x,
                y: (body1.isCircle) ? body1.center.y : body2.center.y,
                radius: (body1.isCircle) ? body1.halfWidth : body2.halfWidth
            };

            if (circle.y < rect.y)
            {
                if (circle.x < rect.x)
                {
                    overlap = DistanceBetween(circle.x, circle.y, rect.x, rect.y) - circle.radius;
                }
                else if (circle.x > rect.right)
                {
                    overlap = DistanceBetween(circle.x, circle.y, rect.right, rect.y) - circle.radius;
                }
            }
            else if (circle.y > rect.bottom)
            {
                if (circle.x < rect.x)
                {
                    overlap = DistanceBetween(circle.x, circle.y, rect.x, rect.bottom) - circle.radius;
                }
                else if (circle.x > rect.right)
                {
                    overlap = DistanceBetween(circle.x, circle.y, rect.right, rect.bottom) - circle.radius;
                }
            }

            overlap *= -1;
        }
        else
        {
            overlap = (body1.halfWidth + body2.halfWidth) - DistanceBetween(body1.center.x, body1.center.y, body2.center.x, body2.center.y);
        }

        //  Can't separate two immovable bodies, or a body with its own custom separation logic
        if (overlapOnly || overlap === 0 || (body1.immovable && body2.immovable) || body1.customSeparateX || body2.customSeparateX)
        {
            if (overlap !== 0 && (body1.onOverlap || body2.onOverlap))
            {
                this.emit('overlap', body1.gameObject, body2.gameObject, body1, body2);
            }

            //  return true if there was some overlap, otherwise false
            return (overlap !== 0);
        }

        // Transform the velocity vector to the coordinate system oriented along the direction of impact.
        // This is done to eliminate the vertical component of the velocity

        var b1vx = body1.velocity.x;
        var b1vy = body1.velocity.y;
        var b1mass = body1.mass;

        var b2vx = body2.velocity.x;
        var b2vy = body2.velocity.y;
        var b2mass = body2.mass;

        var v1 = {
            x: b1vx * Math.cos(angleCollision) + b1vy * Math.sin(angleCollision),
            y: b1vx * Math.sin(angleCollision) - b1vy * Math.cos(angleCollision)
        };

        var v2 = {
            x: b2vx * Math.cos(angleCollision) + b2vy * Math.sin(angleCollision),
            y: b2vx * Math.sin(angleCollision) - b2vy * Math.cos(angleCollision)
        };

        // We expect the new velocity after impact
        var tempVel1 = ((b1mass - b2mass) * v1.x + 2 * b2mass * v2.x) / (b1mass + b2mass);
        var tempVel2 = (2 * b1mass * v1.x + (b2mass - b1mass) * v2.x) / (b1mass + b2mass);

        // We convert the vector to the original coordinate system and multiplied by factor of rebound
        if (!body1.immovable)
        {
            body1.velocity.x = (tempVel1 * Math.cos(angleCollision) - v1.y * Math.sin(angleCollision)) * body1.bounce.x;
            body1.velocity.y = (v1.y * Math.cos(angleCollision) + tempVel1 * Math.sin(angleCollision)) * body1.bounce.y;

            //  Reset local var
            b1vx = body1.velocity.x;
            b1vy = body1.velocity.y;
        }

        if (!body2.immovable)
        {
            body2.velocity.x = (tempVel2 * Math.cos(angleCollision) - v2.y * Math.sin(angleCollision)) * body2.bounce.x;
            body2.velocity.y = (v2.y * Math.cos(angleCollision) + tempVel2 * Math.sin(angleCollision)) * body2.bounce.y;

            //  Reset local var
            b2vx = body2.velocity.x;
            b2vy = body2.velocity.y;
        }

        // When the collision angle is almost perpendicular to the total initial velocity vector
        // (collision on a tangent) vector direction can be determined incorrectly.
        // This code fixes the problem

        if (Math.abs(angleCollision) < Math.PI / 2)
        {
            if ((b1vx > 0) && !body1.immovable && (b2vx > b1vx))
            {
                body1.velocity.x *= -1;
            }
            else if ((b2vx < 0) && !body2.immovable && (b1vx < b2vx))
            {
                body2.velocity.x *= -1;
            }
            else if ((b1vy > 0) && !body1.immovable && (b2vy > b1vy))
            {
                body1.velocity.y *= -1;
            }
            else if ((b2vy < 0) && !body2.immovable && (b1vy < b2vy))
            {
                body2.velocity.y *= -1;
            }
        }
        else if (Math.abs(angleCollision) > Math.PI / 2)
        {
            if ((b1vx < 0) && !body1.immovable && (b2vx < b1vx))
            {
                body1.velocity.x *= -1;
            }
            else if ((b2vx > 0) && !body2.immovable && (b1vx > b2vx))
            {
                body2.velocity.x *= -1;
            }
            else if ((b1vy < 0) && !body1.immovable && (b2vy < b1vy))
            {
                body1.velocity.y *= -1;
            }
            else if ((b2vy > 0) && !body2.immovable && (b1vx > b2vy))
            {
                body2.velocity.y *= -1;
            }
        }

        if (!body1.immovable)
        {
            body1.x += (body1.velocity.x * this.delta) - overlap * Math.cos(angleCollision);
            body1.y += (body1.velocity.y * this.delta) - overlap * Math.sin(angleCollision);
        }

        if (!body2.immovable)
        {
            body2.x += (body2.velocity.x * this.delta) + overlap * Math.cos(angleCollision);
            body2.y += (body2.velocity.y * this.delta) + overlap * Math.sin(angleCollision);
        }

        if (body1.onCollide || body2.onCollide)
        {
            this.emit('collide', body1.gameObject, body2.gameObject, body1, body2);
        }

        return true;
    },

    /**
     * Tests of two bodies intersect (overlap).
     *
     * @method Phaser.Physics.Arcade.World#intersects
     * @since 3.0.0
     *
     * @param {Phaser.Physics.Arcade.Body} body1 - [description]
     * @param {Phaser.Physics.Arcade.Body} body2 - [description]
     *
     * @return {boolean} [description]
     */
    intersects: function (body1, body2)
    {
        if (body1 === body2)
        {
            return false;
        }

        if (body1.isCircle)
        {
            if (body2.isCircle)
            {
                //  Circle vs. Circle
                return DistanceBetween(body1.center.x, body1.center.y, body2.center.x, body2.center.y) <= (body1.halfWidth + body2.halfWidth);
            }
            else
            {
                //  Circle vs. Rect
                return this.circleBodyIntersects(body1, body2);
            }
        }
        else if (body2.isCircle)
        {
            //  Rect vs. Circle
            return this.circleBodyIntersects(body2, body1);
        }
        else
        {
            //  Rect vs. Rect
            if (body1.right <= body2.position.x)
            {
                return false;
            }

            if (body1.bottom <= body2.position.y)
            {
                return false;
            }

            if (body1.position.x >= body2.right)
            {
                return false;
            }

            if (body1.position.y >= body2.bottom)
            {
                return false;
            }

            return true;
        }
    },

    /**
     * Tests if a circular Body intersects with another Body.
     *
     * @method Phaser.Physics.Arcade.World#circleBodyIntersects
     * @since 3.0.0
     *
     * @param {Phaser.Physics.Arcade.Body} circle - [description]
     * @param {Phaser.Physics.Arcade.Body} body - [description]
     *
     * @return {boolean} [description]
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
     * @method Phaser.Physics.Arcade.World#overlap
     * @since 3.0.0
     *
     * @param {Phaser.GameObjects.GameObject} object1 - [description]
     * @param {Phaser.GameObjects.GameObject} object2 - [description]
     * @param {ArcadePhysicsCallback} [overlapCallback] - [description]
     * @param {ArcadePhysicsCallback} [processCallback] - [description]
     * @param {*} [callbackContext] - [description]
     *
     * @return {boolean} True if at least one Game Object overlaps another.
     */
    overlap: function (object1, object2, overlapCallback, processCallback, callbackContext)
    {
        if (overlapCallback === undefined) { overlapCallback = null; }
        if (processCallback === undefined) { processCallback = null; }
        if (callbackContext === undefined) { callbackContext = overlapCallback; }

        return this.collideObjects(object1, object2, overlapCallback, processCallback, callbackContext, true);
    },

    /**
     * Tests if Game Objects overlap and separates them (if possible).
     *
     * @method Phaser.Physics.Arcade.World#collide
     * @since 3.0.0
     *
     * @param {Phaser.GameObjects.GameObject} object1 - [description]
     * @param {Phaser.GameObjects.GameObject} object2 - [description]
     * @param {ArcadePhysicsCallback} [collideCallback] - [description]
     * @param {ArcadePhysicsCallback} [processCallback] - [description]
     * @param {*} [callbackContext] - [description]
     *
     * @return {boolean} True if any overlapping Game Objects were separated.
     */
    collide: function (object1, object2, collideCallback, processCallback, callbackContext)
    {
        if (collideCallback === undefined) { collideCallback = null; }
        if (processCallback === undefined) { processCallback = null; }
        if (callbackContext === undefined) { callbackContext = collideCallback; }

        return this.collideObjects(object1, object2, collideCallback, processCallback, callbackContext, false);
    },

    /**
     * Helper for Phaser.Physics.Arcade.World#collide.
     *
     * @method Phaser.Physics.Arcade.World#collideObjects
     * @since 3.0.0
     *
     * @param {(Phaser.GameObjects.GameObject|Phaser.GameObjects.GameObject[])} object1 - [description]
     * @param {(Phaser.GameObjects.GameObject|Phaser.GameObjects.GameObject[])} object2 - [description]
     * @param {ArcadePhysicsCallback} collideCallback - [description]
     * @param {ArcadePhysicsCallback} processCallback - [description]
     * @param {*} callbackContext - [description]
     * @param {boolean} overlapOnly - [description]
     *
     * @return {boolean} True if any overlapping objects were separated.
     */
    collideObjects: function (object1, object2, collideCallback, processCallback, callbackContext, overlapOnly)
    {
        var i;
        object1 = object1.isParent && typeof(object1.physicsType) === 'undefined' ? object1.children.entries : object1;
        object2 = object2.isParent && typeof(object2.physicsType) === 'undefined' ? object2.children.entries : object2;
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
            for (i = 0; i < object1.length; i++)
            {
                this.collideHandler(object1[i], object2, collideCallback, processCallback, callbackContext, overlapOnly);
            }
        }
        else
        {
            //  They're both arrays
            for (i = 0; i < object1.length; i++)
            {
                for (var j = 0; j < object2.length; j++)
                {
                    this.collideHandler(object1[i], object2[j], collideCallback, processCallback, callbackContext, overlapOnly);
                }
            }
        }

        return (this._total > 0);
    },

    /**
     * Helper for Phaser.Physics.Arcade.World#collide and Phaser.Physics.Arcade.World#overlap.
     *
     * @method Phaser.Physics.Arcade.World#collideHandler
     * @since 3.0.0
     *
     * @param {Phaser.GameObjects.GameObject} object1 - [description]
     * @param {Phaser.GameObjects.GameObject} object2 - [description]
     * @param {ArcadePhysicsCallback} collideCallback - [description]
     * @param {ArcadePhysicsCallback} processCallback - [description]
     * @param {*} callbackContext - [description]
     * @param {boolean} overlapOnly - [description]
     *
     * @return {boolean} [description]
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

        //  A Body
        if (object1.body)
        {
            if (object2.body)
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
            if (object2.body)
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
            if (object2.body)
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
     * Handler for Sprite vs. Sprite collisions.
     *
     * @method Phaser.Physics.Arcade.World#collideSpriteVsSprite
     * @since 3.0.0
     *
     * @param {Phaser.GameObjects.GameObject} sprite1 - [description]
     * @param {Phaser.GameObjects.GameObject} sprite2 - [description]
     * @param {ArcadePhysicsCallback} collideCallback - [description]
     * @param {ArcadePhysicsCallback} processCallback - [description]
     * @param {*} callbackContext - [description]
     * @param {boolean} overlapOnly - [description]
     *
     * @return {boolean} [description]
     */
    collideSpriteVsSprite: function (sprite1, sprite2, collideCallback, processCallback, callbackContext, overlapOnly)
    {
        if (!sprite1.body || !sprite2.body)
        {
            return false;
        }

        if (this.separate(sprite1.body, sprite2.body, processCallback, callbackContext, overlapOnly))
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
     * Handler for Sprite vs. Group collisions.
     *
     * @method Phaser.Physics.Arcade.World#collideSpriteVsGroup
     * @since 3.0.0
     *
     * @param {Phaser.GameObjects.GameObject} sprite - [description]
     * @param {Phaser.GameObjects.Group} group - [description]
     * @param {ArcadePhysicsCallback} collideCallback - [description]
     * @param {ArcadePhysicsCallback} processCallback - [description]
     * @param {*} callbackContext - [description]
     * @param {boolean} overlapOnly - [description]
     *
     * @return {boolean} [description]
     */
    collideSpriteVsGroup: function (sprite, group, collideCallback, processCallback, callbackContext, overlapOnly)
    {
        var bodyA = sprite.body;

        if (group.length === 0 || !bodyA)
        {
            return;
        }

        //  Does sprite collide with anything?

        var minMax = this.treeMinMax;

        minMax.minX = bodyA.left;
        minMax.minY = bodyA.top;
        minMax.maxX = bodyA.right;
        minMax.maxY = bodyA.bottom;

        var results = (group.physicsType === CONST.DYNAMIC_BODY) ? this.tree.search(minMax) : this.staticTree.search(minMax);

        if (results.length === 0)
        {
            return;
        }

        var children = group.getChildren();

        for (var i = 0; i < children.length; i++)
        {
            var bodyB = children[i].body;

            if (!bodyB || bodyA === bodyB || results.indexOf(bodyB) === -1)
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
    },

    /**
     * Helper for Group vs. Tilemap collisions.
     *
     * @method Phaser.Physics.Arcade.World#collideGroupVsTilemapLayer
     * @since 3.0.0
     *
     * @param {Phaser.GameObjects.Group} group - [description]
     * @param {(Phaser.Tilemaps.DynamicTilemapLayer|Phaser.Tilemaps.StaticTilemapLayer)} tilemapLayer - [description]
     * @param {ArcadePhysicsCallback} collideCallback - [description]
     * @param {ArcadePhysicsCallback} processCallback - [description]
     * @param {*} callbackContext - [description]
     * @param {boolean} overlapOnly - [description]
     *
     * @return {boolean} [description]
     */
    collideGroupVsTilemapLayer: function (group, tilemapLayer, collideCallback, processCallback, callbackContext, overlapOnly)
    {
        var children = group.getChildren();

        if (children.length === 0)
        {
            return false;
        }

        var didCollide = false;

        for (var i = 0; i < children.length; i++)
        {
            if (children[i].body)
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
     * Helper for Sprite vs. Tilemap collisions.
     *
     * @method Phaser.Physics.Arcade.World#collideSpriteVsTilemapLayer
     * @fires Phaser.Physics.Arcade.World#collide
     * @fires Phaser.Physics.Arcade.World#overlap
     * @since 3.0.0
     *
     * @param {Phaser.GameObjects.GameObject} sprite - [description]
     * @param {(Phaser.Tilemaps.DynamicTilemapLayer|Phaser.Tilemaps.StaticTilemapLayer)} tilemapLayer - [description]
     * @param {ArcadePhysicsCallback} collideCallback - [description]
     * @param {ArcadePhysicsCallback} processCallback - [description]
     * @param {*} callbackContext - [description]
     * @param {boolean} overlapOnly - [description]
     *
     * @return {boolean} [description]
     */
    collideSpriteVsTilemapLayer: function (sprite, tilemapLayer, collideCallback, processCallback, callbackContext, overlapOnly)
    {
        var body = sprite.body;

        if (!body.enable)
        {
            return false;
        }

        var x = body.position.x;
        var y = body.position.y;
        var w = body.width;
        var h = body.height;

        // TODO: this logic should be encapsulated within the Tilemap API at some point.
        // If the maps base tile size differs from the layer's tile size, we need to adjust the
        // selection area by the difference between the two.
        var layerData = tilemapLayer.layer;

        if (layerData.tileWidth > layerData.baseTileWidth)
        {
            // The x origin of a tile is the left side, so x and width need to be adjusted.
            var xDiff = (layerData.tileWidth - layerData.baseTileWidth) * tilemapLayer.scaleX;
            x -= xDiff;
            w += xDiff;
        }

        if (layerData.tileHeight > layerData.baseTileHeight)
        {
            // The y origin of a tile is the bottom side, so just the height needs to be adjusted.
            var yDiff = (layerData.tileHeight - layerData.baseTileHeight) * tilemapLayer.scaleY;
            h += yDiff;
        }

        var mapData = tilemapLayer.getTilesWithinWorldXY(x, y, w, h);

        if (mapData.length === 0)
        {
            return false;
        }

        var tile;
        var tileWorldRect = { left: 0, right: 0, top: 0, bottom: 0 };

        for (var i = 0; i < mapData.length; i++)
        {
            tile = mapData[i];
            tileWorldRect.left = tilemapLayer.tileToWorldX(tile.x);
            tileWorldRect.top = tilemapLayer.tileToWorldY(tile.y);

            // If the map's base tile size differs from the layer's tile size, only the top of the rect
            // needs to be adjusted since it's origin is (0, 1).
            if (tile.baseHeight !== tile.height)
            {
                tileWorldRect.top -= (tile.height - tile.baseHeight) * tilemapLayer.scaleY;
            }

            tileWorldRect.right = tileWorldRect.left + tile.width * tilemapLayer.scaleX;
            tileWorldRect.bottom = tileWorldRect.top + tile.height * tilemapLayer.scaleY;

            if (TileIntersectsBody(tileWorldRect, body)
                && (!processCallback || processCallback.call(callbackContext, sprite, tile))
                && ProcessTileCallbacks(tile, sprite)
                && (overlapOnly || SeparateTile(i, body, tile, tileWorldRect, tilemapLayer, this.TILE_BIAS)))
            {
                this._total++;

                if (collideCallback)
                {
                    collideCallback.call(callbackContext, sprite, tile);
                }

                if (overlapOnly && body.onOverlap)
                {
                    sprite.emit('overlap', body.gameObject, tile, body, null);
                }
                else if (body.onCollide)
                {
                    sprite.emit('collide', body.gameObject, tile, body, null);
                }
            }
        }
    },

    /**
     * Helper for Group vs. Group collisions.
     *
     * @method Phaser.Physics.Arcade.World#collideGroupVsGroup
     * @since 3.0.0
     *
     * @param {Phaser.GameObjects.Group} group1 - [description]
     * @param {Phaser.GameObjects.Group} group2 - [description]
     * @param {ArcadePhysicsCallback} collideCallback - [description]
     * @param {ArcadePhysicsCallback} processCallback - [description]
     * @param {*} callbackContext - [description]
     * @param {boolean} overlapOnly - [description]
     *
     * @return {boolean} [description]
     */
    collideGroupVsGroup: function (group1, group2, collideCallback, processCallback, callbackContext, overlapOnly)
    {
        if (group1.length === 0 || group2.length === 0)
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
    * @param {*} object - A Game Object, a Group, an object with `x` and `y` coordinates, or an array of such objects.
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
    * @param {Array.<*>} arr
    * @param {number} [padding=0] - An amount added to the boundary.
    */
    wrapArray: function (arr, padding)
    {
        if (arr.length === 0)
        {
            return;
        }

        for (var i = 0, len = arr.length; i < len; i++)
        {
            this.wrapObject(arr[i], padding);
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
        if (padding === undefined)
        {
            padding = 0;
        }

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
    }

});

module.exports = World;
