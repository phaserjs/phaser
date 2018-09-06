/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

var Star = require('./Star');
var GameObjectFactory = require('../../GameObjectFactory');

/**
 * Creates a new Star Shape Game Object and adds it to the Scene.
 *
 * Note: This method will only be available if the Star Game Object has been built into Phaser.
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
