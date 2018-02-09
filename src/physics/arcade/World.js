var Body = require('./Body');
var Clamp = require('../../math/Clamp');
var Class = require('../../utils/Class');
var Collider = require('./Collider');
var CONST = require('./const');
var DistanceBetween = require('../../math/distance/DistanceBetween');
var EventEmitter = require('eventemitter3');
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

//  Phaser.Physics.Arcade.World

var World = new Class({

    Extends: EventEmitter,

    initialize:

    function World (scene, config)
    {
        EventEmitter.call(this);

        this.scene = scene;

        //  Dynamic Bodies
        this.bodies = new Set();

        //  Static Bodies
        this.staticBodies = new Set();

        this.colliders = new ProcessQueue();

        this.gravity = new Vector2(GetValue(config, 'gravity.x', 0), GetValue(config, 'gravity.y', 0));

        this.bounds = new Rectangle(
            GetValue(config, 'x', 0),
            GetValue(config, 'y', 0),
            GetValue(config, 'width', scene.sys.game.config.width),
            GetValue(config, 'height', scene.sys.game.config.height)
        );

        this.checkCollision = {
            up: GetValue(config, 'checkCollision.up', true),
            down: GetValue(config, 'checkCollision.down', true),
            left: GetValue(config, 'checkCollision.left', true),
            right: GetValue(config, 'checkCollision.right', true)
        };

        this.OVERLAP_BIAS = GetValue(config, 'overlapBias', 4);

        this.TILE_BIAS = GetValue(config, 'tileBias', 16);

        this.forceX = GetValue(config, 'forceX', false);

        this.isPaused = GetValue(config, 'isPaused', false);

        this._total = 0;

        this.drawDebug = GetValue(config, 'debug', false);

        this.debugGraphic;

        this.defaults = {
            debugShowBody: GetValue(config, 'debugShowBody', true),
            debugShowStaticBody: GetValue(config, 'debugShowStaticBody', true),
            debugShowVelocity: GetValue(config, 'debugShowVelocity', true),
            bodyDebugColor: GetValue(config, 'debugBodyColor', 0xff00ff),
            staticBodyDebugColor: GetValue(config, 'debugBodyColor', 0x0000ff),
            velocityDebugColor: GetValue(config, 'debugVelocityColor', 0x00ff00)
        };

        this.maxEntries = GetValue(config, 'maxEntries', 16);

        this.tree = new RTree(this.maxEntries, [ '.left', '.top', '.right', '.bottom' ]);
        this.staticTree = new RTree(this.maxEntries, [ '.left', '.top', '.right', '.bottom' ]);

        this.treeMinMax = { minX: 0, minY: 0, maxX: 0, maxY: 0 };

        if (this.drawDebug)
        {
            this.createDebugGraphic();
        }
    },

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

    remove: function (object)
    {
        this.disableBody(object);
    },

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
                    this.disableBody(object[i]);
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
            this.disableBody(object);
        }
    },

    disableBody: function (object)
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

            object.body.destroy();
            object.body = null;
        }

        return object;
    },

    createDebugGraphic: function ()
    {
        var graphic = this.scene.sys.add.graphics({ x: 0, y: 0 });

        graphic.setZ(Number.MAX_VALUE);

        this.debugGraphic = graphic;

        this.drawDebug = true;

        return graphic;
    },

    setBounds: function (x, y, width, height, checkLeft, checkRight, checkUp, checkDown)
    {
        this.bounds.setTo(x, y, width, height);

        if (checkLeft !== undefined)
        {
            this.setBoundsCollision(checkLeft, checkRight, checkUp, checkDown);
        }

        return this;
    },

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

    pause: function ()
    {
        this.isPaused = true;

        this.emit('pause');

        return this;
    },

    resume: function ()
    {
        this.isPaused = false;

        this.emit('resume');

        return this;
    },

    addCollider: function (object1, object2, collideCallback, processCallback, callbackContext)
    {
        if (collideCallback === undefined) { collideCallback = null; }
        if (processCallback === undefined) { processCallback = null; }
        if (callbackContext === undefined) { callbackContext = collideCallback; }

        var collider = new Collider(this, false, object1, object2, collideCallback, processCallback, callbackContext);

        this.colliders.add(collider);

        return collider;
    },

    addOverlap: function (object1, object2, collideCallback, processCallback, callbackContext)
    {
        if (collideCallback === undefined) { collideCallback = null; }
        if (processCallback === undefined) { processCallback = null; }
        if (callbackContext === undefined) { callbackContext = collideCallback; }

        var collider = new Collider(this, true, object1, object2, collideCallback, processCallback, callbackContext);

        this.colliders.add(collider);

        return collider;
    },

    removeCollider: function (collider)
    {
        this.colliders.remove(collider);
    },

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

    postUpdate: function ()
    {
        var i;
        var body;
        var bodies = this.bodies.entries;
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

            bodies = this.staticBodies.entries;
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
    },

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

    circleBodyIntersects: function (circle, body)
    {
        var x = Clamp(circle.center.x, body.left, body.right);
        var y = Clamp(circle.center.y, body.top, body.bottom);

        var dx = (circle.center.x - x) * (circle.center.x - x);
        var dy = (circle.center.y - y) * (circle.center.y - y);

        return (dx + dy) <= (circle.halfWidth * circle.halfWidth);
    },

    overlap: function (object1, object2, overlapCallback, processCallback, callbackContext)
    {
        if (overlapCallback === undefined) { overlapCallback = null; }
        if (processCallback === undefined) { processCallback = null; }
        if (callbackContext === undefined) { callbackContext = overlapCallback; }

        return this.collideObjects(object1, object2, overlapCallback, processCallback, callbackContext, true);
    },

    collide: function (object1, object2, collideCallback, processCallback, callbackContext)
    {
        if (collideCallback === undefined) { collideCallback = null; }
        if (processCallback === undefined) { processCallback = null; }
        if (callbackContext === undefined) { callbackContext = collideCallback; }

        return this.collideObjects(object1, object2, collideCallback, processCallback, callbackContext, false);
    },

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

    collideSpriteVsGroup: function (sprite, group, collideCallback, processCallback, callbackContext, overlapOnly)
    {
        if (group.length === 0)
        {
            return;
        }

        var bodyA = sprite.body;

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
                if (this.collideSpriteVsTilemapLayer(children[i], tilemapLayer, collideCallback, processCallback, callbackContext, overlapOnly)) {
                    didCollide = true;
                }
            }
        }

        return didCollide;
    },

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

    //  TODO
    collideGroupVsGroup: function (group1, group2, collideCallback, processCallback, callbackContext, overlapOnly)
    {
        if (group1.length === 0 || group2.length === 0)
        {
            return;
        }
    },

    shutdown: function ()
    {
        this.removeAllListeners();
    },

    destroy: function ()
    {
        this.removeAllListeners();
    }

});

module.exports = World;
