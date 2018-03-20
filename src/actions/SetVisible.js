/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

var PropertyValueSet = require('./PropertyValueSet');

/**
 * Takes an array of Game Objects, or any objects that have the public property `visible`
 * and then sets it to the given value.
 *
 * To use this with a Group: `SetVisible(group.getChildren(), value)`
 *
 * @function Phaser.Actions.SetVisible
 * @since 3.0.0
 *
 * @param {(array|Phaser.GameObjects.GameObject[])} items - The array of items to be updated by this action.
 * @param {boolean} value - The value to set the property to.
 * @param {integer} [index=0] - An optional offset to start searching from within the items array.
 * @param {integer} [direction=1] - The direction to iterate through the array. 1 is from beginning to end, -1 from end to beginning.
 *
 * @return {array} The array of objects that were passed to this Action.
 */
var SetVisible = function (items, value, index, direction)
{
    return PropertyValueSet(items, 'visible', value, 0, index, direction);
};

module.exports = SetVisible;
