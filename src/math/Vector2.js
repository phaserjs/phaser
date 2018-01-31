//  Adapted from [gl-matrix](https://github.com/toji/gl-matrix) by toji 
//  and [vecmath](https://github.com/mattdesl/vecmath) by mattdesl

var Class = require('../utils/Class');

/**
 * [description]
 *
 * @class Vector2
 * @memberOf Phaser.Math
 * @constructor
 * @since 3.0.0
 *
 * @param {number} [x] - [description]
 * @param {number} [y] - [description]
 */
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

    /**
     * [description]
     *
     * @method Phaser.Math.Vector2#clone
     * @since 3.0.0
     *
     * @return {[type]} [description]
     */
    clone: function ()
    {
        return new Vector2(this.x, this.y);
    },

    /**
     * [description]
     *
     * @method Phaser.Math.Vector2#copy
     * @since 3.0.0
     *
     * @param {[type]} src - [description]
     *
     * @return {[type]} [description]
     */
    copy: function (src)
    {
        this.x = src.x || 0;
        this.y = src.y || 0;

        return this;
    },

    /**
     * [description]
     *
     * @method Phaser.Math.Vector2#setFromObject
     * @since 3.0.0
     *
     * @param {[type]} obj - [description]
     *
     * @return {[type]} [description]
     */
    setFromObject: function (obj)
    {
        this.x = obj.x || 0;
        this.y = obj.y || 0;

        return this;
    },

    /**
     * [description]
     *
     * @method Phaser.Math.Vector2#set
     * @since 3.0.0
     *
     * @param {[type]} x - [description]
     * @param {[type]} y - [description]
     *
     * @return {[type]} [description]
     */
    set: function (x, y)
    {
        if (y === undefined) { y = x; }

        this.x = x;
        this.y = y;

        return this;
    },

    // Sets the `x` and `y` values of this object from a given polar coordinate.
    // @param {number} azimuth - The angular coordinate, in radians.
    // @param {number} [radius=1] - The radial coordinate (length).
    /**
     * [description]
     *
     * @method Phaser.Math.Vector2#setToPolar
     * @since 3.0.0
     *
     * @param {[type]} azimuth - [description]
     * @param {[type]} radius - [description]
     *
     * @return {[type]} [description]
     */
    setToPolar: function (azimuth, radius)
    {
        if (radius == null) { radius = 1; }

        this.x = Math.cos(azimuth) * radius;
        this.y = Math.sin(azimuth) * radius;

        return this;
    },

    /**
     * [description]
     *
     * @method Phaser.Math.Vector2#equals
     * @since 3.0.0
     *
     * @param {[type]} v - [description]
     *
     * @return {[type]} [description]
     */
    equals: function (v)
    {
        return ((this.x === v.x) && (this.y === v.y));
    },

    /**
     * [description]
     *
     * @method Phaser.Math.Vector2#angle
     * @since 3.0.0
     *
     * @return {[type]} [description]
     */
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

    /**
     * [description]
     *
     * @method Phaser.Math.Vector2#add
     * @since 3.0.0
     *
     * @param {[type]} src - [description]
     *
     * @return {[type]} [description]
     */
    add: function (src)
    {
        this.x += src.x;
        this.y += src.y;

        return this;
    },

    /**
     * [description]
     *
     * @method Phaser.Math.Vector2#subtract
     * @since 3.0.0
     *
     * @param {[type]} src - [description]
     *
     * @return {[type]} [description]
     */
    subtract: function (src)
    {
        this.x -= src.x;
        this.y -= src.y;

        return this;
    },

    /**
     * [description]
     *
     * @method Phaser.Math.Vector2#multiply
     * @since 3.0.0
     *
     * @param {[type]} src - [description]
     *
     * @return {[type]} [description]
     */
    multiply: function (src)
    {
        this.x *= src.x;
        this.y *= src.y;

        return this;
    },

    /**
     * [description]
     *
     * @method Phaser.Math.Vector2#scale
     * @since 3.0.0
     *
     * @param {[type]} value - [description]
     *
     * @return {[type]} [description]
     */
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

    /**
     * [description]
     *
     * @method Phaser.Math.Vector2#divide
     * @since 3.0.0
     *
     * @param {[type]} src - [description]
     *
     * @return {[type]} [description]
     */
    divide: function (src)
    {
        this.x /= src.x;
        this.y /= src.y;

        return this;
    },

    /**
     * [description]
     *
     * @method Phaser.Math.Vector2#negate
     * @since 3.0.0
     *
     * @return {[type]} [description]
     */
    negate: function ()
    {
        this.x = -this.x;
        this.y = -this.y;

        return this;
    },

    /**
     * [description]
     *
     * @method Phaser.Math.Vector2#distance
     * @since 3.0.0
     *
     * @param {[type]} src - [description]
     *
     * @return {[type]} [description]
     */
    distance: function (src)
    {
        var dx = src.x - this.x;
        var dy = src.y - this.y;

        return Math.sqrt(dx * dx + dy * dy);
    },

    /**
     * [description]
     *
     * @method Phaser.Math.Vector2#distanceSq
     * @since 3.0.0
     *
     * @param {[type]} src - [description]
     *
     * @return {[type]} [description]
     */
    distanceSq: function (src)
    {
        var dx = src.x - this.x;
        var dy = src.y - this.y;

        return dx * dx + dy * dy;
    },

    /**
     * [description]
     *
     * @method Phaser.Math.Vector2#length
     * @since 3.0.0
     *
     * @return {[type]} [description]
     */
    length: function ()
    {
        var x = this.x;
        var y = this.y;

        return Math.sqrt(x * x + y * y);
    },

    /**
     * [description]
     *
     * @method Phaser.Math.Vector2#lengthSq
     * @since 3.0.0
     *
     * @return {[type]} [description]
     */
    lengthSq: function ()
    {
        var x = this.x;
        var y = this.y;

        return x * x + y * y;
    },

    /**
     * [description]
     *
     * @method Phaser.Math.Vector2#normalize
     * @since 3.0.0
     *
     * @return {[type]} [description]
     */
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
    /**
     * [description]
     *
     * @method Phaser.Math.Vector2#normalizeRightHand
     * @since 3.0.0
     *
     * @return {[type]} [description]
     */
    normalizeRightHand: function ()
    {
        var x = this.x;

        this.x = this.y * -1;
        this.y = x;

        return this;
    },

    /**
     * [description]
     *
     * @method Phaser.Math.Vector2#dot
     * @since 3.0.0
     *
     * @param {[type]} src - [description]
     *
     * @return {[type]} [description]
     */
    dot: function (src)
    {
        return this.x * src.x + this.y * src.y;
    },

    /**
     * [description]
     *
     * @method Phaser.Math.Vector2#cross
     * @since 3.0.0
     *
     * @param {[type]} src - [description]
     *
     * @return {[type]} [description]
     */
    cross: function (src)
    {
        return this.x * src.y - this.y * src.x;
    },

    /**
     * [description]
     *
     * @method Phaser.Math.Vector2#lerp
     * @since 3.0.0
     *
     * @param {[type]} src - [description]
     * @param {[type]} t - [description]
     *
     * @return {[type]} [description]
     */
    lerp: function (src, t)
    {
        if (t === undefined) { t = 0; }

        var ax = this.x;
        var ay = this.y;

        this.x = ax + t * (src.x - ax);
        this.y = ay + t * (src.y - ay);

        return this;
    },

    /**
     * [description]
     *
     * @method Phaser.Math.Vector2#transformMat3
     * @since 3.0.0
     *
     * @param {[type]} mat - [description]
     *
     * @return {[type]} [description]
     */
    transformMat3: function (mat)
    {
        var x = this.x;
        var y = this.y;
        var m = mat.val;

        this.x = m[0] * x + m[3] * y + m[6];
        this.y = m[1] * x + m[4] * y + m[7];

        return this;
    },

    /**
     * [description]
     *
     * @method Phaser.Math.Vector2#transformMat4
     * @since 3.0.0
     *
     * @param {[type]} mat - [description]
     *
     * @return {[type]} [description]
     */
    transformMat4: function (mat)
    {
        var x = this.x;
        var y = this.y;
        var m = mat.val;

        this.x = m[0] * x + m[4] * y + m[12];
        this.y = m[1] * x + m[5] * y + m[13];

        return this;
    },

    /**
     * [description]
     *
     * @method Phaser.Math.Vector2#reset
     * @since 3.0.0
     *
     * @return {[type]} [description]
     */
    reset: function ()
    {
        this.x = 0;
        this.y = 0;

        return this;
    }

});

module.exports = Vector2;
