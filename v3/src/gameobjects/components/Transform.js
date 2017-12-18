var MATH_CONST = require('../../math/const');
var WrapAngle = require('../../math/angle/Wrap');
var WrapAngleDegrees = require('../../math/angle/WrapDegrees');

//  global bitmask flag for GameObject.renderMask (used by Scale)
var _FLAG = 4; // 0100

//  Transform Component

var Transform = {

    //  "private" properties
    _scaleX: 1,
    _scaleY: 1,
    _rotation: 0,
    _depth: 0,
    _dirty: false,
    _world: { a: 1, b: 0, c: 0, d: 1, tx: 0, ty: 0, sr: 0, cr: 0 },

    //  public properties / methods

    //  These are world coordinate values.

    //  If Game Object is a child of a Container, then you can modify its local position (relative to the Container)
    //  by setting `localX`, `localY`, etc (or changing x/y directly, but remember the values given here are world based).
    //  Changes to the parent Container are instantly reflected in the world coords here (x,y, etc)

    _x: 0,
    _y: 0,
    _z: 0,
    _w: 0,

    x: {

        get: function ()
        {
            return this._x;
        },

        set: function (value)
        {
            this._x = value;
            this._dirty = true;
        }

    },

    y: {

        get: function ()
        {
            return this._y;
        },

        set: function (value)
        {
            this._y = value;
            this._dirty = true;
        }

    },

    z: {

        get: function ()
        {
            return this._z;
        },

        set: function (value)
        {
            this._z = value;
            this._dirty = true;
        }

    },

    w: {

        get: function ()
        {
            return this._w;
        },

        set: function (value)
        {
            this._w = value;
            this._dirty = true;
        }

    },

    scaleX: {

        get: function ()
        {
            return this._scaleX;
        },

        set: function (value)
        {
            this._scaleX = value;
            this._dirty = true;

            if (this._scaleX === 0)
            {
                this.renderFlags &= ~_FLAG;
            }
            else
            {
                this.renderFlags |= _FLAG;
            }
        }

    },

    scaleY: {

        get: function ()
        {
            return this._scaleY;
        },

        set: function (value)
        {
            this._scaleY = value;
            this._dirty = true;

            if (this._scaleY === 0)
            {
                this.renderFlags &= ~_FLAG;
            }
            else
            {
                this.renderFlags |= _FLAG;
            }
        }

    },

    angle: {

        get: function ()
        {
            return WrapAngleDegrees(this._rotation * MATH_CONST.RAD_TO_DEG);
        },

        set: function (value)
        {
            //  value is in degrees
            this.rotation = WrapAngleDegrees(value) * MATH_CONST.DEG_TO_RAD;
        }
    },

    rotation: {

        get: function ()
        {
            return this._rotation;
        },

        set: function (value)
        {
            //  value is in radians
            this._rotation = WrapAngle(value);

            this._world.sr = Math.sin(this._rotation);
            this._world.cr = Math.cos(this._rotation);

            this._dirty = true;
        }
    },

    depth: {

        get: function ()
        {
            return this._depth;
        },

        set: function (value)
        {
            this.scene.sys.sortChildrenFlag = true;
            this._depth = value;
        }

    },

    setPosition: function (x, y, z, w)
    {
        if (x === undefined) { x = 0; }
        if (y === undefined) { y = x; }
        if (z === undefined) { z = 0; }
        if (w === undefined) { w = 0; }

        this._x = x;
        this._y = y;
        this._z = z;
        this._w = w;

        this._dirty = true;

        return this;
    },

    setRotation: function (radians)
    {
        if (radians === undefined) { radians = 0; }

        this.rotation = radians;

        return this;
    },

    setAngle: function (degrees)
    {
        if (degrees === undefined) { degrees = 0; }

        this.angle = degrees;

        return this;
    },

    setScale: function (x, y)
    {
        if (x === undefined) { x = 1; }
        if (y === undefined) { y = x; }

        this.scaleX = x;
        this.scaleY = y;

        return this;
    },

    setZ: function (value)
    {
        if (value === undefined) { value = 0; }

        this.z = value;

        return this;
    },

    setW: function (value)
    {
        if (value === undefined) { value = 0; }

        this.w = value;

        return this;
    },

    setDepth: function (value)
    {
        if (value === undefined) { value = 0; }

        this.depth = value;

        return this;
    },

    updateTransform: function ()
    {
        if (!this.parent || !this._dirty)
        {
            return;
        }

        var tx = this._x;
        var ty = this._y;
        var world = this._world;

        var parent = this.parent.world;

        var a = world.cr * this._scaleX;
        var b = world.sr * this._scaleX;
        var c = -world.sr * this._scaleY;
        var d = world.cr * this._scaleY;

        world.a = (a * parent.a) + (b * parent.c);
        world.b = (a * parent.b) + (b * parent.d);
        world.c = (c * parent.a) + (d * parent.c);
        world.d = (c * parent.b) + (d * parent.d);

        // this._worldRotation = Math.atan2(-this.world.c, this.world.d);

        world.tx = (tx * parent.a) + (ty * parent.c) + parent.tx;
        world.ty = (tx * parent.b) + (ty * parent.d) + parent.ty;

        // this._worldScaleX = this._scaleX * Math.sqrt((world.a * world.a) + (world.c * world.c));
        // this._worldScaleY = this._scaleY * Math.sqrt((world.b * world.b) + (world.d * world.d));
    }

};

module.exports = Transform;
