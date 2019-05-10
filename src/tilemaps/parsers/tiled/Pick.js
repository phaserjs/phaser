/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2019 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var HasValue = require('../../../utils/object/HasValue');

/**
 * Returns a new object that only contains the `keys` that were found on the object provided. If no `keys` are found, an empty object is returned.
 *
 * @function Phaser.Tilemaps.Parsers.Tiled.Pick
 * @since 3.0.0
 *
 * @param {object} object - The object to pick the provided keys from.
 * @param {array} keys - An array of properties to retrieve from the provided object.
 *
 * @return {object} A new object that only contains the `keys` that were found on the provided object. If no `keys` were found, an empty object will be returned.
 */
var Pick = function (object, keys)
{
    var obj = {};

    for (var i = 0; i < keys.length; i++)
    {
        var key = keys[i];

        if (HasValue(object, key))
        {
            obj[key] = object[key];
        }
    }

    return obj;
};

module.exports = Pick;
