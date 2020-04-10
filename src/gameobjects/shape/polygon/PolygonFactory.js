/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var GameObjectFactory = require('../../GameObjectFactory');
var Polygon = require('./Polygon');

/**
 * Creates a new Polygon Shape Game Object and adds it to the Scene.
 * 
 * Note: This method will only be available if the Polygon Game Object has been built into Phaser.
 * 
 * The Polygon Shape is a Game Object that can be added to a Scene, Group or Container. You can
 * treat it like any other Game Object in your game, such as tweening it, scaling it, or enabling
 * it for input or physics. It provides a quick and easy way for you to render this shape in your
 * game without using a texture, while still taking advantage of being fully batched in WebGL.
 * 
 * This shape supports both fill and stroke colors.
 * 
 * The Polygon Shape is created by providing a list of points, which are then used to create an
 * internal Polygon geometry object. The points can be set from a variety of formats:
 *
 * - An array of Point or Vector2 objects: `[new Phaser.Math.Vector2(x1, y1), ...]`
 * - An array of objects with public x/y properties: `[obj1, obj2, ...]`
 * - An array of paired numbers that represent point coordinates: `[x1,y1, x2,y2, ...]`
 * - An array of arrays with two elements representing x/y coordinates: `[[x1, y1], [x2, y2], ...]`
 * 
 * By default the `x` and `y` coordinates of this Shape refer to the center of it. However, depending
 * on the coordinates of the points provided, the final shape may be rendered offset from its origin.
 *
 * @method Phaser.GameObjects.GameObjectFactory#polygon
 * @since 3.13.0
 *
 * @param {number} [x=0] - The horizontal position of this Game Object in the world.
 * @param {number} [y=0] - The vertical position of this Game Object in the world.
 * @param {any} [points] - The points that make up the polygon.
 * @param {number} [fillColor] - The color the polygon will be filled with, i.e. 0xff0000 for red.
 * @param {number} [fillAlpha] - The alpha the polygon will be filled with. You can also set the alpha of the overall Shape using its `alpha` property.
 *
 * @return {Phaser.GameObjects.Polygon} The Game Object that was created.
 */
GameObjectFactory.register('polygon', function (x, y, points, fillColor, fillAlpha)
{
    return this.displayList.add(new Polygon(this.scene, x, y, points, fillColor, fillAlpha));
});
