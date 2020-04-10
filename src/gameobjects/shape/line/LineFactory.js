/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var GameObjectFactory = require('../../GameObjectFactory');
var Line = require('./Line');

/**
 * Creates a new Line Shape Game Object and adds it to the Scene.
 *
 * Note: This method will only be available if the Line Game Object has been built into Phaser.
 * 
 * The Line Shape is a Game Object that can be added to a Scene, Group or Container. You can
 * treat it like any other Game Object in your game, such as tweening it, scaling it, or enabling
 * it for input or physics. It provides a quick and easy way for you to render this shape in your
 * game without using a texture, while still taking advantage of being fully batched in WebGL.
 * 
 * This shape supports only stroke colors and cannot be filled.
 * 
 * A Line Shape allows you to draw a line between two points in your game. You can control the
 * stroke color and thickness of the line. In WebGL only you can also specify a different
 * thickness for the start and end of the line, allowing you to render lines that taper-off.
 * 
 * If you need to draw multiple lines in a sequence you may wish to use the Polygon Shape instead.
 *
 * @method Phaser.GameObjects.GameObjectFactory#line
 * @since 3.13.0
 *
 * @param {number} [x=0] - The horizontal position of this Game Object in the world.
 * @param {number} [y=0] - The vertical position of this Game Object in the world.
 * @param {number} [x1=0] - The horizontal position of the start of the line.
 * @param {number} [y1=0] - The vertical position of the start of the line.
 * @param {number} [x2=128] - The horizontal position of the end of the line.
 * @param {number} [y2=0] - The vertical position of the end of the line.
 * @param {number} [strokeColor] - The color the line will be drawn in, i.e. 0xff0000 for red.
 * @param {number} [strokeAlpha] - The alpha the line will be drawn in. You can also set the alpha of the overall Shape using its `alpha` property.
 *
 * @return {Phaser.GameObjects.Line} The Game Object that was created.
 */
GameObjectFactory.register('line', function (x, y, x1, y1, x2, y2, strokeColor, strokeAlpha)
{
    return this.displayList.add(new Line(this.scene, x, y, x1, y1, x2, y2, strokeColor, strokeAlpha));
});
