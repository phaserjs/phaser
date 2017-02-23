var MATH_CONST = require('../math/const');
var WrapAngle = require('../math/angle/Wrap');

var _scaleX = 1;
var _scaleY = 1;

//  bitmask flag for GameObject.renderMask (used by Scale)
var _FLAG = 4; // 0100

//  Transform Component

var Transform = {

    x: 0,
    y: 0,
    z: 0,

    rotation: 0,

    anchorX: 0,
    anchorY: 0,

    offsetX: 0,
    offsetY: 0,

    scaleX: {

        get: function ()
        {
            return _scaleX;
        },

        set: function (value)
        {
            _scaleX = value;

            if (_scaleX === 0)
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
            return _scaleY;
        },

        set: function (value)
        {
            _scaleY = value;

            if (_scaleY === 0)
            {
                this.renderFlags &= ~_FLAG;
            }
            else
            {
                this.renderFlags |= _FLAG;
            }
        }

    },

    setPosition: function (x, y)
    {
        if (y === undefined) { y = x; }

        this.x = x;
        this.y = y;

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

    setAnchor: function (x, y)
    {
        if (x === undefined) { x = 0; }
        if (y === undefined) { y = x; }

        this.anchorX = x;
        this.anchorY = y;

        return this;
    },

    setOffset: function (x, y)
    {
        if (x === undefined) { x = 0; }
        if (y === undefined) { y = x; }

        this.offsetX = x;
        this.offsetY = y;

        return this;
    },

    angle: {

        get: function ()
        {
            return WrapAngle(this.rotation * MATH_CONST.RAD_TO_DEG);
        },

        set: function (value)
        {
            //  value is in degrees
            this.rotation = WrapAngle(value * MATH_CONST.DEG_TO_RAD);
        }
    }

};

module.exports = Transform;
