/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

var Class = require('../../utils/Class');
var Shape = require('./Shape');
var GeomTriangle = require('../../geom/triangle/Triangle');
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
 * @param {number} x - The horizontal position of this Game Object in the world.
 * @param {number} y - The vertical position of this Game Object in the world.
 */
var Triangle = new Class({

    Extends: Shape,

    Mixins: [
        TriangleRender
    ],

    initialize:

    function Triangle (scene, x, y, x1, y1, x2, y2, x3, y3, fillColor, fillAlpha)
    {
        Shape.call(this, scene, 'Triangle', new GeomTriangle(x1, y1, x2, y2, x3, y3));

        var width = this.data.right - this.data.left;
        var height = this.data.bottom - this.data.top;

        this.setPosition(x, y);
        this.setSize(width, height);

        this.updateDisplayOrigin();

        if (fillColor !== undefined)
        {
            this.setFillStyle(fillColor, fillAlpha);
        }
    }

});

module.exports = Triangle;
