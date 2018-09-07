/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

var GameObjectFactory = require('../../GameObjectFactory');
var Line = require('./Line');

/**
 * Creates a new Line Shape Game Object and adds it to the Scene.
 *
 * Note: This method will only be available if the Line Game Object has been built into Phaser.
 *
 * @method Phaser.GameObjects.GameObjectFactory#line
 * @since 3.13.0
 *
 * @param {number} [x=0] - The horizontal position of this Game Object in the world.
 * @param {number} [y=0] - The vertical position of this Game Object in the world.
 * @param {number} [x1=0] - The horizontal position of the first point in the triangle.
 * @param {number} [y1=0] - The horizontal position of the first point in the triangle.
 * @param {number} [x2=128] - The horizontal position of the second point in the triangle.
 * @param {number} [y2=0] - The horizontal position of the second point in the triangle.
 * @param {number} [fillColor] - The color the triangle will be filled with, i.e. 0xff0000 for red.
 * @param {number} [fillAlpha] - The alpha the triangle will be filled with. You can also set the alpha of the overall Shape using its `alpha` property.
 *
 * @return {Phaser.GameObjects.Line} The Game Object that was created.
 */
GameObjectFactory.register('line', function (x, y, x1, y1, x2, y2, fillColor, fillAlpha)
{
    return this.displayList.add(new Line(this.scene, x, y, x1, y1, x2, y2, fillColor, fillAlpha));
});
