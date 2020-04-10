/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * Takes an array of objects and returns the first element in the array that has properties which match
 * all of those specified in the `compare` object. For example, if the compare object was: `{ scaleX: 0.5, alpha: 1 }`
 * then it would return the first item which had the property `scaleX` set to 0.5 and `alpha` set to 1.
 *
 * To use this with a Group: `GetFirst(group.getChildren(), compare, index)`
 *
 * @function Phaser.Actions.GetFirst
 * @since 3.0.0
 *
 * @generic {Phaser.GameObjects.GameObject[]} G - [items]
 *
 * @param {(array|Phaser.GameObjects.GameObject[])} items - The array of items to be searched by this action.
 * @param {object} compare - The comparison object. Each property in this object will be checked against the items of the array.
 * @param {integer} [index=0] - An optional offset to start searching from within the items array.
 *
 * @return {?(object|Phaser.GameObjects.GameObject)} The first object in the array that matches the comparison object, or `null` if no match was found.
 */
var GetFirst = function (items, compare, index)
{
    if (index === undefined) { index = 0; }

    for (var i = index; i < items.length; i++)
    {
        var item = items[i];

        var match = true;

        for (var property in compare)
        {
            if (item[property] !== compare[property])
            {
                match = false;
            }
        }

        if (match)
        {
            return item;
        }
    }

    return null;
};

module.exports = GetFirst;
