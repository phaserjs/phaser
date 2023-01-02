/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2013-2023 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var PropertyValueInc = require('./PropertyValueInc');

/**
 * Takes an array of Game Objects, or any objects that have public `x` and `y` properties,
 * and then adds the given value to each of them.
 *
 * The optional `stepX` and `stepY` properties are applied incrementally, multiplied by each item in the array.
 *
 * To use this with a Group: `IncXY(group.getChildren(), x, y, stepX, stepY)`
 *
 * @function Phaser.Actions.IncXY
 * @since 3.0.0
 *
 * @generic {Phaser.GameObjects.GameObject[]} G - [items,$return]
 *
 * @param {(array|Phaser.GameObjects.GameObject[])} items - The array of items to be updated by this action.
 * @param {number} x - The amount to be added to the `x` property.
 * @param {number} [y=x] - The amount to be added to the `y` property. If `undefined` or `null` it uses the `x` value.
 * @param {number} [stepX=0] - This is added to the `x` amount, multiplied by the iteration counter.
 * @param {number} [stepY=0] - This is added to the `y` amount, multiplied by the iteration counter.
 * @param {number} [index=0] - An optional offset to start searching from within the items array.
 * @param {number} [direction=1] - The direction to iterate through the array. 1 is from beginning to end, -1 from end to beginning.
 *
 * @return {(array|Phaser.GameObjects.GameObject[])} The array of objects that were passed to this Action.
 */
var IncXY = function (items, x, y, stepX, stepY, index, direction)
{
    if (y === undefined || y === null) { y = x; }

    PropertyValueInc(items, 'x', x, stepX, index, direction);

    return PropertyValueInc(items, 'y', y, stepY, index, direction);
};

module.exports = IncXY;
