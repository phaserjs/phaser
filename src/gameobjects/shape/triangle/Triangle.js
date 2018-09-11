/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

var Class = require('../../../utils/Class');
var Shape = require('../Shape');
var GeomTriangle = require('../../../geom/triangle/Triangle');
var TriangleRender = require('./TriangleRender');

/**
 * @classdesc
 *
 * @class Triangle
 * @extends Phaser.GameObjects.Shape
 * @memberOf Phaser.GameObjects
 * @constructor
 * @since 3.13.0
 *
 * @param {Phaser.Scene} scene - The Scene to which this Game Object belongs. A Game Object can only belong to one Scene at a time.
 * @param {number} [x=0] - The horizontal position of this Game Object in the world.
 * @param {number} [y=0] - The vertical position of this Game Object in the world.
 * @param {number} [x1=0] - The horizontal position of the first point in the triangle.
 * @param {number} [y1=128] - The vertical position of the first point in the triangle.
 * @param {number} [x2=64] - The horizontal position of the second point in the triangle.
 * @param {number} [y2=0] - The vertical position of the second point in the triangle.
 * @param {number} [x3=128] - The horizontal position of the third point in the triangle.
 * @param {number} [y3=128] - The vertical position of the third point in the triangle.
 * @param {number} [fillColor] - The color the triangle will be filled with, i.e. 0xff0000 for red.
 * @param {number} [fillAlpha] - The alpha the triangle will be filled with. You can also set the alpha of the overall Shape using its `alpha` property.
 */
var Triangle = new Class({

    Extends: Shape,

    Mixins: [
        TriangleRender
    ],

    initialize:

    function Triangle (scene, x, y, x1, y1, x2, y2, x3, y3, fillColor, fillAlpha)
    {
        if (x === undefined) { x = 0; }
        if (y === undefined) { y = 0; }
        if (x1 === undefined) { x1 = 0; }
        if (y1 === undefined) { y1 = 128; }
        if (x2 === undefined) { x2 = 64; }
        if (y2 === undefined) { y2 = 0; }
        if (x3 === undefined) { x3 = 128; }
        if (y3 === undefined) { y3 = 128; }

        Shape.call(this, scene, 'Triangle', new GeomTriangle(x1, y1, x2, y2, x3, y3));

        var width = this.data.right - this.data.left;
        var height = this.data.bottom - this.data.top;

        this.setPosition(x, y);
        this.setSize(width, height);

        if (fillColor !== undefined)
        {
            this.setFillStyle(fillColor, fillAlpha);
        }

        this.updateDisplayOrigin();
        this.updateData();
    },

    /**
     * Sets the data for the lines that make up this Triangle shape.
     *
     * @method Phaser.GameObjects.Triangle#setTo
     * @since 3.13.0
     *
     * @param {number} [x1=0] - The horizontal position of the first point in the triangle.
     * @param {number} [y1=0] - The vertical position of the first point in the triangle.
     * @param {number} [x2=0] - The horizontal position of the second point in the triangle.
     * @param {number} [y2=0] - The vertical position of the second point in the triangle.
     * @param {number} [x3=0] - The horizontal position of the third point in the triangle.
     * @param {number} [y3=0] - The vertical position of the third point in the triangle.
     *
     * @return {this} This Game Object instance.
     */
    setTo: function (x1, y1, x2, y2, x3, y3)
    {
        this.data.setTo(x1, y1, x2, y2, x3, y3);

        return this.updateData();
    },

    /**
     * Internal method that updates the data and path values.
     *
     * @method Phaser.GameObjects.Triangle#updateData
     * @private
     * @since 3.13.0
     *
     * @return {this} This Game Object instance.
     */
    updateData: function ()
    {
        var path = [];
        var rect = this.data;
        var line = this._tempLine;

        rect.getLineA(line);

        path.push(line.x1, line.y1, line.x2, line.y2);

        rect.getLineB(line);

        path.push(line.x2, line.y2);

        rect.getLineC(line);

        path.push(line.x2, line.y2);

        this.pathData = path;

        return this;
    }

});

module.exports = Triangle;
