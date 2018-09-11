/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

var GameObjectFactory = require('../../GameObjectFactory');
var Polygon = require('./Polygon');

/**
 * Creates a new Polygon Shape Game Object and adds it to the Scene.
 * 
 * The points can be set from a variety of formats:
 *
 * - An array of Point objects: `[new Phaser.Point(x1, y1), ...]`
 * - An array of objects with public x/y properties: `[obj1, obj2, ...]`
 * - An array of paired numbers that represent point coordinates: `[x1,y1, x2,y2, ...]`
 * - An array of arrays with two elements representing x/y coordinates: `[[x1, y1], [x2, y2], ...]`
 *
 * Note: This method will only be available if the Polygon Game Object has been built into Phaser.
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
