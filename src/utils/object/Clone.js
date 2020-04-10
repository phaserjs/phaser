/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * Shallow Object Clone. Will not clone nested objects.
 *
 * @function Phaser.Utils.Objects.Clone
 * @since 3.0.0
 *
 * @param {object} obj - the object from which to clone
 *
 * @return {object} a new object with the same properties as the input obj
 */
var Clone = function (obj)
{
    var clone = {};

    for (var key in obj)
    {
        if (Array.isArray(obj[key]))
        {
            clone[key] = obj[key].slice(0);
        }
        else
        {
            clone[key] = obj[key];
        }
    }

    return clone;
};

module.exports = Clone;
