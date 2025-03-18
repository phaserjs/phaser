/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Random = require('../geom/triangle/Random');

/**
 * Takes an array of Game Objects and positions them at random locations within the Triangle.
 * 
 * If you wish to pass a `Phaser.GameObjects.Triangle` Shape to this function, you should pass its `geom` property.
 *
 * @function Phaser.Actions.RandomTriangle
 * @since 3.0.0
 *
 * @generic {Phaser.GameObjects.GameObject[]} G - [items,$return]
 *
 * @param {(array|Phaser.GameObjects.GameObject[])} items - An array of Game Objects. The contents of this array are updated by this Action.
 * @param {Phaser.Geom.Triangle} triangle - The Triangle to position the Game Objects within.
 *
 * @return {(array|Phaser.GameObjects.GameObject[])} The array of Game Objects that was passed to this Action.
 */
var RandomTriangle = function (items, triangle)
{
    for (var i = 0; i < items.length; i++)
    {
        Random(triangle, items[i]);
    }

    return items;
};

module.exports = RandomTriangle;
