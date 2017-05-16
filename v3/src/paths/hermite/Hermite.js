var Point = require('../point/Point');

/**
* @author       Richard Davey <rich@photonstorm.com>
* @author       Pete Baron <pete@photonstorm.com>
* @copyright    2016 Photon Storm Ltd.
* @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
*/

/**
* A data representation of a Hermite Curve (see http://en.wikipedia.org/wiki/Cubic_Hermite_spline)
* 
* A Hermite curve has a start and end point and tangent vectors for both of them.
* The curve will always pass through the two control points and the shape of it is controlled
* by the length and direction of the tangent vectors.  At the control points the curve will
* be facing exactly in the vector direction.
* 
* As these curves change speed (speed = distance between points separated by an equal change in
* 't' value - see Hermite.getPoint) this class attempts to reduce the variation by pre-calculating
* the `accuracy` number of points on the curve. The straight-line distances to these points are stored
* in the private 'points' array, and this information is used by Hermite.findT() to convert a pixel
* distance along the curve into a 'time' value.
* 
* Higher `accuracy` values will result in more even movement, but require more memory for the points
* list. 5 works, but 10 seems to be an ideal value for the length of curves found in most games on
* a desktop screen. If you use very long curves (more than 400 pixels) you may need to increase
* this value further.
*
* @class Phaser.Hermite
* @constructor
* @param {number} p1x - The x coordinate of the start of the curve.
* @param {number} p1y - The y coordinate of the start of the curve.
* @param {number} p2x - The x coordinate of the end of the curve.
* @param {number} p2y - The y coordinate of the end of the curve.
* @param {number} v1x - The x component of the tangent vector for the start of the curve.
* @param {number} v1y - The y component of the tangent vector for the start of the curve.
* @param {number} v2x - The x component of the tangent vector for the end of the curve.
* @param {number} v2y - The y component of the tangent vector for the end of the curve.
* @param {number} [accuracy=10] The amount of points to pre-calculate on the curve.
*/
var Hermite = function (p1x, p1y, p2x, p2y, v1x, v1y, v2x, v2y, accuracy)
{
    if (accuracy === undefined) { accuracy = 10; }

    /**
    * @property {number} _accuracy - The amount of points to pre-calculate on the curve.
    * @private
    */
    this._accuracy = accuracy;

    /**
    * @property {number} _p1x - The x coordinate of the start of the curve.
    * @private
    */
    this._p1x = p1x;

    /**
    * @property {number} _p1y - The y coordinate of the start of the curve.
    * @private
    */
    this._p1y = p1y;

    /**
    * @property {number} _p2x - The x coordinate of the end of the curve.
    * @private
    */
    this._p2x = p2x;

    /**
    * @property {number} _p2y - The y coordinate of the end of the curve.
    * @private
    */
    this._p2y = p2y;

    /**
    * @property {number} _v1x - The x component of the tangent vector for the start of the curve.
    * @private
    */
    this._v1x = v1x;

    /**
    * @property {number} _v1y - The y component of the tangent vector for the start of the curve.
    * @private
    */
    this._v1y = v1y;

    /**
    * @property {number} _v2x - The x component of the tangent vector for the end of the curve.
    * @private
    */
    this._v2x = v2x;

    /**
    * @property {number} _v2y - The y component of the tangent vector for the end of the curve.
    * @private
    */
    this._v2y = v2y;
    
    /**
    * @property {array} _points - A local array of cached points.
    * @private
    */
    this._points = [];

    /**
    * @property {Phaser.Point} _temp1 - A local cached Point object.
    * @private
    */
    this._temp1 = new Point();

    /**
    * @property {Phaser.Point} _temp2 - A local cached Point object.
    * @private
    */
    this._temp2 = new Point();

    this.recalculate();
};

Hermite.prototype.constructor = Hermite;

