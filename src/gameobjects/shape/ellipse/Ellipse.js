/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

var EllipseRender = require('./EllipseRender');
var Class = require('../../../utils/Class');
var Earcut = require('../../../geom/polygon/Earcut');
var GeomEllipse = require('../../../geom/ellipse/Ellipse');
var Shape = require('../Shape');

/**
 * @classdesc
 *
 * @class Ellipse
 * @extends Phaser.GameObjects.Shape
 * @memberOf Phaser.GameObjects
 * @constructor
 * @since 3.13.0
 *
 * @param {Phaser.Scene} scene - The Scene to which this Game Object belongs. A Game Object can only belong to one Scene at a time.
 * @param {number} x - The horizontal position of this Game Object in the world.
 * @param {number} y - The vertical position of this Game Object in the world.
 */
var Ellipse = new Class({

    Extends: Shape,

    Mixins: [
        EllipseRender
    ],

    initialize:

    function Ellipse (scene, x, y, width, height, fillColor, fillAlpha)
    {
        if (x === undefined) { x = 0; }
        if (y === undefined) { y = 0; }
        if (width === undefined) { width = 128; }
        if (height === undefined) { height = 128; }

        Shape.call(this, scene, 'Ellipse', new GeomEllipse(width / 2, height / 2, width, height));

        //  The number of points used to draw the ellipse. Higher values create smoother renders at the cost of more triangles being drawn.
        this._smoothness = 64;

        this.setPosition(x, y);
        this.setSize(width, height);

        if (fillColor !== undefined)
        {
            this.setFillStyle(fillColor, fillAlpha);
        }

        this.updateDisplayOrigin();
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

    updateData: function ()
    {
        var path = [];
        var points = this.data.getPoints(this._smoothness);

        for (var i = 0; i < points.length; i++)
        {
            path.push(points[i].x, points[i].y);
        }

        this.pathIndexes = Earcut(path);
        this.pathData = path;

        return this;
    }

});

module.exports = Ellipse;
