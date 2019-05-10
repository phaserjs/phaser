/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2019 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Clone = require('./Clone');

/**
 * Creates a new Object using all values from obj1.
 * 
 * Then scans obj2. If a property is found in obj2 that *also* exists in obj1, the value from obj2 is used, otherwise the property is skipped.
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
