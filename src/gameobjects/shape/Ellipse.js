/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

var EllipseRender = require('./EllipseRender');
var Class = require('../../utils/Class');
var Earcut = require('../../geom/polygon/Earcut');
var GeomEllipse = require('../../geom/ellipse/Ellipse');
var Shape = require('./Shape');

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

    function Ellipse (scene, x, y, width, height, fillColor, fillAlpha, smoothness)
    {
        if (smoothness === undefined) { smoothness = 32; }

        Shape.call(this, scene, 'Ellipse', new GeomEllipse(0, 0, width, height));

        this.pathData = [];
        this.pathIndexes = [];
        this.smoothness = smoothness;

        this.setPosition(x, y);

        this.setSize(width, height);

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
        var points = this.data.getPoints(this.smoothness);

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
