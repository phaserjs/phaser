/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Clone = require('./Clone');

/**
 * Performs a shallow merge of two plain objects, returning a brand new object that contains all
 * properties from both. Neither input object is modified. When the same key exists in both objects,
 * the value from obj1 takes precedence over the value from obj2.
 *
 * This is a shallow copy only. Deeply nested objects are not cloned, so be sure to only use this
 * function on objects with a single level of nesting.
 *
 * @function Phaser.Utils.Objects.Merge
 * @since 3.0.0
 *
 * @param {object} obj1 - The base object. Its properties take precedence in the event of a key conflict.
 * @param {object} obj2 - The secondary object. Properties unique to this object are added to the result.
 *
 * @return {object} A new object containing the merged properties of obj1 and obj2.
 */
var Merge = function (obj1, obj2)
{
    var clone = Clone(obj1);

    for (var key in obj2)
    {
        if (!clone.hasOwnProperty(key))
        {
            clone[key] = obj2[key];
        }
    }

    return clone;
};

module.exports = Merge;
