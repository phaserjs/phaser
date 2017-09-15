//  Based on vecmath lib by mattdesl https://github.com/mattdesl/vecmath and gl-matrix

var Class = require('../utils/Class');

var Vector2 = new Class({

    initialize:

    function Vector2 (x, y)
    {
        if (x === undefined) { x = 0; }
        if (y === undefined) { y = 0; }

        this.x = x;
        this.y = y;
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

    set: function (x, y)
    {
        if (typeof x === 'object')
        {
            this.x = x.x || 0;
            this.y = x.y || 0;
        }
        else
        {
            this.x = x;
            this.y = y;
        }

        return this;
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
        this.x *= value;
        this.y *= value;

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

    reset:  function ()
    {
        this.x = 0;
        this.y = 0;

        return this;
    },

    random: function (scale)
    {
        if (scale === undefined) { scale = 1; }

        var r = Math.random() * 2 * Math.PI;

        this.x = Math.cos(r) * scale;
        this.y = Math.sin(r) * scale;

        return this;
    }

});

Vector2.sub = Vector2.subtract;
Vector2.mul = Vector2.multiply;
Vector2.div = Vector2.divide;
Vector2.dist = Vector2.distance;
Vector2.distSq = Vector2.distanceSq;
Vector2.len = Vector2.length;
Vector2.lenSq = Vector2.lengthSq;

module.exports = Vector2;
