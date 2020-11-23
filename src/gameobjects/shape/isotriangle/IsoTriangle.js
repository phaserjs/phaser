/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Class = require('../../../utils/Class');
var IsoTriangleRender = require('./IsoTriangleRender');
var Shape = require('../Shape');

/**
 * @classdesc
 * The IsoTriangle Shape is a Game Object that can be added to a Scene, Group or Container. You can
 * treat it like any other Game Object in your game, such as tweening it, scaling it, or enabling
 * it for input or physics. It provides a quick and easy way for you to render this shape in your
 * game without using a texture, while still taking advantage of being fully batched in WebGL.
 * 
 * This shape supports only fill colors and cannot be stroked.
 * 
 * An IsoTriangle is an 'isometric' triangle. Think of it like a pyramid. Each face has a different
 * fill color. You can set the color of the top, left and right faces of the triangle respectively
 * You can also choose which of the faces are rendered via the `showTop`, `showLeft` and `showRight` properties.
 * 
 * You cannot view an IsoTriangle from under-neath, however you can change the 'angle' by setting
 * the `projection` property. The `reversed` property controls if the IsoTriangle is rendered upside
 * down or not.
 *
 * @class IsoTriangle
 * @extends Phaser.GameObjects.Shape
 * @memberof Phaser.GameObjects
 * @constructor
 * @since 3.13.0
 *
 * @param {Phaser.Scene} scene - The Scene to which this Game Object belongs. A Game Object can only belong to one Scene at a time.
 * @param {number} [x=0] - The horizontal position of this Game Object in the world.
 * @param {number} [y=0] - The vertical position of this Game Object in the world.
 * @param {number} [size=48] - The width of the iso triangle in pixels. The left and right faces will be exactly half this value.
 * @param {number} [height=32] - The height of the iso triangle. The left and right faces will be this tall. The overall height of the iso triangle will be this value plus half the `size` value.
 * @param {boolean} [reversed=false] - Is the iso triangle upside down?
 * @param {number} [fillTop=0xeeeeee] - The fill color of the top face of the iso triangle.
 * @param {number} [fillLeft=0x999999] - The fill color of the left face of the iso triangle.
 * @param {number} [fillRight=0xcccccc] - The fill color of the right face of the iso triangle.
 */
var IsoTriangle = new Class({

    Extends: Shape,

    Mixins: [
        IsoTriangleRender
    ],

    initialize:

    function IsoTriangle (scene, x, y, size, height, reversed, fillTop, fillLeft, fillRight)
    {
        if (x === undefined) { x = 0; }
        if (y === undefined) { y = 0; }
        if (size === undefined) { size = 48; }
        if (height === undefined) { height = 32; }
        if (reversed === undefined) { reversed = false; }
        if (fillTop === undefined) { fillTop = 0xeeeeee; }
        if (fillLeft === undefined) { fillLeft = 0x999999; }
        if (fillRight === undefined) { fillRight = 0xcccccc; }

        Shape.call(this, scene, 'IsoTriangle', null);

        /**
         * The projection level of the iso box. Change this to change the 'angle' at which you are looking at the box.
         *
         * @name Phaser.GameObjects.IsoTriangle#projection
         * @type {number}
         * @default 4
         * @since 3.13.0
         */
        this.projection = 4;

        /**
         * The color used to fill in the top of the iso triangle. This is only used if the triangle is reversed.
         *
         * @name Phaser.GameObjects.IsoTriangle#fillTop
         * @type {number}
         * @since 3.13.0
         */
        this.fillTop = fillTop;

        /**
         * The color used to fill in the left-facing side of the iso triangle.
         *
         * @name Phaser.GameObjects.IsoTriangle#fillLeft
         * @type {number}
         * @since 3.13.0
         */
        this.fillLeft = fillLeft;

        /**
         * The color used to fill in the right-facing side of the iso triangle.
         *
         * @name Phaser.GameObjects.IsoTriangle#fillRight
         * @type {number}
         * @since 3.13.0
         */
        this.fillRight = fillRight;

        /**
         * Controls if the top-face of the iso triangle be rendered.
         *
         * @name Phaser.GameObjects.IsoTriangle#showTop
         * @type {boolean}
         * @default true
         * @since 3.13.0
         */
        this.showTop = true;

        /**
         * Controls if the left-face of the iso triangle be rendered.
         *
         * @name Phaser.GameObjects.IsoTriangle#showLeft
         * @type {boolean}
         * @default true
         * @since 3.13.0
         */
        this.showLeft = true;

        /**
         * Controls if the right-face of the iso triangle be rendered.
         *
         * @name Phaser.GameObjects.IsoTriangle#showRight
         * @type {boolean}
         * @default true
         * @since 3.13.0
         */
        this.showRight = true;

        /**
         * Sets if the iso triangle will be rendered upside down or not.
         *
         * @name Phaser.GameObjects.IsoTriangle#isReversed
         * @type {boolean}
         * @default false
         * @since 3.13.0
         */
        this.isReversed = reversed;

        this.isFilled = true;

        this.setPosition(x, y);
        this.setSize(size, height);

        this.updateDisplayOrigin();
    },

    /**
     * Sets the projection level of the iso triangle. Change this to change the 'angle' at which you are looking at the pyramid.
     * This call can be chained.
     *
     * @method Phaser.GameObjects.IsoTriangle#setProjection
     * @since 3.13.0
     * 
     * @param {number} value - The value to set the projection to.
     *
     * @return {this} This Game Object instance.
     */
    setProjection: function (value)
    {
        this.projection = value;

        return this;
    },

    /**
     * Sets if the iso triangle will be rendered upside down or not.
     * This call can be chained.
     *
     * @method Phaser.GameObjects.IsoTriangle#setReversed
     * @since 3.13.0
     * 
     * @param {boolean} reversed - Sets if the iso triangle will be rendered upside down or not.
     *
     * @return {this} This Game Object instance.
     */
    setReversed: function (reversed)
    {
        this.isReversed = reversed;

        return this;
    },

    /**
     * Sets which faces of the iso triangle will be rendered.
     * This call can be chained.
     *
     * @method Phaser.GameObjects.IsoTriangle#setFaces
     * @since 3.13.0
     * 
     * @param {boolean} [showTop=true] - Show the top-face of the iso triangle (only if `reversed` is true)
     * @param {boolean} [showLeft=true] - Show the left-face of the iso triangle.
     * @param {boolean} [showRight=true] - Show the right-face of the iso triangle.
     *
     * @return {this} This Game Object instance.
     */
    setFaces: function (showTop, showLeft, showRight)
    {
        if (showTop === undefined) { showTop = true; }
        if (showLeft === undefined) { showLeft = true; }
        if (showRight === undefined) { showRight = true; }

        this.showTop = showTop;
        this.showLeft = showLeft;
        this.showRight = showRight;

        return this;
    },

    /**
     * Sets the fill colors for each face of the iso triangle.
     * This call can be chained.
     *
     * @method Phaser.GameObjects.IsoTriangle#setFillStyle
     * @since 3.13.0
     * 
     * @param {number} [fillTop] - The color used to fill the top of the iso triangle.
     * @param {number} [fillLeft] - The color used to fill in the left-facing side of the iso triangle.
     * @param {number} [fillRight] - The color used to fill in the right-facing side of the iso triangle.
     *
     * @return {this} This Game Object instance.
     */
    setFillStyle: function (fillTop, fillLeft, fillRight)
    {
        this.fillTop = fillTop;
        this.fillLeft = fillLeft;
        this.fillRight = fillRight;

        this.isFilled = true;

        return this;
    }

});

module.exports = IsoTriangle;
