//  Adapted from [gl-matrix](https://github.com/toji/gl-matrix) by toji 
//  and [vecmath](https://github.com/mattdesl/vecmath) by mattdesl

var Class = require('../utils/Class');

var Vector4 = new Class({

    initialize:

    function Vector4 (x, y, z, w)
    {
        if (typeof x === 'object')
        {
            this.x = x.x || 0;
            this.y = x.y || 0;
            this.z = x.z || 0;
            this.w = x.w || 0;
        }
        else
        {
            this.x = x || 0;
            this.y = y || 0;
            this.z = z || 0;
            this.w = w || 0;
        }
    },

    clone: function ()
    {
        return new Vector4(this.x, this.y, this.z, this.w);
    },

    copy: function (src)
    {
        this.x = src.x;
        this.y = src.y;
        this.z = src.z;
        this.w = src.w;

        return this;
    },

    set: function (x, y, z, w)
    {
        if (typeof x === 'object')
        {
            this.x = x.x || 0;
            this.y = x.y || 0;
            this.z = x.z || 0;
            this.w = x.w || 0;
        }
        else
        {
            this.x = x || 0;
            this.y = y || 0;
            this.z = z || 0;
            this.w = w || 0;
        }

        return this;
    },

    add: function (v)
    {
        this.x += v.x;
        this.y += v.y;
        this.z += v.z;
        this.w += v.w;

        return this;
    },

    subtract: function (v)
    {
        this.x -= v.x;
        this.y -= v.y;
        this.z -= v.z;
        this.w -= v.w;

        return this;
    },

    scale: function (scale)
    {
        this.x *= scale;
        this.y *= scale;
        this.z *= scale;
        this.w *= scale;

        return this;
    },

    length: function ()
    {
        var x = this.x;
        var y = this.y;
        var z = this.z;
        var w = this.w;

        return Math.sqrt(x * x + y * y + z * z + w * w);
    },

    lengthSq: function ()
    {
        var x = this.x;
        var y = this.y;
        var z = this.z;
        var w = this.w;

        return x * x + y * y + z * z + w * w;
    },

    normalize: function ()
    {
        var x = this.x;
        var y = this.y;
        var z = this.z;
        var w = this.w;
        var len = x * x + y * y + z * z + w * w;

        if (len > 0)
        {
            len = 1 / Math.sqrt(len);

            this.x = x * len;
            this.y = y * len;
            this.z = z * len;
            this.w = w * len;
        }

        return this;
    },

    dot: function (v)
    {
        return this.x * v.x + this.y * v.y + this.z * v.z + this.w * v.w;
    },

    lerp: function (v, t)
    {
        if (t === undefined) { t = 0; }

        var ax = this.x;
        var ay = this.y;
        var az = this.z;
        var aw = this.w;

        this.x = ax + t * (v.x - ax);
        this.y = ay + t * (v.y - ay);
        this.z = az + t * (v.z - az);
        this.w = aw + t * (v.w - aw);

        return this;
    },

    multiply: function (v)
    {
        this.x *= v.x;
        this.y *= v.y;
        this.z *= v.z;
        this.w *= v.w;

        return this;
    },

    divide: function (v)
    {
        this.x /= v.x;
        this.y /= v.y;
        this.z /= v.z;
        this.w /= v.w;

        return this;
    },

    distance: function (v)
    {
        var dx = v.x - this.x;
        var dy = v.y - this.y;
        var dz = v.z - this.z;
        var dw = v.w - this.w;

        return Math.sqrt(dx * dx + dy * dy + dz * dz + dw * dw);
    },

    distanceSq: function (v)
    {
        var dx = v.x - this.x;
        var dy = v.y - this.y;
        var dz = v.z - this.z;
        var dw = v.w - this.w;

        return dx * dx + dy * dy + dz * dz + dw * dw;
    },

    negate: function ()
    {
        this.x = -this.x;
        this.y = -this.y;
        this.z = -this.z;
        this.w = -this.w;

        return this;
    },

    transformMat4: function (mat)
    {
        var x = this.x;
        var y = this.y;
        var z = this.z;
        var w = this.w;
        var m = mat.val;

        this.x = m[0] * x + m[4] * y + m[8] * z + m[12] * w;
        this.y = m[1] * x + m[5] * y + m[9] * z + m[13] * w;
        this.z = m[2] * x + m[6] * y + m[10] * z + m[14] * w;
        this.w = m[3] * x + m[7] * y + m[11] * z + m[15] * w;

        return this;
    },

    //  TODO: is this really the same as Vector3?
    //  Also, what about this: http://molecularmusings.wordpress.com/2013/05/24/a-faster-quaternion-vector-multiplication/
    transformQuat: function (q)
    {
        // benchmarks: http://jsperf.com/quaternion-transform-vec3-implementations
        var x = this.x;
        var y = this.y;
        var z = this.z;
        var qx = q.x;
        var qy = q.y;
        var qz = q.z;
        var qw = q.w;

        // calculate quat * vec
        var ix = qw * x + qy * z - qz * y;
        var iy = qw * y + qz * x - qx * z;
        var iz = qw * z + qx * y - qy * x;
        var iw = -qx * x - qy * y - qz * z;

        // calculate result * inverse quat
        this.x = ix * qw + iw * -qx + iy * -qz - iz * -qy;
        this.y = iy * qw + iw * -qy + iz * -qx - ix * -qz;
        this.z = iz * qw + iw * -qz + ix * -qy - iy * -qx;

        return this;
    },

    reset: function ()
    {
        this.x = 0;
        this.y = 0;
        this.z = 0;
        this.w = 0;

        return this;
    }

});

Vector4.prototype.sub = Vector4.prototype.subtract;
Vector4.prototype.mul = Vector4.prototype.multiply;
Vector4.prototype.div = Vector4.prototype.divide;
Vector4.prototype.dist = Vector4.prototype.distance;
Vector4.prototype.distSq = Vector4.prototype.distanceSq;
Vector4.prototype.len = Vector4.prototype.length;
Vector4.prototype.lenSq = Vector4.prototype.lengthSq;

module.exports = Vector4;
