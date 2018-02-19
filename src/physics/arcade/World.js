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

/**
 * @classdesc
 * [description]
 *
 * @class World
 * @extends EventEmitter
 * @memberOf Phaser.Physics.Arcade
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
         * @name Phaser.Physics.Arcade.World#scene
         * @type {Phaser.Scene}
         * @since 3.0.0
         */
        this.scene = scene;

        /**
         * Dynamic Bodies
         *
         * @name Phaser.Physics.Arcade.World#bodies
         * @type {Phaser.Structs.Set}
         * @since 3.0.0
         */
        this.bodies = new Set();

        /**
         * Static Bodies
         *
         * @name Phaser.Physics.Arcade.World#staticBodies
         * @type {Phaser.Structs.Set}
         * @since 3.0.0
         */
        this.staticBodies = new Set();

        /**
         * Static Bodies
         *
         * @name Phaser.Physics.Arcade.World#pendingDestroy
         * @type {Phaser.Structs.Set}
         * @since 3.1.0
         */
        this.pendingDestroy = new Set();

        /**
         * [description]
         *
         * @name Phaser.Physics.Arcade.World#colliders
         * @type {Phaser.Structs.ProcessQueue}
         * @since 3.0.0
         */
        this.colliders = new ProcessQueue();

        /**
         * [description]
         *
         * @name Phaser.Physics.Arcade.World#gravity
         * @type {Phaser.Math.Vector2}
         * @since 3.0.0
         */
        this.gravity = new Vector2(GetValue(config, 'gravity.x', 0), GetValue(config, 'gravity.y', 0));

        /**
         * [description]
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
         * [description]
         *
         * @name Phaser.Physics.Arcade.World#checkCollision
         * @type {object}
         * @since 3.0.0
         */
        this.checkCollision = {
            up: GetValue(config, 'checkCollision.up', true),
            down: GetValue(config, 'checkCollision.down', true),
            left: GetValue(config, 'checkCollision.left', true),
            right: GetValue(config, 'checkCollision.right', true)
        };

        /**
         * [description]
         *
         * @name Phaser.Physics.Arcade.World#OVERLAP_BIAS
         * @type {number}
         * @default 4
         * @since 3.0.0
         */
        this.OVERLAP_BIAS = GetValue(config, 'overlapBias', 4);

        /**
         * [description]
         *
         * @name Phaser.Physics.Arcade.World#TILE_BIAS
         * @type {number}
         * @default 16
         * @since 3.0.0
         */
        this.TILE_BIAS = GetValue(config, 'tileBias', 16);

        /**
         * [description]
         *
         * @name Phaser.Physics.Arcade.World#forceX
         * @type {boolean}
         * @default false
         * @since 3.0.0
         */
        this.forceX = GetValue(config, 'forceX', false);

        /**
         * [description]
         *
         * @name Phaser.Physics.Arcade.World#isPaused
         * @type {boolean}
         * @default false
         * @since 3.0.0
         */
        this.isPaused = GetValue(config, 'isPaused', false);

        /**
         * [description]
         *
         * @name Phaser.Physics.Arcade.World#_total
         * @type {number}
         * @private
         * @default 0
         * @since 3.0.0
         */
        this._total = 0;

        /**
         * [description]
         *
         * @name Phaser.Physics.Arcade.World#drawDebug
         * @type {boolean}
         * @default false
         * @since 3.0.0
         */
        this.drawDebug = GetValue(config, 'debug', false);

        /**
         * [description]
         *
         * @name Phaser.Physics.Arcade.World#debugGraphic
         * @type {Phaser.GameObjects.Graphics}
         * @since 3.0.0
         */
        this.debugGraphic;

        /**
         * [description]
         *
         * @name Phaser.Physics.Arcade.World#defaults
         * @type {object}
         * @since 3.0.0
         */
        this.defaults = {
            debugShowBody: GetValue(config, 'debugShowBody', true),
            debugShowStaticBody: GetValue(config, 'debugShowStaticBody', true),
            debugShowVelocity: GetValue(config, 'debugShowVelocity', true),
            bodyDebugColor: GetValue(config, 'debugBodyColor', 0xff00ff),
            staticBodyDebugColor: GetValue(config, 'debugBodyColor', 0x0000ff),
            velocityDebugColor: GetValue(config, 'debugVelocityColor', 0x00ff00)
        };

        /**
         * [description]
         *
         * @name Phaser.Physics.Arcade.World#maxEntries
         * @type {integer}
         * @default 16
         * @since 3.0.0
         */
        this.maxEntries = GetValue(config, 'maxEntries', 16);

        /**
         * [description]
         *
         * @name Phaser.Physics.Arcade.World#tree
         * @type {Phaser.Structs.RTree}
         * @since 3.0.0
         */
        this.tree = new RTree(this.maxEntries, [ '.left', '.top', '.right', '.bottom' ]);

        /**
         * [description]
         *
         * @name Phaser.Physics.Arcade.World#staticTree
         * @type {Phaser.Structs.RTree}
         * @since 3.0.0
         */
        this.staticTree = new RTree(this.maxEntries, [ '.left', '.top', '.right', '.bottom' ]);

        /**
         * [description]
         *
         * @name Phaser.Physics.Arcade.World#treeMinMax
         * @type {object}
         * @since 3.0.0
         */
        this.treeMinMax = { minX: 0, minY: 0, maxX: 0, maxY: 0 };

        if (this.drawDebug)
        {
            this.createDebugGraphic();
        }
    },

    /**
     * [description]
     *
     * @method Phaser.Physics.Arcade.World#enable
     * @since 3.0.0
     *
     * @param {Phaser.GameObjects.GameObject|Phaser.GameObjects.GameObject[]} object - [description]
     * @param {integer} [type] - [description]
     */
    enable: function (object, type)
    {
        if (type === undefined) { type = CONST.DYNAMIC_BODY; }

        var i = 1;

        if (Array.isArray(object))
        {
            i = object.length;

            while (i--)
            {
                if (object[i].hasOwnProperty('children'))
                {
                    //  If it's a Group then we do it on the children regardless
                    this.enable(object[i].children.entries, type);
                }
                else
                {
                    this.enableBody(object[i], type);
                }
            }
        }
        else if (object.hasOwnProperty('children'))
        {
            //  If it's a Group then we do it on the children regardless
            this.enable(object.children.entries, type);
        }
        else
        {
            this.enableBody(object, type);
        }
    },

    /**
     * [description]
     *
     * @method Phaser.Physics.Arcade.World#enableBody
     * @since 3.0.0
     *
     * @param {Phaser.GameObjects.GameObject} object - [description]
     * @param {integer} type - [description]
     *
     * @return {Phaser.GameObjects.GameObject} [description]
     */
    enableBody: function (object, type)
    {
        if (object.body === null)
        {
            if (type === CONST.DYNAMIC_BODY)
            {
                object.body = new Body(this, object);

                this.bodies.set(object.body);
            }
            else if (type === CONST.STATIC_BODY)
            {
                object.body = new StaticBody(this, object);

                this.staticBodies.set(object.body);

                this.staticTree.insert(object.body);
            }
        }

        return object;
    },

    /**
     * [description]
     *
     * @method Phaser.Physics.Arcade.World#remove
     * @since 3.0.0
     *
     * @param {Phaser.GameObjects.GameObject} object - [description]
     */
    remove: function (object)
    {
        this.disableBody(object);
    },

    /**
     * [description]
     *
     * @method Phaser.Physics.Arcade.World#disable
     * @since 3.0.0
     *
     * @param {Phaser.GameObjects.GameObject|Phaser.GameObjects.GameObject[]} object - [description]
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
     * [description]
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
     * [description]
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
     * [description]
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
     * [description]
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
     * [description]
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
     * [description]
     *
     * @method Phaser.Physics.Arcade.World#pause
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
     * [description]
     *
     * @method Phaser.Physics.Arcade.World#resume
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
     * [description]
     *
     * @method Phaser.Physics.Arcade.World#addCollider
     * @since 3.0.0
     *
     * @param {Phaser.Physics.Arcade.Body} object1 - The first object to check for collision.
     * @param {Phaser.Physics.Arcade.Body} object2 - The second object to check for collision.
     * @param {function} collideCallback - The callback to invoke when the two objects collide.
     * @param {function} processCallback - The callback to invoke when the two objects collide. Must return a boolean.
     * @param {object} callbackContext - The scope in which to call the callbacks.
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
     * [description]
     *
     * @method Phaser.Physics.Arcade.World#addOverlap
     * @since 3.0.0
     *
     * @param {Phaser.Physics.Arcade.Body} object1 - The first object to check for overlap.
     * @param {Phaser.Physics.Arcade.Body} object2 - The second object to check for overlap.
     * @param {function} collideCallback - The callback to invoke when the two objects overlap.
     * @param {function} processCallback - The callback to invoke when the two objects overlap. Must return a boolean.
     * @param {object} callbackContext - The scope in which to call the callbacks.
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
     * [description]
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
     * [description]
     *
     * @method Phaser.Physics.Arcade.World#update
     * @since 3.0.0
     *
     * @param {number} time - [description]
     * @param {number} delta - [description]
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
     * [description]
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
     * [description]
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
     * [description]
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
     * [description]
     *
     * @method Phaser.Physics.Arcade.World#separate
     * @since 3.0.0
     *
     * @param {Phaser.Physics.Arcade.Body} body1 - [description]
     * @param {Phaser.Physics.Arcade.Body} body2 - [description]
     * @param {function} processCallback - [description]
     * @param {object} callbackContext - [description]
     * @param {boolean} overlapOnly - [description]
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
     * [description]
     *
     * @method Phaser.Physics.Arcade.World#separateCircle
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
     * [description]
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
     * [description]
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
     * [description]
     *
     * @method Phaser.Physics.Arcade.World#overlap
     * @since 3.0.0
     *
     * @param {Phaser.GameObjects.GameObject} object1 - [description]
     * @param {Phaser.GameObjects.GameObject} object2 - [description]
     * @param {function} overlapCallback - [description]
     * @param {function} processCallback - [description]
     * @param {object} callbackContext - [description]
     *
     * @return {boolean} [description]
     */
    overlap: function (object1, object2, overlapCallback, processCallback, callbackContext)
    {
        if (overlapCallback === undefined) { overlapCallback = null; }
        if (processCallback === undefined) { processCallback = null; }
        if (callbackContext === undefined) { callbackContext = overlapCallback; }

        return this.collideObjects(object1, object2, overlapCallback, processCallback, callbackContext, true);
    },

    /**
     * [description]
     *
     * @method Phaser.Physics.Arcade.World#collide
     * @since 3.0.0
     *
     * @param {Phaser.GameObjects.GameObject} object1 - [description]
     * @param {Phaser.GameObjects.GameObject} object2 - [description]
     * @param {function} collideCallback - [description]
     * @param {function} processCallback - [description]
     * @param {object} callbackContext - [description]
     *
     * @return {boolean} [description]
     */
    collide: function (object1, object2, collideCallback, processCallback, callbackContext)
    {
        if (collideCallback === undefined) { collideCallback = null; }
        if (processCallback === undefined) { processCallback = null; }
        if (callbackContext === undefined) { callbackContext = collideCallback; }

        return this.collideObjects(object1, object2, collideCallback, processCallback, callbackContext, false);
    },

    /**
     * [description]
     *
     * @method Phaser.Physics.Arcade.World#collideObjects
     * @since 3.0.0
     *
     * @param {Phaser.GameObjects.GameObject} object1 - [description]
     * @param {Phaser.GameObjects.GameObject} object2 - [description]
     * @param {function} collideCallback - [description]
     * @param {function} processCallback - [description]
     * @param {object} callbackContext - [description]
     * @param {boolean} overlapOnly - [description]
     *
     * @return {boolean} [description]
     */
    collideObjects: function (object1, object2, collideCallback, processCallback, callbackContext, overlapOnly)
    {
        var i;
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
     * [description]
     *
     * @method Phaser.Physics.Arcade.World#collideHandler
     * @since 3.0.0
     *
     * @param {Phaser.GameObjects.GameObject} object1 - [description]
     * @param {Phaser.GameObjects.GameObject} object2 - [description]
     * @param {function} collideCallback - [description]
     * @param {function} processCallback - [description]
     * @param {object} callbackContext - [description]
     * @param {boolean} overlapOnly - [description]
     *
     * @return {boolean} [description]
     */
    collideHandler: function (object1, object2, collideCallback, processCallback, callbackContext, overlapOnly)
    {
        //  Only collide valid objects
        if (object2 === undefined && object1.isParent)
        {
            return this.collideGroupVsSelf(object1, collideCallback, processCallback, callbackContext, overlapOnly);
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
     * [description]
     *
     * @method Phaser.Physics.Arcade.World#collideSpriteVsSprite
     * @since 3.0.0
     *
     * @param {Phaser.GameObjects.GameObject} sprite1 - [description]
     * @param {Phaser.GameObjects.GameObject} sprite2 - [description]
     * @param {function} collideCallback - [description]
     * @param {function} processCallback - [description]
     * @param {object} callbackContext - [description]
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
     * [description]
     *
     * @method Phaser.Physics.Arcade.World#collideSpriteVsGroup
     * @since 3.0.0
     *
     * @param {Phaser.GameObjects.GameObject} sprite - [description]
     * @param {Phaser.GameObjects.Group} group - [description]
     * @param {function} collideCallback - [description]
     * @param {function} processCallback - [description]
     * @param {object} callbackContext - [description]
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
     * [description]
     *
     * @method Phaser.Physics.Arcade.World#collideGroupVsTilemapLayer
     * @since 3.0.0
     *
     * @param {Phaser.GameObjects.Group} group - [description]
     * @param {[type]} tilemapLayer - [description]
     * @param {function} collideCallback - [description]
     * @param {function} processCallback - [description]
     * @param {object} callbackContext - [description]
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
     * [description]
     *
     * @method Phaser.Physics.Arcade.World#collideSpriteVsTilemapLayer
     * @since 3.0.0
     *
     * @param {Phaser.GameObjects.GameObject} sprite - [description]
     * @param {[type]} tilemapLayer - [description]
     * @param {function} collideCallback - [description]
     * @param {function} processCallback - [description]
     * @param {object} callbackContext - [description]
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
     * TODO!
     *
     * @method Phaser.Physics.Arcade.World#collideGroupVsGroup
     * @since 3.0.0
     *
     * @param {Phaser.GameObjects.Group} group1 - [description]
     * @param {Phaser.GameObjects.Group} group2 - [description]
     * @param {function} collideCallback - [description]
     * @param {function} processCallback - [description]
     * @param {object} callbackContext - [description]
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
     * [description]
     *
     * @method Phaser.Physics.Arcade.World#shutdown
     * @since 3.0.0
     */
    shutdown: function ()
    {
        this.removeAllListeners();
    },

    /**
     * [description]
     *
     * @method Phaser.Physics.Arcade.World#destroy
     * @since 3.0.0
     */
    destroy: function ()
    {
        this.tree.clear();
        this.staticTree.clear();
        this.bodies.clear();
        this.staticBodies.clear();
        this.colliders.destroy();

        this.removeAllListeners();
    }

});

module.exports = World;
