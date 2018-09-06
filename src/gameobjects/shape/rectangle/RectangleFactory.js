/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

var GameObjectFactory = require('../../GameObjectFactory');
var Rectangle = require('./Rectangle');

/**
 * Creates a new Rectangle Shape Game Object and adds it to the Scene.
 *
 * Note: This method will only be available if the Rectangle Game Object has been built into Phaser.
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
