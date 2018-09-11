/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

var GameObjectFactory = require('../../GameObjectFactory');
var Triangle = require('./Triangle');

/**
 * Creates a new Triangle Shape Game Object and adds it to the Scene.
 *
 * Note: This method will only be available if the Triangle Game Object has been built into Phaser.
 *
 * @method Phaser.GameObjects.GameObjectFactory#triangle
 * @since 3.13.0
 *
 * @param {number} [x=0] - The horizontal position of this Game Object in the world.
 * @param {number} [y=0] - The vertical position of this Game Object in the world.
 * @param {number} [x1=0] - The horizontal position of the first point in the triangle.
 * @param {number} [y1=128] - The vertical position of the first point in the triangle.
 * @param {number} [x2=64] - The horizontal position of the second point in the triangle.
 * @param {number} [y2=0] - The vertical position of the second point in the triangle.
 * @param {number} [x3=128] - The horizontal position of the third point in the triangle.
 * @param {number} [y3=128] - The vertical position of the third point in the triangle.
 * @param {number} [fillColor] - The color the triangle will be filled with, i.e. 0xff0000 for red.
 * @param {number} [fillAlpha] - The alpha the triangle will be filled with. You can also set the alpha of the overall Shape using its `alpha` property.
 *
 * @return {Phaser.GameObjects.Triangle} The Game Object that was created.
 */
GameObjectFactory.register('triangle', function (x, y, x1, y1, x2, y2, x3, y3, fillColor, fillAlpha)
{
    return this.displayList.add(new Triangle(this.scene, x, y, x1, y1, x2, y2, x3, y3, fillColor, fillAlpha));
});
