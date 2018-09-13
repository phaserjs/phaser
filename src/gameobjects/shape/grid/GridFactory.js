/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

var GameObjectFactory = require('../../GameObjectFactory');
var Grid = require('./Grid');

/**
 * Creates a new Grid Shape Game Object and adds it to the Scene.
 *
 * Note: This method will only be available if the Grid Game Object has been built into Phaser.
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
