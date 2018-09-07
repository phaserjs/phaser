/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

var Class = require('../../../utils/Class');
var CurveRender = require('./CurveRender');
var Earcut = require('../../../geom/polygon/Earcut');
var Rectangle = require('../../../geom/rectangle/Rectangle');
var Shape = require('../Shape');

/**
 * @classdesc
 *
 * @class Curve
 * @extends Phaser.GameObjects.Shape
 * @memberOf Phaser.GameObjects
 * @constructor
 * @since 3.13.0
 *
 * @param {Phaser.Scene} scene - The Scene to which this Game Object belongs. A Game Object can only belong to one Scene at a time.
 * @param {number} x - The horizontal position of this Game Object in the world.
 * @param {number} y - The vertical position of this Game Object in the world.
 */
var Curve = new Class({

    Extends: Shape,

    Mixins: [
        CurveRender
    ],

    initialize:

    function Curve (scene, x, y, curve, fillColor, fillAlpha)
    {
        if (x === undefined) { x = 0; }
        if (y === undefined) { y = 0; }

        Shape.call(this, scene, 'Curve', curve);

        //  The number of points used to draw the curve. Higher values create smoother renders at the cost of more triangles being drawn.
        this._smoothness = 32;

        this._curveBounds = new Rectangle();

        this.closePath = false;

        this.setPosition(x, y);

        if (fillColor !== undefined)
        {
            this.setFillStyle(fillColor, fillAlpha);
        }

        this.updateData();
    },

    smoothness: {

        get: function ()
        {
            return this._smoothness;
        },

        set: function (value)
        {
            this._smoothness = value;

            this.updateData();
        }

    },

    setSmoothness: function (value)
    {
        this._smoothness = value;

        return this.updateData();
    },

    setClosePath: function (value)
    {
        this.closePath = value;

        return this;
    },

    updateData: function ()
    {
        var bounds = this._curveBounds;
        var smoothness = this._smoothness;

        //  Update the bounds in case the underlying data has changed
        this.data.getBounds(bounds, smoothness);

        this.setSize(bounds.width, bounds.height);
        this.updateDisplayOrigin();

        var path = [];
        var points = this.data.getPoints(smoothness);

        for (var i = 0; i < points.length; i++)
        {
            path.push(points[i].x, points[i].y);
        }

        path.push(points[0].x, points[0].y);

        this.pathIndexes = Earcut(path);
        this.pathData = path;

        return this;
    }

});

module.exports = Curve;
