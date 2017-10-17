//  Adapted from [gl-matrix](https://github.com/toji/gl-matrix) by toji 
//  and [vecmath](https://github.com/mattdesl/vecmath) by mattdesl

var Class = require('../utils/Class');

var Vector2 = new Class({

    initialize:

    function Vector2 (x, y)
    {
        if (typeof x === 'object')
        {
            this.x = x.x || 0;
            this.y = x.y || 0;
        }
        else
        {
            if (y === undefined) { y = x; }

            this.x = x || 0;
            this.y = y || 0;
        }
    },

    clone: function ()
    {
        return new Vector2(this.x, this.y);
    },

    copy: function (src)
    {
        this.x = src.x || 0;
        this.y = src.y || 0;

        return this;
    },

    setFromObject: function (obj)
    {
        this.x = obj.x || 0;
        this.y = obj.y || 0;

        return this;
    },

    set: function (x, y)
    {
        if (y === undefined) { y = x; }

        this.x = x;
        this.y = y;

        return this;
    },

    equals: function (v)
    {
        return ((this.x === v.x) && (this.y === v.y));
    },

    angle: function ()
    {
        // computes the angle in radians with respect to the positive x-axis

        var angle = Math.atan2(this.y, this.x);

        if (angle < 0)
        {
            angle += 2 * Math.PI;
        }

        return angle;
    },

    add: function (src)
    {
        this.x += src.x;
        this.y += src.y;

        return this;
    },

    subtract: function (src)
    {
        this.x -= src.x;
        this.y -= src.y;

        return this;
    },

    multiply: function (src)
    {
        this.x *= src.x;
        this.y *= src.y;

        return this;
    },

    scale: function (value)
    {
        if (isFinite(value))
        {
            this.x *= value;
            this.y *= value;
        }
        else
        {
            this.x = 0;
            this.y = 0;
        }

        return this;
    },

    divide: function (src)
    {
        this.x /= src.x;
        this.y /= src.y;

        return this;
    },

    negate: function ()
    {
        this.x = -this.x;
        this.y = -this.y;

        return this;
    },

    distance: function (src)
    {
        var dx = src.x - this.x;
        var dy = src.y - this.y;

        return Math.sqrt(dx * dx + dy * dy);
    },

    distanceSq: function (src)
    {
        var dx = src.x - this.x;
        var dy = src.y - this.y;

        return dx * dx + dy * dy;
    },

    length: function ()
    {
        var x = this.x;
        var y = this.y;

        return Math.sqrt(x * x + y * y);
    },

    lengthSq: function ()
    {
        var x = this.x;
        var y = this.y;

        return x * x + y * y;
    },

    normalize: function ()
    {
        var x = this.x;
        var y = this.y;
        var len = x * x + y * y;

        if (len > 0)
        {
            len = 1 / Math.sqrt(len);
            this.x = x * len;
            this.y = y * len;
        }
    
        return this;
    },

    /**
    * Right-hand normalize (make unit length) this Vector
    */
    normalizeRightHand: function ()
    {
        var x = this.x;

        this.x = this.y * -1;
        this.y = x;

        return this;
    },

    dot: function (src)
    {
        return this.x * src.x + this.y * src.y;
    },

    cross: function (src)
    {
        return this.x * src.y - this.y * src.x;
    },

    lerp: function (src, t)
    {
        if (t === undefined) { t = 0; }

        var ax = this.x;
        var ay = this.y;

        this.x = ax + t * (src.x - ax);
        this.y = ay + t * (src.y - ay);

        return this;
    },

    transformMat3: function (mat)
    {
        var x = this.x;
        var y = this.y;
        var m = mat.val;

        this.x = m[0] * x + m[3] * y + m[6];
        this.y = m[1] * x + m[4] * y + m[7];

        return this;
    },

    transformMat4: function (mat)
    {
        var x = this.x;
        var y = this.y;
        var m = mat.val;

        this.x = m[0] * x + m[4] * y + m[12];
        this.y = m[1] * x + m[5] * y + m[13];

        return this;
    },

    reset: function ()
    {
        this.x = 0;
        this.y = 0;

        return this;
    }

});

Vector2.prototype.sub = Vector2.prototype.subtract;
Vector2.prototype.mul = Vector2.prototype.multiply;
Vector2.prototype.div = Vector2.prototype.divide;
Vector2.prototype.dist = Vector2.prototype.distance;
Vector2.prototype.distSq = Vector2.prototype.distanceSq;
Vector2.prototype.len = Vector2.prototype.length;
Vector2.prototype.lenSq = Vector2.prototype.lengthSq;

module.exports = Vector2;
