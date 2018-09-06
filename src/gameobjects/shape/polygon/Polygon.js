/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

var PolygonRender = require('./PolygonRender');
var Class = require('../../../utils/Class');
var Earcut = require('../../../geom/polygon/Earcut');
var GetAABB = require('../../../geom/polygon/GetAABB');
var GeomPolygon = require('../../../geom/polygon/Polygon');
var Shape = require('../Shape');
var Smooth = require('../../../geom/polygon/Smooth');

/**
 * @classdesc
 *
 * @class Polygon
 * @extends Phaser.GameObjects.Shape
 * @memberOf Phaser.GameObjects
 * @constructor
 * @since 3.13.0
 *
 * @param {Phaser.Scene} scene - The Scene to which this Game Object belongs. A Game Object can only belong to one Scene at a time.
 * @param {number} x - The horizontal position of this Game Object in the world.
 * @param {number} y - The vertical position of this Game Object in the world.
 */
var Polygon = new Class({

    Extends: Shape,

    Mixins: [
        PolygonRender
    ],

    initialize:

    function Polygon (scene, x, y, points, fillColor, fillAlpha)
    {
        Shape.call(this, scene, 'Polygon', new GeomPolygon(points));

        this.pathData = [];
        this.pathIndexes = [];

        this.setPosition(x, y);

        var bounds = GetAABB(this.data);

        this.setSize(bounds.width, bounds.height);

        this.updateDisplayOrigin();

        if (fillColor !== undefined)
        {
            this.setFillStyle(fillColor, fillAlpha);
        }

        this.updateData();
    },

    smooth: function (iterations)
    {
        if (iterations === undefined) { iterations = 1; }

        for (var i = 0; i < iterations; i++)
        {
            Smooth(this.data);
        }

        return this.updateData();
    },

    updateData: function ()
    {
        var path = [];
        var points = this.data.points;

        for (var i = 0; i < points.length; i++)
        {
            path.push(points[i].x, points[i].y);
        }

        this.pathIndexes = Earcut(path);
        this.pathData = path;

        return this;
    }

});

module.exports = Polygon;
