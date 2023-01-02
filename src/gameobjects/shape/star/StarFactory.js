/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2013-2023 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Star = require('./Star');
var GameObjectFactory = require('../../GameObjectFactory');

/**
 * Creates a new Star Shape Game Object and adds it to the Scene.
 *
 * Note: This method will only be available if the Star Game Object has been built into Phaser.
 *
 * The Star Shape is a Game Object that can be added to a Scene, Group or Container. You can
 * treat it like any other Game Object in your game, such as tweening it, scaling it, or enabling
 * it for input or physics. It provides a quick and easy way for you to render this shape in your
 * game without using a texture, while still taking advantage of being fully batched in WebGL.
 *
 * This shape supports both fill and stroke colors.
 *
 * As the name implies, the Star shape will display a star in your game. You can control several
 * aspects of it including the number of points that constitute the star. The default is 5. If
 * you change it to 4 it will render as a diamond. If you increase them, you'll get a more spiky
 * star shape.
 *
 * You can also control the inner and outer radius, which is how 'long' each point of the star is.
 * Modify these values to create more interesting shapes.
 *
 * @method Phaser.GameObjects.GameObjectFactory#star
 * @since 3.13.0
 *
 * @param {number} [x=0] - The horizontal position of this Game Object in the world.
 * @param {number} [y=0] - The vertical position of this Game Object in the world.
 * @param {number} [points=5] - The number of points on the star.
 * @param {number} [innerRadius=32] - The inner radius of the star.
 * @param {number} [outerRadius=64] - The outer radius of the star.
 * @param {number} [fillColor] - The color the star will be filled with, i.e. 0xff0000 for red.
 * @param {number} [fillAlpha] - The alpha the star will be filled with. You can also set the alpha of the overall Shape using its `alpha` property.
 *
 * @return {Phaser.GameObjects.Star} The Game Object that was created.
 */
GameObjectFactory.register('star', function (x, y, points, innerRadius, outerRadius, fillColor, fillAlpha)
{
    return this.displayList.add(new Star(this.scene, x, y, points, innerRadius, outerRadius, fillColor, fillAlpha));
});
