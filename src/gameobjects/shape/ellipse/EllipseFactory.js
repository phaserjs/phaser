/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2022 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Ellipse = require('./Ellipse');
var GameObjectFactory = require('../../GameObjectFactory');

/**
 * Creates a new Ellipse Shape Game Object and adds it to the Scene.
 *
 * Note: This method will only be available if the Ellipse Game Object has been built into Phaser.
 *
 * The Ellipse Shape is a Game Object that can be added to a Scene, Group or Container. You can
 * treat it like any other Game Object in your game, such as tweening it, scaling it, or enabling
 * it for input or physics. It provides a quick and easy way for you to render this shape in your
 * game without using a texture, while still taking advantage of being fully batched in WebGL.
 *
 * This shape supports both fill and stroke colors.
 *
 * When it renders it displays an ellipse shape. You can control the width and height of the ellipse.
 * If the width and height match it will render as a circle. If the width is less than the height,
 * it will look more like an egg shape.
 *
 * The Ellipse shape also has a `smoothness` property and corresponding `setSmoothness` method.
 * This allows you to control how smooth the shape renders in WebGL, by controlling the number of iterations
 * that take place during construction. Increase and decrease the default value for smoother, or more
 * jagged, shapes.
 *
 * @method Phaser.GameObjects.GameObjectFactory#ellipse
 * @since 3.13.0
 *
 * @param {number} [x=0] - The horizontal position of this Game Object in the world.
 * @param {number} [y=0] - The vertical position of this Game Object in the world.
 * @param {number} [width=128] - The width of the ellipse. An ellipse with equal width and height renders as a circle.
 * @param {number} [height=128] - The height of the ellipse. An ellipse with equal width and height renders as a circle.
 * @param {number} [fillColor] - The color the ellipse will be filled with, i.e. 0xff0000 for red.
 * @param {number} [fillAlpha] - The alpha the ellipse will be filled with. You can also set the alpha of the overall Shape using its `alpha` property.
 *
 * @return {Phaser.GameObjects.Ellipse} The Game Object that was created.
 */
GameObjectFactory.register('ellipse', function (x, y, width, height, fillColor, fillAlpha)
{
    return this.displayList.add(new Ellipse(this.scene, x, y, width, height, fillColor, fillAlpha));
});
