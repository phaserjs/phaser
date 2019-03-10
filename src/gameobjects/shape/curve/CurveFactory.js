/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2019 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

var GameObjectFactory = require('../../GameObjectFactory');
var Curve = require('./Curve');

/**
 * Creates a new Curve Shape Game Object and adds it to the Scene.
 *
 * Note: This method will only be available if the Curve Game Object has been built into Phaser.
 * 
 * The Curve Shape is a Game Object that can be added to a Scene, Group or Container. You can
 * treat it like any other Game Object in your game, such as tweening it, scaling it, or enabling
 * it for input or physics. It provides a quick and easy way for you to render this shape in your
 * game without using a texture, while still taking advantage of being fully batched in WebGL.
 * 
 * This shape supports both fill and stroke colors.
 * 
 * To render a Curve Shape you must first create a `Phaser.Curves.Curve` object, then pass it to
 * the Curve Shape in the constructor.
 * 
 * The Curve shape also has a `smoothness` property and corresponding `setSmoothness` method.
 * This allows you to control how smooth the shape renders in WebGL, by controlling the number of iterations
 * that take place during construction. Increase and decrease the default value for smoother, or more
 * jagged, shapes.
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
