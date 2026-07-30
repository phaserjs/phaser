/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Clone = require('./Clone');

/**
 * Creates a new object by cloning `obj1`, then merging values from `obj2` into it using a "right wins" strategy.
 *
 * Only keys that exist in `obj1` are considered. For each key in `obj2` that also exists in `obj1`, the value from `obj2` overwrites the cloned value. Keys present in `obj2` but absent from `obj1` are ignored entirely. This differs from a standard merge in that `obj2` cannot introduce new keys — it can only override existing ones.
 *
 * @function Phaser.Utils.Objects.MergeRight
 * @since 3.0.0
 *
 * @param {object} obj1 - The first object to merge.
 * @param {object} obj2 - The second object to merge. Keys from this object which also exist in `obj1` will be copied to `obj1`.
 *
 * @return {object} The merged object. `obj1` and `obj2` are not modified.
 */
var MergeRight = function (obj1, obj2)
{
    var clone = Clone(obj1);

    for (var key in obj2)
    {
        if (clone.hasOwnProperty(key))
        {
            clone[key] = obj2[key];
        }
    }

    return clone;
};

module.exports = MergeRight;
