/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2019 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Class = require('../../../utils/Class');
var Shape = require('../Shape');
var GeomLine = require('../../../geom/line/Line');
var LineRender = require('./LineRender');

/**
 * @classdesc
 * The Line Shape is a Game Object that can be added to a Scene, Group or Container. You can
 * treat it like any other Game Object in your game, such as tweening it, scaling it, or enabling
 * it for input or physics. It provides a quick and easy way for you to render this shape in your
 * game without using a texture, while still taking advantage of being fully batched in WebGL.
 * 
 * This shape supports only stroke colors and cannot be filled.
 * 
 * A Line Shape allows you to draw a line between two points in your game. You can control the
 * stroke color and thickness of the line. In WebGL only you can also specify a different
 * thickness for the start and end of the line, allowing you to render lines that taper-off.
 * 
 * If you need to draw multiple lines in a sequence you may wish to use the Polygon Shape instead.
 *
 * Be aware that as with all Game Objects the default origin is 0.5. If you need to draw a Line
 * between two points and want the x1/y1 values to match the x/y values, then set the origin to 0.
 *
 * @class Line
 * @extends Phaser.GameObjects.Shape
 * @memberof Phaser.GameObjects
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

        var width = this.geom.right - this.geom.left;
        var height = this.geom.bottom - this.geom.top;

        /**
         * The width (or thickness) of the line.
         * See the setLineWidth method for extra details on changing this on WebGL.
         *
         * @name Phaser.GameObjects.Line#lineWidth
         * @type {number}
         * @since 3.13.0
         */
        this.lineWidth = 1;

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
        this.geom.setTo(x1, y1, x2, y2);

        return this;
    }

});

module.exports = Line;
