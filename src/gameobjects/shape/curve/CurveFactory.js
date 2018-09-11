/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

var GameObjectFactory = require('../../GameObjectFactory');
var Curve = require('./Curve');

/**
 * Creates a new Curve Shape Game Object and adds it to the Scene.
 *
 * Note: This method will only be available if the Curve Game Object has been built into Phaser.
 *
 * @method Phaser.GameObjects.GameObjectFactory#curve
 * @since 3.13.0
 *
 * @param {number} [x=0] - The horizontal position of this Game Object in the world.
 * @param {number} [y=0] - The vertical position of this Game Object in the world.
 * @param {Phaser.Curves.Curve} [curve] - The Curve object to use to create the Shape.
 * @param {number} [fillColor] - The color the curve will be filled with, i.e. 0xff0000 for red.
 * @param {number} [fillAlpha] - The alpha the curve will be filled with. You can also set the alpha of the overall Shape using its `alpha` property.
 *
 * @return {Phaser.GameObjects.Curve} The Game Object that was created.
 */
GameObjectFactory.register('curve', function (x, y, curve, fillColor, fillAlpha)
{
    return this.displayList.add(new Curve(this.scene, x, y, curve, fillColor, fillAlpha));
});
