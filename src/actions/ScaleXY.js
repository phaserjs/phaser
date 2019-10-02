/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2019 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var PropertyValueInc = require('./PropertyValueInc');

/**
 * Takes an array of Game Objects, or any objects that have public `scaleX` and `scaleY` properties,
 * and then adds the given value to each of them.
 *
 * The optional `stepX` and `stepY` properties are applied incrementally, multiplied by each item in the array.
 *
 * To use this with a Group: `ScaleXY(group.getChildren(), scaleX, scaleY, stepX, stepY)`
 *
 * @function Phaser.Actions.ScaleXY
 * @since 3.0.0
 *
 * @generic {Phaser.GameObjects.GameObject[]} G - [items,$return]
 *
 * @param {(array|Phaser.GameObjects.GameObject[])} items - The array of items to be updated by this action.
 * @param {number} scaleX - The amount to be added to the `scaleX` property.
 * @param {number} [scaleY] - The amount to be added to the `scaleY` property. If `undefined` or `null` it uses the `scaleX` value.
 * @param {number} [stepX=0] - This is added to the `scaleX` amount, multiplied by the iteration counter.
 * @param {number} [stepY=0] - This is added to the `y` amount, multiplied by the iteration counter.
 * @param {integer} [index=0] - An optional offset to start searching from within the items array.
 * @param {integer} [direction=1] - The direction to iterate through the array. 1 is from beginning to end, -1 from end to beginning.
 *
 * @return {(array|Phaser.GameObjects.GameObject[])} The array of objects that were passed to this Action.
 */
var ScaleXY = function (items, scaleX, scaleY, stepX, stepY, index, direction)
{
    if (scaleY === undefined || scaleY === null) { scaleY = scaleX; }

    PropertyValueInc(items, 'scaleX', scaleX, stepX, index, direction);

    return PropertyValueInc(items, 'scaleY', scaleY, stepY, index, direction);
};

module.exports = ScaleXY;
