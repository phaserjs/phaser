/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2019 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Class = require('../../../utils/Class');
var Shape = require('../Shape');
var GridRender = require('./GridRender');

/**
 * @classdesc
 * The Grid Shape is a Game Object that can be added to a Scene, Group or Container. You can
 * treat it like any other Game Object in your game, such as tweening it, scaling it, or enabling
 * it for input or physics. It provides a quick and easy way for you to render this shape in your
 * game without using a texture, while still taking advantage of being fully batched in WebGL.
 * 
 * This shape supports only fill colors and cannot be stroked.
 * 
 * A Grid Shape allows you to display a grid in your game, where you can control the size of the
 * grid as well as the width and height of the grid cells. You can set a fill color for each grid
 * cell as well as an alternate fill color. When the alternate fill color is set then the grid
 * cells will alternate the fill colors as they render, creating a chess-board effect. You can
 * also optionally have an outline fill color. If set, this draws lines between the grid cells
 * in the given color. If you specify an outline color with an alpha of zero, then it will draw
 * the cells spaced out, but without the lines between them.
 *
 * @class Grid
 * @extends Phaser.GameObjects.Shape
 * @memberof Phaser.GameObjects
 * @constructor
 * @since 3.13.0
 *
 * @param {Phaser.Scene} scene - The Scene to which this Game Object belongs. A Game Object can only belong to one Scene at a time.
 * @param {number} [x=0] - The horizontal position of this Game Object in the world.
 * @param {number} [y=0] - The vertical position of this Game Object in the world.
 * @param {number} [width=128] - The width of the grid.
 * @param {number} [height=128] - The height of the grid.
 * @param {number} [cellWidth=32] - The width of one cell in the grid.
 * @param {number} [cellHeight=32] - The height of one cell in the grid.
 * @param {number} [fillColor] - The color the grid cells will be filled with, i.e. 0xff0000 for red.
 * @param {number} [fillAlpha] - The alpha the grid cells will be filled with. You can also set the alpha of the overall Shape using its `alpha` property.
 * @param {number} [outlineFillColor] - The color of the lines between the grid cells. See the `setOutline` method.
 * @param {number} [outlineFillAlpha] - The alpha of the lines between the grid cells.
 */