Hermite.prototype = {

    /**
    * Performs the curve calculations.
    *
    * This is called automatically if you change any of the curves public properties, such as `Hermite.p1x` or `Hermite.v2y`.
    *
    * If you adjust any of the internal private values, then call this to update the points.
    *
    * @method Phaser.Hermite#recalculate
    * @return {Phaser.Hermite} This object.
    */
    recalculate: function ()
    {
        this._ax = (2 * this._p1x - 2 * this._p2x + this._v1x + this._v2x);
        this._ay = (2 * this._p1y - 2 * this._p2y + this._v1y + this._v2y);
        this._bx = (-3 * this._p1x + 3 * this._p2x - 2 * this._v1x - this._v2x);
        this._by = (-3 * this._p1y + 3 * this._p2y - 2 * this._v1y - this._v2y);

        this.length = this.calculateEvenPoints();

        return this;
    },

    /**
    * Calculate a number of points along the curve, based on `Hermite.accuracy`, and stores them in the private `_points` array.
    *
    * @method Phaser.Hermite#calculateEvenPoints
    * @return {number} The total length of the curve approximated as straight line distances between the points.
    */
    calculateEvenPoints: function ()
    {
        var totalLength = 0;

        this._temp1.setTo(0, 0);                    //  pnt
        this._temp2.setTo(this._p1x, this._p1y);    //  lastPnt

        this._points[0] = 0;

        for (var i = 1; i <= this._accuracy; i++)
        {
            this.getPoint(i / this._accuracy, this._temp1);

            totalLength += this._temp1.distance(this._temp2);

            this._points[i] = totalLength;
            this._temp2.copyFrom(this._temp1);
        }

        return totalLength;
    }

};

Object.defineProperties(Hermite.prototype, {

    /**
    * @name Phaser.Hermite#accuracy
    * @property {number} accuracy - The amount of points to pre-calculate on the curve.
    */
    accuracy: {

        enumerable: true,

        get: function ()
        {
            return this._accuracy;
        },

        set: function (value)
        {
            if (value !== this._accuracy)
            {
                this._accuracy = value;
                this.recalculate();
            }
        }

    },

    /**
    * @name Phaser.Hermite#p1x
    * @property {number} p1x - The x coordinate of the start of the curve. Setting this value will recalculate the curve.
    */
    p1x: {

        enumerable: true,

        get: function ()
        {
            return this._p1x;
        },

        set: function (value)
        {
            if (value !== this._p1x)
            {
                this._p1x = value;
                this.recalculate();
            }
        }

    },

    /**
    * @name Phaser.Hermite#p1y
    * @property {number} p1y - The y coordinate of the start of the curve. Setting this value will recalculate the curve.
    */
    p1y: {

        enumerable: true,

        get: function ()
        {
            return this._p1y;
        },

        set: function (value)
        {
            if (value !== this._p1y)
            {
                this._p1y = value;
                this.recalculate();
            }
        }

    },

    /**
    * @name Phaser.Hermite#p2x
    * @property {number} p2x - The x coordinate of the end of the curve. Setting this value will recalculate the curve.
    */
    p2x: {

        enumerable: true,

        get: function ()
        {
            return this._p2x;
        },

        set: function (value)
        {
            if (value !== this._p2x)
            {
                this._p2x = value;
                this.recalculate();
            }
        }

    },

    /**
    * @name Phaser.Hermite#p2y
    * @property {number} p2y - The y coordinate of the end of the curve. Setting this value will recalculate the curve.
    */
    p2y: {

        enumerable: true,

        get: function ()
        {
            return this._p2y;
        },

        set: function (value)
        {
            if (value !== this._p2y)
            {
                this._p2y = value;
                this.recalculate();
            }
        }

    },

    /**
    * @name Phaser.Hermite#v1x
    * @property {number} v1x - The x component of the tangent vector for the start of the curve. Setting this value will recalculate the curve.
    */
    v1x: {

        enumerable: true,

        get: function ()
        {
            return this._v1x;
        },

        set: function (value)
        {
            if (value !== this._v1x)
            {
                this._v1x = value;
                this.recalculate();
            }
        }

    },

    /**
    * @name Phaser.Hermite#v1y
    * @property {number} v1y - The y component of the tangent vector for the start of the curve. Setting this value will recalculate the curve.
    */
    v1y: {

        enumerable: true,

        get: function ()
        {
            return this._v1y;
        },

        set: function (value)
        {
            if (value !== this._v1y)
            {
                this._v1y = value;
                this.recalculate();
            }
        }

    },

    /**
    * @name Phaser.Hermite#v2x
    * @property {number} v2x - The x component of the tangent vector for the end of the curve. Setting this value will recalculate the curve.
    */
    v2x: {

        enumerable: true,

        get: function ()
        {
            return this._v2x;
        },

        set: function (value)
        {
            if (value !== this._v2x)
            {
                this._v2x = value;
                this.recalculate();
            }
        }

    },

    /**
    * @name Phaser.Hermite#v2y
    * @property {number} v2y - The y component of the tangent vector for the end of the curve. Setting this value will recalculate the curve.
    */
    v2y: {

        enumerable: true,

        get: function ()
        {
            return this._v2y;
        },

        set: function (value)
        {
            if (value !== this._v2y)
            {
                this._v2y = value;
                this.recalculate();
            }
        }

    }

});

module.exports = Hermite;
