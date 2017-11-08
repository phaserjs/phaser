//  Phaser.Physics.Arcade.Body

var CircleContains = require('../../geom/circle/Contains');
var Class = require('../../utils/Class');
var CONST = require('./const');
// var DegToRad = require('../../math/DegToRad');
// var RadToDeg = require('../../math/RadToDeg');
var Rectangle = require('../../geom/rectangle/Rectangle');
var RectangleContains = require('../../geom/rectangle/Contains');
var Vector2 = require('../../math/Vector2');

var Body = new Class({

    initialize:

    function Body (world, gameObject)
    {
        this.world = world;

        this.gameObject = gameObject;

        this.debugShowBody = world.defaults.debugShowBody;
        this.debugShowVelocity = world.defaults.debugShowVelocity;
        this.debugBodyColor = world.defaults.bodyDebugColor;

        this.enable = true;

        this.isCircle = false;

        this.radius = 0;

        this.offset = new Vector2();

        this.position = new Vector2(gameObject.x, gameObject.y);

        this.prev = new Vector2(this.position.x, this.position.y);

        this.allowRotation = true;

        this.rotation = gameObject.angle;

        this.preRotation = gameObject.angle;

        this.width = gameObject.width;

        this.height = gameObject.height;

        this.sourceWidth = gameObject.width;

        this.sourceHeight = gameObject.height;

        if (gameObject.frame)
        {
            this.sourceWidth = gameObject.frame.realWidth;
            this.sourceHeight = gameObject.frame.realHeight;
        }

        this.halfWidth = Math.abs(gameObject.width / 2);

        this.halfHeight = Math.abs(gameObject.height / 2);

        this.center = new Vector2(gameObject.x + this.halfWidth, gameObject.y + this.halfHeight);

        this.velocity = new Vector2();

        this.newVelocity = new Vector2();

        this.deltaMax = new Vector2();

        this.acceleration = new Vector2();

        this.allowDrag = true;

        this.drag = new Vector2();

        this.allowGravity = true;

        this.gravity = new Vector2();

        this.bounce = new Vector2();

        this.worldBounce = null;

        // this.onWorldBounds = null;
        // this.onCollide = null;
        // this.onOverlap = null;

        this.maxVelocity = new Vector2(10000, 10000);

        this.friction = new Vector2(1, 0);

        this.angularVelocity = 0;

        this.angularAcceleration = 0;

        this.angularDrag = 0;

        this.maxAngular = 1000;

        this.mass = 1;

        this.angle = 0;

        this.speed = 0;

        this.facing = CONST.FACING_NONE;

        this.immovable = false;

        this.moves = true;

        this.customSeparateX = false;

        this.customSeparateY = false;

        this.overlapX = 0;

        this.overlapY = 0;

        this.overlapR = 0;

        this.embedded = false;

        this.collideWorldBounds = false;

        this.checkCollision = { none: false, up: true, down: true, left: true, right: true };

        this.touching = { none: true, up: false, down: false, left: false, right: false };

        this.wasTouching = { none: true, up: false, down: false, left: false, right: false };

        this.blocked = { none: true, up: false, down: false, left: false, right: false };

        this.tilePadding = new Vector2();

        this.dirty = false;

        this.skipQuadTree = false;

        this.syncBounds = false;

        this.isMoving = false;

        this.stopVelocityOnCollide = true;

        // this.moveTimer = 0;
        // this.moveDistance = 0;
        // this.moveDuration = 0;
        // this.moveTarget = null;
        // this.moveEnd = null;
        // this.onMoveComplete = new Phaser.Signal();
        // this.movementCallback = null;
        // this.movementCallbackContext = null;

        this._reset = true;

        this._sx = gameObject.scaleX;
        this._sy = gameObject.scaleY;

        this._dx = 0;
        this._dy = 0;

        this._bounds = new Rectangle();
    },

    updateBounds: function ()
    {
        var sprite = this.gameObject;

        if (this.syncBounds)
        {
            var b = sprite.getBounds(this._bounds);

            // b.ceilAll();

            if (b.width !== this.width || b.height !== this.height)
            {
                this.width = b.width;
                this.height = b.height;
                this._reset = true;
            }
        }
        else
        {
            var asx = Math.abs(sprite.scaleX);
            var asy = Math.abs(sprite.scaleY);

            if (asx !== this._sx || asy !== this._sy)
            {
                this.width = this.sourceWidth * asx;
                this.height = this.sourceHeight * asy;
                this._sx = asx;
                this._sy = asy;
                this._reset = true;
            }
        }

        if (this._reset)
        {
            this.halfWidth = Math.floor(this.width / 2);
            this.halfHeight = Math.floor(this.height / 2);
            this.updateCenter();
        }
    },

    updateCenter: function ()
    {
        this.center.set(this.position.x + this.halfWidth, this.position.y + this.halfHeight);
    },

    update: function (delta)
    {
        this.dirty = true;

        //  Store and reset collision flags
        this.wasTouching.none = this.touching.none;
        this.wasTouching.up = this.touching.up;
        this.wasTouching.down = this.touching.down;
        this.wasTouching.left = this.touching.left;
        this.wasTouching.right = this.touching.right;

        this.touching.none = true;
        this.touching.up = false;
        this.touching.down = false;
        this.touching.left = false;
        this.touching.right = false;

        this.blocked.none = true;
        this.blocked.up = false;
        this.blocked.down = false;
        this.blocked.left = false;
        this.blocked.right = false;

        this.overlapR = 0;
        this.overlapX = 0;
        this.overlapY = 0;

        this.embedded = false;

        this.updateBounds();

        var sprite = this.gameObject;

        this.position.x = sprite.x - sprite.displayOriginX + (sprite.scaleX * this.offset.x);
        this.position.y = sprite.y - sprite.displayOriginY + (sprite.scaleY * this.offset.y);

        // this.position.x -= this.sprite.scale.x < 0 ? this.width : 0;
        // this.position.y -= this.sprite.scale.y < 0 ? this.height : 0;

        // this.position.x = sprite.x + (sprite.scaleX * this.offset.x);
        // this.position.y = sprite.y + (sprite.scaleY * this.offset.y);

        this.updateCenter();

        this.rotation = sprite.angle;

        this.preRotation = this.rotation;

        if (this._reset)
        {
            this.prev.x = this.position.x;
            this.prev.y = this.position.y;
        }

        if (this.moves)
        {
            this.world.updateMotion(this);

            this.newVelocity.set(this.velocity.x * delta, this.velocity.y * delta);

            this.position.x += this.newVelocity.x;
            this.position.y += this.newVelocity.y;

            this.updateCenter();

            if (this.position.x !== this.prev.x || this.position.y !== this.prev.y)
            {
                this.angle = Math.atan2(this.velocity.y, this.velocity.x);
            }

            this.speed = Math.sqrt(this.velocity.x * this.velocity.x + this.velocity.y * this.velocity.y);

            //  Now the State update will throw collision checks at the Body
            //  And finally we'll integrate the new position back to the Sprite in postUpdate

            if (this.collideWorldBounds)
            {
                this.checkWorldBounds();

                // if (this.checkWorldBounds() && this.onWorldBounds)
                // {
                    // this.onWorldBounds.dispatch(this.sprite, this.blocked.up, this.blocked.down, this.blocked.left, this.blocked.right);
                // }
            }
        }

        this._dx = this.deltaX();
        this._dy = this.deltaY();

        this._reset = false;
    },

    //  Feeds the body results back into the parent gameobject (if there is one)
    postUpdate: function ()
    {
        //  Only allow postUpdate to be called once per frame
        if (!this.enable || !this.dirty)
        {
            return;
        }

        this.dirty = false;

        if (this.deltaX() < 0)
        {
            this.facing = CONST.FACING_LEFT;
        }
        else if (this.deltaX() > 0)
        {
            this.facing = CONST.FACING_RIGHT;
        }

        if (this.deltaY() < 0)
        {
            this.facing = CONST.FACING_UP;
        }
        else if (this.deltaY() > 0)
        {
            this.facing = CONST.FACING_DOWN;
        }

        if (this.moves)
        {
            this._dx = this.deltaX();
            this._dy = this.deltaY();

            if (this.deltaMax.x !== 0 && this._dx !== 0)
            {
                if (this._dx < 0 && this._dx < -this.deltaMax.x)
                {
                    this._dx = -this.deltaMax.x;
                }
                else if (this._dx > 0 && this._dx > this.deltaMax.x)
                {
                    this._dx = this.deltaMax.x;
                }
            }

            if (this.deltaMax.y !== 0 && this._dy !== 0)
            {
                if (this._dy < 0 && this._dy < -this.deltaMax.y)
                {
                    this._dy = -this.deltaMax.y;
                }
                else if (this._dy > 0 && this._dy > this.deltaMax.y)
                {
                    this._dy = this.deltaMax.y;
                }
            }

            this.gameObject.x += this._dx;
            this.gameObject.y += this._dy;

            this._reset = true;
        }

        this.updateCenter();

        if (this.allowRotation)
        {
            this.gameObject.angle += this.deltaZ();
        }

        this.prev.x = this.position.x;
        this.prev.y = this.position.y;
    },

    checkWorldBounds: function ()
    {
        var pos = this.position;
        var bounds = this.world.bounds;
        var check = this.world.checkCollision;

        var bx = (this.worldBounce) ? -this.worldBounce.x : -this.bounce.x;
        var by = (this.worldBounce) ? -this.worldBounce.y : -this.bounce.y;

        if (pos.x < bounds.x && check.left)
        {
            pos.x = bounds.x;
            this.velocity.x *= bx;
            this.blocked.left = true;
            this.blocked.none = false;
        }
        else if (this.right > bounds.right && check.right)
        {
            pos.x = bounds.right - this.width;
            this.velocity.x *= bx;
            this.blocked.right = true;
            this.blocked.none = false;
        }

        if (pos.y < bounds.y && check.up)
        {
            pos.y = bounds.y;
            this.velocity.y *= by;
            this.blocked.up = true;
            this.blocked.none = false;
        }
        else if (this.bottom > bounds.bottom && check.down)
        {
            pos.y = bounds.bottom - this.height;
            this.velocity.y *= by;
            this.blocked.down = true;
            this.blocked.none = false;
        }

        return !this.blocked.none;
    },

    setSize: function (width, height, offsetX, offsetY)
    {
        if (offsetX === undefined) { offsetX = this.offset.x; }
        if (offsetY === undefined) { offsetY = this.offset.y; }

        this.sourceWidth = width;
        this.sourceHeight = height;
        this.width = this.sourceWidth * this._sx;
        this.height = this.sourceHeight * this._sy;
        this.halfWidth = Math.floor(this.width / 2);
        this.halfHeight = Math.floor(this.height / 2);
        this.offset.set(offsetX, offsetY);

        this.updateCenter();

        this.isCircle = false;
        this.radius = 0;

        return this;
    },

    setCircle: function (radius, offsetX, offsetY)
    {
        if (offsetX === undefined) { offsetX = this.offset.x; }
        if (offsetY === undefined) { offsetY = this.offset.y; }

        if (radius > 0)
        {
            this.isCircle = true;
            this.radius = radius;

            this.sourceWidth = radius * 2;
            this.sourceHeight = radius * 2;

            this.width = this.sourceWidth * this._sx;
            this.height = this.sourceHeight * this._sy;

            this.halfWidth = Math.floor(this.width / 2);
            this.halfHeight = Math.floor(this.height / 2);

            this.offset.set(offsetX, offsetY);

            this.updateCenter();
        }
        else
        {
            this.isCircle = false;
        }

        return this;
    },

    reset: function (x, y)
    {
        this.stop();

        var sprite = this.gameObject;

        this.position.x = x + (sprite.scaleX * this.offset.x);
        this.position.y = y + (sprite.scaleY * this.offset.y);

        // this.position.x = (x - (this.sprite.anchor.x * this.sprite.width)) + this.sprite.scale.x * this.offset.x;
        // this.position.x -= this.sprite.scale.x < 0 ? this.width : 0;

        // this.position.y = (y - (this.sprite.anchor.y * this.sprite.height)) + this.sprite.scale.y * this.offset.y;
        // this.position.y -= this.sprite.scale.y < 0 ? this.height : 0;

        this.prev.x = this.position.x;
        this.prev.y = this.position.y;

        this.rotation = this.gameObject.angle;
        this.preRotation = this.rotation;

        this.updateBounds();
        this.updateCenter();
    },

    stop: function ()
    {
        this.velocity.set(0);
        this.acceleration.set(0);
        this.speed = 0;
        this.angularVelocity = 0;
        this.angularAcceleration = 0;

        return this;
    },

    getBounds: function (obj)
    {
        obj.x = this.x;
        obj.y = this.y;
        obj.right = this.right;
        obj.bottom = this.bottom;

        return obj;
    },

    hitTest: function (x, y)
    {
        return (this.isCircle) ? CircleContains(this, x, y) : RectangleContains(this, x, y);
    },

    onFloor: function ()
    {
        return this.blocked.down;
    },

    onCeiling: function ()
    {
        return this.blocked.up;
    },

    onWall: function ()
    {
        return (this.blocked.left || this.blocked.right);
    },

    deltaAbsX: function ()
    {
        return (this.deltaX() > 0) ? this.deltaX() : -this.deltaX();
    },

    deltaAbsY: function ()
    {
        return (this.deltaY() > 0) ? this.deltaY() : -this.deltaY();
    },

    deltaX: function ()
    {
        return this.position.x - this.prev.x;
    },

    deltaY: function ()
    {
        return this.position.y - this.prev.y;
    },

    deltaZ: function ()
    {
        return this.rotation - this.preRotation;
    },

    destroy: function ()
    {
        this.gameObject.body = null;
        this.gameObject = null;
    },

    drawDebug: function (graphic)
    {
        var pos = this.position;

        if (this.debugShowBody)
        {
            graphic.lineStyle(1, this.debugBodyColor, 1);
            graphic.strokeRect(pos.x, pos.y, this.width, this.height);
        }

        if (this.debugShowVelocity)
        {
            var x = pos.x + this.halfWidth;
            var y = pos.y + this.halfHeight;

            graphic.lineStyle(1, this.world.defaults.velocityDebugColor, 1);
            graphic.lineBetween(x, y, x + this.velocity.x, y + this.velocity.y);
        }
    },

    willDrawDebug: function ()
    {
        return (this.debugShowBody || this.debugShowVelocity);
    },

    x: {

        get: function ()
        {
            return this.position.x;
        },

        set: function (value)
        {
            this.position.x = value;
        }

    },

    y: {

        get: function ()
        {
            return this.position.y;
        },

        set: function (value)
        {
            this.position.y = value;
        }

    },

    left: {

        get: function ()
        {
            return this.position.x;
        }

    },

    right: {

        get: function ()
        {
            return this.position.x + this.width;
        }

    },

    top: {

        get: function ()
        {
            return this.position.y;
        }

    },

    bottom: {

        get: function ()
        {
            return this.position.y + this.height;
        }

    }

});

module.exports = Body;