var Grid = new Class({

    Extends: Shape,

    Mixins: [
        GridRender
    ],

    initialize:

    function Grid (scene, x, y, width, height, cellWidth, cellHeight, fillColor, fillAlpha, outlineFillColor, outlineFillAlpha)
    {
        if (x === undefined) { x = 0; }
        if (y === undefined) { y = 0; }
        if (width === undefined) { width = 128; }
        if (height === undefined) { height = 128; }
        if (cellWidth === undefined) { cellWidth = 32; }
        if (cellHeight === undefined) { cellHeight = 32; }

        Shape.call(this, scene, 'Grid', null);

        /**
         * The width of each grid cell.
         * Must be a positive value.
         *
         * @name Phaser.GameObjects.Grid#cellWidth
         * @type {number}
         * @since 3.13.0
         */
        this.cellWidth = cellWidth;

        /**
         * The height of each grid cell.
         * Must be a positive value.
         *
         * @name Phaser.GameObjects.Grid#cellHeight
         * @type {number}
         * @since 3.13.0
         */
        this.cellHeight = cellHeight;

        /**
         * Will the grid render its cells in the `fillColor`?
         *
         * @name Phaser.GameObjects.Grid#showCells
         * @type {boolean}
         * @since 3.13.0
         */
        this.showCells = true;

        /**
         * The color of the lines between each grid cell.
         *
         * @name Phaser.GameObjects.Grid#outlineFillColor
         * @type {number}
         * @since 3.13.0
         */
        this.outlineFillColor = 0;

        /**
         * The alpha value for the color of the lines between each grid cell.
         *
         * @name Phaser.GameObjects.Grid#outlineFillAlpha
         * @type {number}
         * @since 3.13.0
         */
        this.outlineFillAlpha = 0;

        /**
         * Will the grid display the lines between each cell when it renders?
         *
         * @name Phaser.GameObjects.Grid#showOutline
         * @type {boolean}
         * @since 3.13.0
         */
        this.showOutline = true;

        /**
         * Will the grid render the alternating cells in the `altFillColor`?
         *
         * @name Phaser.GameObjects.Grid#showAltCells
         * @type {boolean}
         * @since 3.13.0
         */
        this.showAltCells = false;

        /**
         * The color the alternating grid cells will be filled with, i.e. 0xff0000 for red.
         *
         * @name Phaser.GameObjects.Grid#altFillColor
         * @type {number}
         * @since 3.13.0
         */
        this.altFillColor;

        /**
         * The alpha the alternating grid cells will be filled with.
         * You can also set the alpha of the overall Shape using its `alpha` property.
         *
         * @name Phaser.GameObjects.Grid#altFillAlpha
         * @type {number}
         * @since 3.13.0
         */
        this.altFillAlpha;

        this.setPosition(x, y);
        this.setSize(width, height);

        if (fillColor !== undefined)
        {
            this.setFillStyle(fillColor, fillAlpha);
        }

        if (outlineFillColor !== undefined)
        {
            this.setOutlineStyle(outlineFillColor, outlineFillAlpha);
        }

        this.updateDisplayOrigin();
    },

    /**
     * Sets the fill color and alpha level the grid cells will use when rendering.
     * 
     * If this method is called with no values then the grid cells will not be rendered, 
     * however the grid lines and alternating cells may still be.
     * 
     * Also see the `setOutlineStyle` and `setAltFillStyle` methods.
     * 
     * This call can be chained.
     *
     * @method Phaser.GameObjects.Grid#setFillStyle
     * @since 3.13.0
     * 
     * @param {number} [fillColor] - The color the grid cells will be filled with, i.e. 0xff0000 for red.
     * @param {number} [fillAlpha=1] - The alpha the grid cells will be filled with. You can also set the alpha of the overall Shape using its `alpha` property.
     *
     * @return {this} This Game Object instance.
     */
    setFillStyle: function (fillColor, fillAlpha)
    {
        if (fillAlpha === undefined) { fillAlpha = 1; }

        if (fillColor === undefined)
        {
            this.showCells = false;
        }
        else
        {
            this.fillColor = fillColor;
            this.fillAlpha = fillAlpha;
            this.showCells = true;
        }

        return this;
    },

    /**
     * Sets the fill color and alpha level that the alternating grid cells will use.
     * 
     * If this method is called with no values then alternating grid cells will not be rendered in a different color.
     * 
     * Also see the `setOutlineStyle` and `setFillStyle` methods.
     * 
     * This call can be chained.
     *
     * @method Phaser.GameObjects.Grid#setAltFillStyle
     * @since 3.13.0
     * 
     * @param {number} [fillColor] - The color the alternating grid cells will be filled with, i.e. 0xff0000 for red.
     * @param {number} [fillAlpha=1] - The alpha the alternating grid cells will be filled with. You can also set the alpha of the overall Shape using its `alpha` property.
     *
     * @return {this} This Game Object instance.
     */
    setAltFillStyle: function (fillColor, fillAlpha)
    {
        if (fillAlpha === undefined) { fillAlpha = 1; }

        if (fillColor === undefined)
        {
            this.showAltCells = false;
        }
        else
        {
            this.altFillColor = fillColor;
            this.altFillAlpha = fillAlpha;
            this.showAltCells = true;
        }

        return this;
    },

    /**
     * Sets the fill color and alpha level that the lines between each grid cell will use.
     * 
     * If this method is called with no values then the grid lines will not be rendered at all, however
     * the cells themselves may still be if they have colors set.
     * 
     * Also see the `setFillStyle` and `setAltFillStyle` methods.
     * 
     * This call can be chained.
     *
     * @method Phaser.GameObjects.Grid#setOutlineStyle
     * @since 3.13.0
     * 
     * @param {number} [fillColor] - The color the lines between the grid cells will be filled with, i.e. 0xff0000 for red.
     * @param {number} [fillAlpha=1] - The alpha the lines between the grid cells will be filled with. You can also set the alpha of the overall Shape using its `alpha` property.
     *
     * @return {this} This Game Object instance.
     */
    setOutlineStyle: function (fillColor, fillAlpha)
    {
        if (fillAlpha === undefined) { fillAlpha = 1; }

        if (fillColor === undefined)
        {
            this.showOutline = false;
        }
        else
        {
            this.outlineFillColor = fillColor;
            this.outlineFillAlpha = fillAlpha;
            this.showOutline = true;
        }

        return this;
    }

});

module.exports = Grid;
