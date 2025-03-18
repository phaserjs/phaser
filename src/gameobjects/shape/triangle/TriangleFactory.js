/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var GameObjectFactory = require('../../GameObjectFactory');
var Triangle = require('./Triangle');

/**
 * Creates a new Triangle Shape Game Object and adds it to the Scene.
 *
 * Note: This method will only be available if the Triangle Game Object has been built into Phaser.
 *
 * The Triangle Shape is a Game Object that can be added to a Scene, Group or Container. You can
 * treat it like any other Game Object in your game, such as tweening it, scaling it, or enabling
 * it for input or physics. It provides a quick and easy way for you to render this shape in your
 * game without using a texture, while still taking advantage of being fully batched in WebGL.
 *
 * This shape supports both fill and stroke colors.
 *
 * The Triangle consists of 3 lines, joining up to form a triangular shape. You can control the
 * position of each point of these lines. The triangle is always closed and cannot have an open
 * face. If you require that, consider using a Polygon instead.
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
