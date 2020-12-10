/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var PropertyValueSet = require('./PropertyValueSet');

/**
 * Takes an array of Game Objects, or any objects that have the public properties `scrollFactorX` and `scrollFactorY`
 * and then sets them to the given values.
 *
 * The optional `stepX` and `stepY` properties are applied incrementally, multiplied by each item in the array.
 *
 * To use this with a Group: `SetScrollFactor(group.getChildren(), scrollFactorX, scrollFactorY, stepX, stepY)`
 *
 * @function Phaser.Actions.SetScrollFactor
 * @since 3.21.0
 *
 * @generic {Phaser.GameObjects.GameObject[]} G - [items,$return]
 *
 * @param {(array|Phaser.GameObjects.GameObject[])} items - The array of items to be updated by this action.
 * @param {number} scrollFactorX - The amount to set the `scrollFactorX` property to.
 * @param {number} [scrollFactorY] - The amount to set the `scrollFactorY` property to. If `undefined` or `null` it uses the `scrollFactorX` value.
 * @param {number} [stepX=0] - This is added to the `scrollFactorX` amount, multiplied by the iteration counter.
 * @param {number} [stepY=0] - This is added to the `scrollFactorY` amount, multiplied by the iteration counter.
 * @param {number} [index=0] - An optional offset to start searching from within the items array.
 * @param {number} [direction=1] - The direction to iterate through the array. 1 is from beginning to end, -1 from end to beginning.
 *
 * @return {(array|Phaser.GameObjects.GameObject[])} The array of objects that were passed to this Action.
 */
var SetScrollFactor = function (items, scrollFactorX, scrollFactorY, stepX, stepY, index, direction)
{
    if (scrollFactorY === undefined || scrollFactorY === null) { scrollFactorY = scrollFactorX; }

    PropertyValueSet(items, 'scrollFactorX', scrollFactorX, stepX, index, direction);

    return PropertyValueSet(items, 'scrollFactorY', scrollFactorY, stepY, index, direction);
};

module.exports = SetScrollFactor;
