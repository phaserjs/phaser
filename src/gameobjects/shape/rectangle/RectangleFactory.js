/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2022 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var GameObjectFactory = require('../../GameObjectFactory');
var Rectangle = require('./Rectangle');

/**
 * Creates a new Rectangle Shape Game Object and adds it to the Scene.
 *
 * Note: This method will only be available if the Rectangle Game Object has been built into Phaser.
 *
 * The Rectangle Shape is a Game Object that can be added to a Scene, Group or Container. You can
 * treat it like any other Game Object in your game, such as tweening it, scaling it, or enabling
 * it for input or physics. It provides a quick and easy way for you to render this shape in your
 * game without using a texture, while still taking advantage of being fully batched in WebGL.
 *
 * This shape supports both fill and stroke colors.
 *
 * You can change the size of the rectangle by changing the `width` and `height` properties.
 *
 * @method Phaser.GameObjects.GameObjectFactory#rectangle
 * @since 3.13.0
 *
 * @param {number} [x=0] - The horizontal position of this Game Object in the world.
 * @param {number} [y=0] - The vertical position of this Game Object in the world.
 * @param {number} [width=128] - The width of the rectangle.
 * @param {number} [height=128] - The height of the rectangle.
 * @param {number} [fillColor] - The color the rectangle will be filled with, i.e. 0xff0000 for red.
 * @param {number} [fillAlpha] - The alpha the rectangle will be filled with. You can also set the alpha of the overall Shape using its `alpha` property.
 *
 * @return {Phaser.GameObjects.Rectangle} The Game Object that was created.
 */
GameObjectFactory.register('rectangle', function (x, y, width, height, fillColor, fillAlpha)
{
    return this.displayList.add(new Rectangle(this.scene, x, y, width, height, fillColor, fillAlpha));
});
