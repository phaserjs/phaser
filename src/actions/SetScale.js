/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2019 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var PropertyValueSet = require('./PropertyValueSet');

/**
 * Takes an array of Game Objects, or any objects that have the public properties `scaleX` and `scaleY`
 * and then sets them to the given values.
 *
 * The optional `stepX` and `stepY` properties are applied incrementally, multiplied by each item in the array.
 *
 * To use this with a Group: `SetScale(group.getChildren(), scaleX, scaleY, stepX, stepY)`
 *
 * @function Phaser.Actions.SetScale
 * @since 3.0.0
 *
 * @generic {Phaser.GameObjects.GameObject[]} G - [items,$return]
 *
 * @param {(array|Phaser.GameObjects.GameObject[])} items - The array of items to be updated by this action.
 * @param {number} scaleX - The amount to set the `scaleX` property to.
 * @param {number} [scaleY] - The amount to set the `scaleY` property to. If `undefined` or `null` it uses the `scaleX` value.
 * @param {number} [stepX=0] - This is added to the `scaleX` amount, multiplied by the iteration counter.
 * @param {number} [stepY=0] - This is added to the `scaleY` amount, multiplied by the iteration counter.
 * @param {integer} [index=0] - An optional offset to start searching from within the items array.
 * @param {integer} [direction=1] - The direction to iterate through the array. 1 is from beginning to end, -1 from end to beginning.
 *
 * @return {(array|Phaser.GameObjects.GameObject[])} The array of objects that were passed to this Action.
 */
var SetScale = function (items, scaleX, scaleY, stepX, stepY, index, direction)
{
    if (scaleY === undefined || scaleY === null) { scaleY = scaleX; }

    PropertyValueSet(items, 'scaleX', scaleX, stepX, index, direction);

    return PropertyValueSet(items, 'scaleY', scaleY, stepY, index, direction);
};

module.exports = SetScale;
