/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Random = require('../geom/ellipse/Random');

/**
 * Takes an array of Game Objects and positions them at random locations within the Ellipse.
 * 
 * If you wish to pass a `Phaser.GameObjects.Ellipse` Shape to this function, you should pass its `geom` property.
 *
 * @function Phaser.Actions.RandomEllipse
 * @since 3.0.0
 *
 * @generic {Phaser.GameObjects.GameObject[]} G - [items,$return]
 *
 * @param {(array|Phaser.GameObjects.GameObject[])} items - An array of Game Objects. The contents of this array are updated by this Action.
 * @param {Phaser.Geom.Ellipse} ellipse - The Ellipse to position the Game Objects within.
 *
 * @return {(array|Phaser.GameObjects.GameObject[])} The array of Game Objects that was passed to this Action.
 */
var RandomEllipse = function (items, ellipse)
{
    for (var i = 0; i < items.length; i++)
    {
        Random(ellipse, items[i]);
    }

    return items;
};

module.exports = RandomEllipse;
