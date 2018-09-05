/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

var PolygonRender = require('./PolygonRender');
var Class = require('../../utils/Class');
var Earcut = require('../../geom/polygon/Earcut');
var GetAABB = require('../../geom/polygon/GetAABB');
var GeomPolygon = require('../../geom/polygon/Polygon');
var Shape = require('./Shape');

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

    updateData: function ()
    {
        var path = [];
        var points = this.data.points;

        for (var i = 0; i < points.length; i++)
        {
            path.push(points[i].x, points[i].y);
        }

        // path = this.smooth(path);

        this.pathIndexes = Earcut(path);
        this.pathData = path;

        return this;
    },

    smooth: function (path)
    {
        var n = path.length,
            result = [],
            i = 0,
            resultIndex = 0,
            p0x, p0y, p1x, p1y;
    
        for (i; i<n-2; i+=2) {
            p0x = path[i];
            p0y = path[i+1];
            p1x = path[i+2];
            p1y = path[i+3];
    
            result[resultIndex++] = 0.75 * p0x + 0.25 * p1x;
            result[resultIndex++] = 0.75 * p0y + 0.25 * p1y;
            result[resultIndex++] = 0.25 * p0x + 0.75 * p1x;
            result[resultIndex++] = 0.25 * p0y + 0.75 * p1y;
        }
    
        return result;
    }

});

module.exports = Polygon;
