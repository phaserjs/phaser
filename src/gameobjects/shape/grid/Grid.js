/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2025 Phaser Studio Inc.
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
 * A Grid Shape allows you to display a grid in your game, where you can control the size of the
 * grid as well as the width and height of the grid cells. You can set a fill color for each grid
 * cell as well as an alternate fill color. When the alternate fill color is set then the grid
 * cells will alternate the fill colors as they render, creating a chess-board effect. You can
 * also optionally have a stroke fill color. If set, this draws lines between the grid cells
 * in the given color. If you specify a stroke color with an alpha of zero, then it will draw
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
 * @param {number} [strokeFillColor] - The color of the lines between the grid cells. See the `setStrokeStyle` method.
 * @param {number} [strokeFillAlpha] - The alpha of the lines between the grid cells.
 */
var Grid = new Class({

    Extends: Shape,

    Mixins: [
        GridRender
    ],

    initialize:

    function Grid (scene, x, y, width, height, cellWidth, cellHeight, fillColor, fillAlpha, strokeFillColor, strokeFillAlpha)
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

        /**
         * The padding around each cell. The effective gutter between cells is
         * twice this value.
         *
         * @name Phaser.GameObjects.Grid#cellPadding
         * @type {number}
         * @since 4.0.0
         * @default 0.5
         */
        this.cellPadding = 0.5;

        /**
         * Whether to stroke on the outside edges of the Grid object.
         *
         * @name Phaser.GameObjects.Grid#strokeOutside
         * @type {boolean}
         * @since 4.0.0
         * @default false
         */
        this.strokeOutside = false;

        /**
         * Whether to stroke on the outside edges of the Grid object
         * when the cell is incomplete, e.g. the grid size does not
         * evenly fit the cell size.
         *
         * This only has an effect if `strokeOutside` is `true`.
         * It will affect the right and bottom edges of the grid.
         *
         * @name Phaser.GameObjects.Grid#strokeOutsideIncomplete
         * @type {boolean}
         * @since 4.0.0
         * @default false
         */
        this.strokeOutsideIncomplete = true;

        this.setPosition(x, y);
        this.setSize(width, height);

        this.setFillStyle(fillColor, fillAlpha);

        if (strokeFillColor !== undefined)
        {
            this.setStrokeStyle(strokeFillColor, strokeFillAlpha);
        }

        this.updateDisplayOrigin();
    },

    /**
     * Sets the fill color and alpha level that the alternating grid cells will use.
     *
     * If this method is called with no values then alternating grid cells will not be rendered in a different color.
     *
     * Also see the `setStrokeStyle` and `setFillStyle` methods.
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
     * Sets the cell padding for the grid.
     * The cell padding is the space around each cell, between the cells.
     * The effective gutter between cells is twice this value.
     *
     * If this method is called with no value then the cell padding is set to zero.
     *
     * This call can be chained.
     *
     * @method Phaser.GameObjects.Grid#setCellPadding
     * @since 4.0.0
     * @param {number} [value] - The cell padding value.
     * @return {this} This Game Object instance.
     */
    setCellPadding: function (value)
    {
        this.cellPadding = value || 0;

        return this;
    },

    /**
     * Sets how to stroke the outside of the Grid object.
     *
     * This call can be chained.
     *
     * @method Phaser.GameObjects.Grid#setStrokeOutside
     * @since 4.0.0
     * @param {boolean} strokeOutside - Whether to stroke the outside edges of the Grid object.
     * @param {boolean} [strokeOutsideIncomplete] - Whether to stroke the outside edges of the Grid object when the cell is incomplete.
     */
    setStrokeOutside: function (strokeOutside, strokeOutsideIncomplete)
    {
        this.strokeOutside = strokeOutside;

        if (strokeOutsideIncomplete !== undefined)
        {
            this.strokeOutsideIncomplete = strokeOutsideIncomplete;
        }

        return this;
    }

});

module.exports = Grid;
