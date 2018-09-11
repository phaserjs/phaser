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
 * @param {number} [x=0] - The horizontal position of this Game Object in the world.
 * @param {number} [y=0] - The vertical position of this Game Object in the world.
 * @param {number} [x1=0] - The horizontal position of the start of the line.
 * @param {number} [y1=0] - The vertical position of the start of the line.
 * @param {number} [x2=128] - The horizontal position of the end of the line.
 * @param {number} [y2=0] - The vertical position of the end of the line.
 * @param {number} [strokeColor] - The color the line will be drawn in, i.e. 0xff0000 for red.
 * @param {number} [strokeAlpha] - The alpha the line will be drawn in. You can also set the alpha of the overall Shape using its `alpha` property.
 */
var Line = new Class({

    Extends: Shape,

    Mixins: [
        LineRender
    ],

    initialize:

    function Line (scene, x, y, x1, y1, x2, y2, strokeColor, strokeAlpha)
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

        /**
         * Private internal value. Holds the start width of the line.
         *
         * @name Phaser.GameObjects.Line#_startWidth
         * @type {number}
         * @private
         * @since 3.13.0
         */
        this._startWidth = 1;

        /**
         * Private internal value. Holds the end width of the line.
         *
         * @name Phaser.GameObjects.Line#_endWidth
         * @type {number}
         * @private
         * @since 3.13.0
         */
        this._endWidth = 1;

        this.setPosition(x, y);
        this.setSize(width, height);

        if (strokeColor !== undefined)
        {
            this.setStrokeStyle(1, strokeColor, strokeAlpha);
        }

        this.updateDisplayOrigin();
    },

    /**
     * Sets the width of the line.
     * 
     * When using the WebGL renderer you can have different start and end widths.
     * When using the Canvas renderer only the `startWidth` value is used. The `endWidth` is ignored.
     * 
     * This call can be chained.
     *
     * @method Phaser.GameObjects.Line#setLineWidth
     * @since 3.13.0
     * 
     * @param {number} startWidth - The start width of the line.
     * @param {number} [endWidth] - The end width of the line. Only used in WebGL.
     *
     * @return {this} This Game Object instance.
     */
    setLineWidth: function (startWidth, endWidth)
    {
        if (endWidth === undefined) { endWidth = startWidth; }

        this._startWidth = startWidth;
        this._endWidth = endWidth;

        this.lineWidth = startWidth;

        return this;
    },

    /**
     * Sets the start and end coordinates of this Line.
     *
     * @method Phaser.GameObjects.Line#setTo
     * @since 3.13.0
     *
     * @param {number} [x1=0] - The horizontal position of the start of the line.
     * @param {number} [y1=0] - The vertical position of the start of the line.
     * @param {number} [x2=0] - The horizontal position of the end of the line.
     * @param {number} [y2=0] - The vertical position of the end of the line.
     *
     * @return {this} This Line object.
     */
    setTo: function (x1, y1, x2, y2)
    {
        this.data.setTo(x1, y1, x2, y2);

        return this;
    }

});

module.exports = Line;
