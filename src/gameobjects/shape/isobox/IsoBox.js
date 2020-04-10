/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var IsoBoxRender = require('./IsoBoxRender');
var Class = require('../../../utils/Class');
var Shape = require('../Shape');

/**
 * @classdesc
 * The IsoBox Shape is a Game Object that can be added to a Scene, Group or Container. You can
 * treat it like any other Game Object in your game, such as tweening it, scaling it, or enabling
 * it for input or physics. It provides a quick and easy way for you to render this shape in your
 * game without using a texture, while still taking advantage of being fully batched in WebGL.
 * 
 * This shape supports only fill colors and cannot be stroked.
 * 
 * An IsoBox is an 'isometric' rectangle. Each face of it has a different fill color. You can set
 * the color of the top, left and right faces of the rectangle respectively. You can also choose
 * which of the faces are rendered via the `showTop`, `showLeft` and `showRight` properties.
 * 
 * You cannot view an IsoBox from under-neath, however you can change the 'angle' by setting
 * the `projection` property.
 *
 * @class IsoBox
 * @extends Phaser.GameObjects.Shape
 * @memberof Phaser.GameObjects
 * @constructor
 * @since 3.13.0
 *
 * @param {Phaser.Scene} scene - The Scene to which this Game Object belongs. A Game Object can only belong to one Scene at a time.
 * @param {number} [x=0] - The horizontal position of this Game Object in the world.
 * @param {number} [y=0] - The vertical position of this Game Object in the world.
 * @param {number} [size=48] - The width of the iso box in pixels. The left and right faces will be exactly half this value.
 * @param {number} [height=32] - The height of the iso box. The left and right faces will be this tall. The overall height of the isobox will be this value plus half the `size` value.
 * @param {number} [fillTop=0xeeeeee] - The fill color of the top face of the iso box.
 * @param {number} [fillLeft=0x999999] - The fill color of the left face of the iso box.
 * @param {number} [fillRight=0xcccccc] - The fill color of the right face of the iso box.
 */
var IsoBox = new Class({

    Extends: Shape,

    Mixins: [
        IsoBoxRender
    ],

    initialize:

    function IsoBox (scene, x, y, size, height, fillTop, fillLeft, fillRight)
    {
        if (x === undefined) { x = 0; }
        if (y === undefined) { y = 0; }
        if (size === undefined) { size = 48; }
        if (height === undefined) { height = 32; }
        if (fillTop === undefined) { fillTop = 0xeeeeee; }
        if (fillLeft === undefined) { fillLeft = 0x999999; }
        if (fillRight === undefined) { fillRight = 0xcccccc; }

        Shape.call(this, scene, 'IsoBox', null);

        /**
         * The projection level of the iso box. Change this to change the 'angle' at which you are looking at the box.
         *
         * @name Phaser.GameObjects.IsoBox#projection
         * @type {integer}
         * @default 4
         * @since 3.13.0
         */
        this.projection = 4;

        /**
         * The color used to fill in the top of the iso box.
         *
         * @name Phaser.GameObjects.IsoBox#fillTop
         * @type {number}
         * @since 3.13.0
         */
        this.fillTop = fillTop;

        /**
         * The color used to fill in the left-facing side of the iso box.
         *
         * @name Phaser.GameObjects.IsoBox#fillLeft
         * @type {number}
         * @since 3.13.0
         */
        this.fillLeft = fillLeft;

        /**
         * The color used to fill in the right-facing side of the iso box.
         *
         * @name Phaser.GameObjects.IsoBox#fillRight
         * @type {number}
         * @since 3.13.0
         */
        this.fillRight = fillRight;

        /**
         * Controls if the top-face of the iso box be rendered.
         *
         * @name Phaser.GameObjects.IsoBox#showTop
         * @type {boolean}
         * @default true
         * @since 3.13.0
         */
        this.showTop = true;

        /**
         * Controls if the left-face of the iso box be rendered.
         *
         * @name Phaser.GameObjects.IsoBox#showLeft
         * @type {boolean}
         * @default true
         * @since 3.13.0
         */
        this.showLeft = true;

        /**
         * Controls if the right-face of the iso box be rendered.
         *
         * @name Phaser.GameObjects.IsoBox#showRight
         * @type {boolean}
         * @default true
         * @since 3.13.0
         */
        this.showRight = true;

        this.isFilled = true;

        this.setPosition(x, y);
        this.setSize(size, height);

        this.updateDisplayOrigin();
    },

    /**
     * Sets the projection level of the iso box. Change this to change the 'angle' at which you are looking at the box.
     * This call can be chained.
     *
     * @method Phaser.GameObjects.IsoBox#setProjection
     * @since 3.13.0
     * 
     * @param {integer} value - The value to set the projection to.
     *
     * @return {this} This Game Object instance.
     */
    setProjection: function (value)
    {
        this.projection = value;

        return this;
    },

    /**
     * Sets which faces of the iso box will be rendered.
     * This call can be chained.
     *
     * @method Phaser.GameObjects.IsoBox#setFaces
     * @since 3.13.0
     * 
     * @param {boolean} [showTop=true] - Show the top-face of the iso box.
     * @param {boolean} [showLeft=true] - Show the left-face of the iso box.
     * @param {boolean} [showRight=true] - Show the right-face of the iso box.
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
     * Sets the fill colors for each face of the iso box.
     * This call can be chained.
     *
     * @method Phaser.GameObjects.IsoBox#setFillStyle
     * @since 3.13.0
     * 
     * @param {number} [fillTop] - The color used to fill the top of the iso box.
     * @param {number} [fillLeft] - The color used to fill in the left-facing side of the iso box.
     * @param {number} [fillRight] - The color used to fill in the right-facing side of the iso box.
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

module.exports = IsoBox;
