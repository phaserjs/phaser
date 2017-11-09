//  Phaser.Physics.Arcade.StaticBody

var CircleContains = require('../../geom/circle/Contains');
var Class = require('../../utils/Class');
var CONST = require('./const');
var Rectangle = require('../../geom/rectangle/Rectangle');
var RectangleContains = require('../../geom/rectangle/Contains');
var Vector2 = require('../../math/Vector2');

var StaticBody = new Class({

    initialize:

    function StaticBody (world, gameObject)
    {
        this.world = world;

        this.gameObject = gameObject;

        this.debugShowBody = world.defaults.debugShowBody;
        this.debugBodyColor = world.defaults.bodyDebugColor;

        this.enable = true;

        this.isCircle = false;

        this.radius = 0;

        this.offset = new Vector2();

        this.position = new Vector2(gameObject.x - gameObject.displayOriginX, gameObject.y - gameObject.displayOriginY);

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

        this.allowGravity = false;

        this.gravity = new Vector2();

        this.bounce = new Vector2();

        //  If true this Body will dispatch events
        this.onWorldBounds = false;
        this.onCollide = false;
        this.onOverlap = false;

        this.mass = 1;

        this.immovable = true;

        this.moves = false;

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

        // this.tilePadding = new Vector2();
        // this.dirty = false;
        // this.isMoving = false;
        // this.stopVelocityOnCollide = true;

        //  read-only
        this.physicsType = CONST.STATIC_BODY;

        this._sx = gameObject.scaleX;
        this._sy = gameObject.scaleY;

        this._bounds = new Rectangle();
    },

    setSize: function (width, height, offsetX, offsetY)
    {
        if (offsetX === undefined) { offsetX = this.offset.x; }
        if (offsetY === undefined) { offsetY = this.offset.y; }

        this.world.staticTree.remove(this);

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

        this.world.staticTree.insert(this);

        return this;
    },

    setCircle: function (radius, offsetX, offsetY)
    {
        if (offsetX === undefined) { offsetX = this.offset.x; }
        if (offsetY === undefined) { offsetY = this.offset.y; }

        if (radius > 0)
        {
            this.world.staticTree.remove(this);

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

            this.world.staticTree.insert(this);
        }
        else
        {
            this.isCircle = false;
        }

        return this;
    },

    reset: function (x, y)
    {
        this.world.staticTree.remove(this);

        var sprite = this.gameObject;

        this.position.x = x - sprite.displayOriginX + (sprite.scaleX * this.offset.x);
        this.position.y = y - sprite.displayOriginY + (sprite.scaleY * this.offset.y);

        this.rotation = this.gameObject.angle;

        this.updateBounds();
        this.updateCenter();

        this.world.staticTree.insert(this);
    },

    stop: function ()
    {
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

    deltaAbsX: function ()
    {
        return 0;
    },

    deltaAbsY: function ()
    {
        return 0;
    },

    deltaX: function ()
    {
        return 0;
    },

    deltaY: function ()
    {
        return 0;
    },

    deltaZ: function ()
    {
        return 0;
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
    },

    willDrawDebug: function ()
    {
        return this.debugShowBody;
    },

    setMass: function (value)
    {
        if (value <= 0)
        {
            //  Causes havoc otherwise
            value = 0.1;
        }

        this.mass = value;

        return this;
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

module.exports = StaticBody;
