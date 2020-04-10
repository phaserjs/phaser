/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var GameObjectFactory = require('../../GameObjectFactory');
var Grid = require('./Grid');

/**
 * Creates a new Grid Shape Game Object and adds it to the Scene.
 *
 * Note: This method will only be available if the Grid Game Object has been built into Phaser.
 * 
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
 * @method Phaser.GameObjects.GameObjectFactory#grid
 * @since 3.13.0
 *
 * @param {number} [x=0] - The horizontal position of this Game Object in the world.
 * @param {number} [y=0] - The vertical position of this Game Object in the world.
 * @param {number} [width=128] - The width of the grid.
 * @param {number} [height=128] - The height of the grid.
 * @param {number} [cellWidth=32] - The width of one cell in the grid.
 * @param {number} [cellHeight=32] - The height of one cell in the grid.
 * @param {number} [fillColor] - The color the grid cells will be filled with, i.e. 0xff0000 for red.
 * @param {number} [fillAlpha] - The alpha the grid cells will be filled with. You can also set the alpha of the overall Shape using its `alpha` property.
 * @param {number} [outlineFillColor] - The color of the lines between the grid cells.
 * @param {number} [outlineFillAlpha] - The alpha of the lines between the grid cells.
 *
 * @return {Phaser.GameObjects.Grid} The Game Object that was created.
 */
GameObjectFactory.register('grid', function (x, y, width, height, cellWidth, cellHeight, fillColor, fillAlpha, outlineFillColor, outlineFillAlpha)
{
    return this.displayList.add(new Grid(this.scene, x, y, width, height, cellWidth, cellHeight, fillColor, fillAlpha, outlineFillColor, outlineFillAlpha));
});
