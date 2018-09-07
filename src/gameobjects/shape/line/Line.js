/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

var Class = require('../../../utils/Class');
var Shape = require('../Shape');
var GeomLine = require('../../../geom/line/Line');
var LineRender = require('./LineRender');

/**
 * @classdesc
 *
 * @class Line
 * @extends Phaser.GameObjects.Shape
 * @memberOf Phaser.GameObjects
 * @constructor
 * @since 3.13.0
 *
 * @param {Phaser.Scene} scene - The Scene to which this Game Object belongs. A Game Object can only belong to one Scene at a time.
 * @param {number} x - The horizontal position of this Game Object in the world.
 * @param {number} y - The vertical position of this Game Object in the world.
 */
var Line = new Class({

    Extends: Shape,

    Mixins: [
        LineRender
    ],

    initialize:

    function Line (scene, x, y, x1, y1, x2, y2, fillColor, fillAlpha)
    {
        if (x === undefined) { x = 0; }
        if (y === undefined) { y = 0; }
        if (x1 === undefined) { x1 = 0; }
        if (y1 === undefined) { y1 = 0; }
        if (x2 === undefined) { x2 = 128; }
        if (y2 === undefined) { y2 = 0; }

        Shape.call(this, scene, 'Line', new GeomLine(x1, y1, x2, y2));

        var width = this.data.right - this.data.left;
        var height = this.data.bottom - this.data.top;

        this._startWidth = 1;
        this._endWidth = 1;

        this.setPosition(x, y);
        this.setSize(width, height);

        if (fillColor !== undefined)
        {
            this.setFillStyle(fillColor, fillAlpha);
        }

        this.updateDisplayOrigin();
    },

    setLineWidth: function (startWidth, endWidth)
    {
        if (endWidth === undefined) { endWidth = startWidth; }

        this._startWidth = startWidth;
        this._endWidth = endWidth;

        return this;
    },

    /**
     * [description]
     *
     * @method Phaser.Geom.Line#setTo
     * @since 3.13.0
     *
     * @param {number} [x1=0] - [description]
     * @param {number} [y1=0] - [description]
     * @param {number} [x2=0] - [description]
     * @param {number} [y2=0] - [description]
     *
     * @return {Phaser.Geom.Line} This Line object.
     */
    setTo: function (x1, y1, x2, y2)
    {
        this.data.setTo(x1, y1, x2, y2);

        return this;
    }

});

module.exports = Line;
