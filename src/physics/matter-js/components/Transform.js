var Body = require('../lib/body/Body');
var MATH_CONST = require('../../../math/const');
var WrapAngle = require('../../../math/angle/Wrap');
var WrapAngleDegrees = require('../../../math/angle/WrapDegrees');

//  global bitmask flag for GameObject.renderMask (used by Scale)
var _FLAG = 4; // 0100

//  Transform Component

var Transform = {

    x: {

        get: function ()
        {
            return this.body.position.x;
        },

        set: function (value)
        {
            this._tempVec2.set(value, this.y);

            Body.setPosition(this.body, this._tempVec2);
        }

    },

    y: {

        get: function ()
        {
            return this.body.position.y;
        },

        set: function (value)
        {
            this._tempVec2.set(this.x, value);

            Body.setPosition(this.body, this._tempVec2);
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

            Body.scale(this.body, value, this._scaleY);
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

            Body.scale(this.body, this._scaleX, value);
        }

    },

    angle: {

        get: function ()
        {
            return WrapAngleDegrees(this.body.angle * MATH_CONST.RAD_TO_DEG);
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
            return this.body.angle;
        },

        set: function (value)
        {
            //  value is in radians
            this._rotation = WrapAngle(value);

            Body.setAngle(this.body, this._rotation);
        }
    },

    setPosition: function (x, y)
    {
        if (x === undefined) { x = 0; }
        if (y === undefined) { y = x; }

        this._tempVec2.set(x, y);

        Body.setPosition(this.body, this._tempVec2);

        return this;
    },

    setRotation: function (radians)
    {
        if (radians === undefined) { radians = 0; }

        this._rotation = WrapAngle(radians);

        Body.setAngle(this.body, radians);

        return this;
    },

    setFixedRotation: function ()
    {
        Body.setInertia(this.body, Infinity);

        return this;
    },

    setAngle: function (degrees)
    {
        if (degrees === undefined) { degrees = 0; }

        this.angle = degrees;

        Body.setAngle(this.body, this.rotation);

        return this;
    },

    setScale: function (x, y, point)
    {
        if (x === undefined) { x = 1; }
        if (y === undefined) { y = x; }

        this._scaleX = x;
        this._scaleY = y;

        Body.scale(this.body, x, y, point);

        return this;
    }

};

module.exports = Transform;
