//  Adapted from [gl-matrix](https://github.com/toji/gl-matrix) by toji 
//  and [vecmath](https://github.com/mattdesl/vecmath) by mattdesl

var Class = require('../utils/Class');

var Vector3 = new Class({

    initialize:

    function Vector3 (x, y, z)
    {
        if (typeof x === 'object')
        {
            this.x = x.x || 0;
            this.y = x.y || 0;
            this.z = x.z || 0;
        }
        else
        {
            this.x = x || 0;
            this.y = y || 0;
            this.z = z || 0;
        }
    },

    clone: function ()
    {
        return new Vector3(this.x, this.y, this.z);
    },

    copy: function (src)
    {
        this.x = src.x;
        this.y = src.y;
        this.z = src.z || 0;

        return this;
    },

    set: function (x, y, z)
    {
        if (typeof x === 'object')
        {
            this.x = x.x || 0;
            this.y = x.y || 0;
            this.z = x.z || 0;
        }
        else
        {
            this.x = x || 0;
            this.y = y || 0;
            this.z = z || 0;
        }

        return this;
    },

    add: function (v)
    {
        this.x += v.x;
        this.y += v.y;
        this.z += v.z || 0;

        return this;
    },

    subtract: function (v)
    {
        this.x -= v.x;
        this.y -= v.y;
        this.z -= v.z || 0;

        return this;
    },

    multiply: function (v)
    {
        this.x *= v.x;
        this.y *= v.y;
        this.z *= v.z || 1;

        return this;
    },

    scale: function (scale)
    {
        this.x *= scale;
        this.y *= scale;
        this.z *= scale;

        return this;
    },

    divide: function (v)
    {
        this.x /= v.x;
        this.y /= v.y;
        this.z /= v.z || 1;

        return this;
    },

    negate: function ()
    {
        this.x = -this.x;
        this.y = -this.y;
        this.z = -this.z;

        return this;
    },

    distance: function (v)
    {
        var dx = v.x - this.x;
        var dy = v.y - this.y;
        var dz = v.z - this.z || 0;

        return Math.sqrt(dx * dx + dy * dy + dz * dz);
    },

    distanceSq: function (v)
    {
        var dx = v.x - this.x;
        var dy = v.y - this.y;
        var dz = v.z - this.z || 0;

        return dx * dx + dy * dy + dz * dz;
    },

    length: function ()
    {
        var x = this.x;
        var y = this.y;
        var z = this.z;

        return Math.sqrt(x * x + y * y + z * z);
    },

    lengthSq: function ()
    {
        var x = this.x;
        var y = this.y;
        var z = this.z;

        return x * x + y * y + z * z;
    },

    normalize: function ()
    {
        var x = this.x;
        var y = this.y;
        var z = this.z;
        var len = x * x + y * y + z * z;

        if (len > 0)
        {
            len = 1 / Math.sqrt(len);

            this.x = x * len;
            this.y = y * len;
            this.z = z * len;
        }

        return this;
    },

    dot: function (v)
    {
        return this.x * v.x + this.y * v.y + this.z * v.z;
    },

    cross: function (v)
    {
        var ax = this.x;
        var ay = this.y;
        var az = this.z;
        var bx = v.x;
        var by = v.y;
        var bz = v.z;

        this.x = ay * bz - az * by;
        this.y = az * bx - ax * bz;
        this.z = ax * by - ay * bx;

        return this;
    },

    lerp: function (v, t)
    {
        if (t === undefined) { t = 0; }

        var ax = this.x;
        var ay = this.y;
        var az = this.z;

        this.x = ax + t * (v.x - ax);
        this.y = ay + t * (v.y - ay);
        this.z = az + t * (v.z - az);

        return this;
    },

    transformMat3: function (mat)
    {
        var x = this.x;
        var y = this.y;
        var z = this.z;
        var m = mat.val;

        this.x = x * m[0] + y * m[3] + z * m[6];
        this.y = x * m[1] + y * m[4] + z * m[7];
        this.z = x * m[2] + y * m[5] + z * m[8];

        return this;
    },

    transformMat4: function (mat)
    {
        var x = this.x;
        var y = this.y;
        var z = this.z;
        var m = mat.val;

        this.x = m[0] * x + m[4] * y + m[8] * z + m[12];
        this.y = m[1] * x + m[5] * y + m[9] * z + m[13];
        this.z = m[2] * x + m[6] * y + m[10] * z + m[14];

        return this;
    },

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

    /**
     * Multiplies this Vector3 by the specified matrix, 
     * applying a W divide. This is useful for projection,
     * e.g. unprojecting a 2D point into 3D space.
     *
     * @method project
     * @param {Matrix4} the 4x4 matrix to multiply with 
     * @return {Vector3} this object for chaining
     */
    project: function (mat)
    {
        var x = this.x;
        var y = this.y;
        var z = this.z;
        var m = mat.val;

        var a00 = m[0];
        var a01 = m[1];
        var a02 = m[2];
        var a03 = m[3];
        var a10 = m[4];
        var a11 = m[5];
        var a12 = m[6];
        var a13 = m[7];
        var a20 = m[8];
        var a21 = m[9];
        var a22 = m[10];
        var a23 = m[11];
        var a30 = m[12];
        var a31 = m[13];
        var a32 = m[14];
        var a33 = m[15];

        var lw = 1 / (x * a03 + y * a13 + z * a23 + a33);

        this.x = (x * a00 + y * a10 + z * a20 + a30) * lw;
        this.y = (x * a01 + y * a11 + z * a21 + a31) * lw;
        this.z = (x * a02 + y * a12 + z * a22 + a32) * lw;

        return this;
    },

    /**
     * Unproject this point from 2D space to 3D space.
     * The point should have its x and y properties set to
     * 2D screen space, and the z either at 0 (near plane)
     * or 1 (far plane). The provided matrix is assumed to already
     * be combined, i.e. projection * view * model.
     *
     * After this operation, this vector's (x, y, z) components will
     * represent the unprojected 3D coordinate.
     * 
     * @param  {Vector4} viewport          screen x, y, width and height in pixels
     * @param  {Matrix4} invProjectionView combined projection and view matrix
     * @return {Vector3}                   this object, for chaining
     */
    unproject: function (viewport, invProjectionView)
    {
        var viewX = viewport.x;
        var viewY = viewport.y;
        var viewWidth = viewport.z;
        var viewHeight = viewport.w;
        
        var x = this.x - viewX;
        var y = (viewHeight - this.y - 1) - viewY;
        var z = this.z;

        this.x = (2 * x) / viewWidth - 1;
        this.y = (2 * y) / viewHeight - 1;
        this.z = 2 * z - 1;

        return this.project(invProjectionView);
    },

    reset: function ()
    {
        this.x = 0;
        this.y = 0;
        this.z = 0;

        return this;
    }

});

Vector3.prototype.sub = Vector3.prototype.subtract;
Vector3.prototype.mul = Vector3.prototype.multiply;
Vector3.prototype.div = Vector3.prototype.divide;
Vector3.prototype.dist = Vector3.prototype.distance;
Vector3.prototype.distSq = Vector3.prototype.distanceSq;
Vector3.prototype.len = Vector3.prototype.length;
Vector3.prototype.lenSq = Vector3.prototype.lengthSq;

module.exports = Vector3;
