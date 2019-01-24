/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2019 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

/**
 * Takes an array of Game Objects and then modifies their `property` so the value equals, or is incremented, the
 * calculated spread value.
 * 
 * The spread value is derived from the given `min` and `max` values and the total number of items in the array.//#endregion
 * 
 * For example, to cause an array of Sprites to change in alpha from 0 to 1 you could call:
 * 
 * ```javascript
 * Phaser.Actions.Spread(itemsArray, 'alpha', 0, 1);
 * ```
 *
 * @function Phaser.Actions.Spread
 * @since 3.0.0
 *
 * @generic {Phaser.GameObjects.GameObject[]} G - [items,$return]
 *
 * @param {(array|Phaser.GameObjects.GameObject[])} items - An array of Game Objects. The contents of this array are updated by this Action.
 * @param {string} property - The property of the Game Object to spread.
 * @param {number} min - The minimum value.
 * @param {number} max - The maximum value.
 * @param {boolean} [inc=false] - Should the values be incremented? `true` or set (`false`)
 *
 * @return {(array|Phaser.GameObjects.GameObject[])} The array of Game Objects that were passed to this Action.
 */
var Spread = function (items, property, min, max, inc)
{
    if (inc === undefined) { inc = false; }

    var step = Math.abs(max - min) / items.length;
    var i;

    if (inc)
    {
        for (i = 0; i < items.length; i++)
        {
            items[i][property] += i * step;
        }
    }
    else
    {
        for (i = 0; i < items.length; i++)
        {
            items[i][property] = i * step;
        }
    }

    return items;
};

module.exports = Spread;
