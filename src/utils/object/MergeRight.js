/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

var Clone = require('./Clone');

/**
 * Creates a new Object using all values from obj1.
 * 
 * Then scans obj2. If a property is found in obj2 that *also* exists in obj1, the value from obj2 is used, otherwise the property is skipped.
 *
 * @function Phaser.Utils.Object.MergeRight
 * @since 3.0.0
 *
 * @param {object} obj1 - [description]
 * @param {object} obj2 - [description]
 *
 * @return {object} [description]
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
