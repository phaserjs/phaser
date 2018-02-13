/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

//  Based on the three.js Curve classes created by [zz85](http://www.lab4games.net/zz85/blog)

var Class = require('../utils/Class');
var Curve = require('./Curve');
var FromPoints = require('../geom/rectangle/FromPoints');
var Rectangle = require('../geom/rectangle/Rectangle');
var Vector2 = require('../math/Vector2');

var tmpVec2 = new Vector2();

/**
 * @classdesc
 * [description]
 *
 * @class LineCurve
 * @extends Phaser.Curves.Curve
 * @memberOf Phaser.Curves
 * @constructor
 * @since 3.0.0
 *
 * @param {Phaser.Math.Vector2} p0 - [description]
 * @param {Phaser.Math.Vector2} p1 - [description]
 */
var LineCurve = new Class({

    Extends: Curve,

    initialize:

    //  vec2s or array
    function LineCurve (p0, p1)
    {
        Curve.call(this, 'LineCurve');

        if (Array.isArray(p0))
        {
            p1 = new Vector2(p0[2], p0[3]);
            p0 = new Vector2(p0[0], p0[1]);
        }

        /**
         * [description]
         *
         * @name Phaser.Curves.LineCurve#p0
         * @type {Phaser.Math.Vector2}
         * @since 3.0.0
         */
        this.p0 = p0;

        /**
         * [description]
         *
         * @property Phaser.Curves.LineCurve#p1
         * @type {Phaser.Math.Vector2}
         * @since 3.0.0
         */
        this.p1 = p1;
    },

    /**
     * [description]
     *
     * @method Phaser.Curves.LineCurve#getBounds
     * @since 3.0.0
     *
     * @param {[type]} out - [description]
     *
     * @return {[type]} [description]
     */
    getBounds: function (out)
    {
        if (out === undefined) { out = new Rectangle(); }

        return FromPoints([ this.p0, this.p1 ], out);
    },

    /**
     * [description]
     *
     * @method Phaser.Curves.LineCurve#getStartPoint
     * @since 3.0.0
     *
     * @param {[type]} out - [description]
     *
     * @return {[type]} [description]
     */
    getStartPoint: function (out)
    {
        if (out === undefined) { out = new Vector2(); }

        return out.copy(this.p0);
    },

    /**
     * [description]
     *
     * @method Phaser.Curves.LineCurve#getResolution
     * @since 3.0.0
     *
     * @return {integer} [description]
     */
    getResolution: function ()
    {
        return 1;
    },

    /**
     * [description]
     *
     * @method Phaser.Curves.LineCurve#getPoint
     * @since 3.0.0
     *
     * @param {[type]} t - [description]
     * @param {[type]} out - [description]
     *
     * @return {[type]} [description]
     */
    getPoint: function (t, out)
    {
        if (out === undefined) { out = new Vector2(); }

        if (t === 1)
        {
            return out.copy(this.p1);
        }

        out.copy(this.p1).subtract(this.p0).scale(t).add(this.p0);

        return out;
    },

    // Line curve is linear, so we can overwrite default getPointAt
    /**
     * [description]
     *
     * @method Phaser.Curves.LineCurve#getPointAt
     * @since 3.0.0
     *
     * @param {[type]} u - [description]
     * @param {[type]} out - [description]
     *
     * @return {[type]} [description]
     */
    getPointAt: function (u, out)
    {
        return this.getPoint(u, out);
    },

    /**
     * [description]
     *
     * @method Phaser.Curves.LineCurve#getTangent
     * @since 3.0.0
     *
     * @return {[type]} [description]
     */
    getTangent: function ()
    {
        var tangent = tmpVec2.copy(this.p1).subtract(this.p0);

        return tangent.normalize();
    },

    //  Override default Curve.draw because this is better than calling getPoints on a line!
    /**
     * [description]
     *
     * @method Phaser.Curves.LineCurve#draw
     * @since 3.0.0
     *
     * @param {[type]} graphics - [description]
     *
     * @return {[type]} [description]
     */
    draw: function (graphics)
    {
        graphics.lineBetween(this.p0.x, this.p0.y, this.p1.x, this.p1.y);

        //  So you can chain graphics calls
        return graphics;
    },

    /**
     * [description]
     *
     * @method Phaser.Curves.LineCurve#toJSON
     * @since 3.0.0
     *
     * @return {[type]} [description]
     */
    toJSON: function ()
    {
        return {
            type: this.type,
            points: [
                this.p0.x, this.p0.y,
                this.p1.x, this.p1.y
            ]
        };
    }

});

LineCurve.fromJSON = function (data)
{
    var points = data.points;

    var p0 = new Vector2(points[0], points[1]);
    var p1 = new Vector2(points[2], points[3]);

    return new LineCurve(p0, p1);
};

module.exports = LineCurve;
