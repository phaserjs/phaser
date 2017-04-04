var MATH_CONST = require('../math/const');
var WrapAngle = require('../math/angle/Wrap');
var WrapAngleDegrees = require('../math/angle/WrapDegrees');

//  global bitmask flag for GameObject.renderMask (used by Scale)
var _FLAG = 4; // 0100

//  Transform Component

var Transform = {

    //  "private" properties
    _scaleX: 1,
    _scaleY: 1,
    _rotation: 0,
    _z: 0,

    //  public properties / methods

    x: 0,
    y: 0,

    z: {

        get: function ()
        {
            return this._z;
        },

        set: function (value)
        {
            this.state.sys.sortChildrenFlag = true;
            this._z = value;
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
        }
    },

    setPosition: function (x, y)
    {
        if (x === undefined) { x = 0; }
        if (y === undefined) { y = x; }

        this.x = x;
        this.y = y;

        return this;
    },

    setRotation: function (radians)
    {
        if (radians === undefined) { radians = 0; }

        this.rotation = radians;

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
    }

};

module.exports = Transform;
