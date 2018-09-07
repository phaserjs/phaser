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
     * [description]
     *
     * @method Phaser.Geom.Triangle#setTo
     * @since 3.13.0
     *
     * @param {number} [x1=0] - [description]
     * @param {number} [y1=0] - [description]
     * @param {number} [x2=0] - [description]
     * @param {number} [y2=0] - [description]
     * @param {number} [x3=0] - [description]
     * @param {number} [y3=0] - [description]
     *
     * @return {Phaser.Geom.Triangle} This Triangle object.
     */
    setTo: function (x1, y1, x2, y2, x3, y3)
    {
        this.data.setTo(x1, y1, x2, y2, x3, y3);

        return this.updateData();
    },

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

        this.lineData = path;

        return this;
    }

});

module.exports = Triangle;
