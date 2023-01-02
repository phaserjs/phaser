/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2013-2023 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * Sets a value in an object, allowing for dot notation to control the depth of the property.
 *
 * For example:
 *
 * ```javascript
 * var data = {
 *   world: {
 *     position: {
 *       x: 200,
 *       y: 100
 *     }
 *   }
 * };
 *
 * SetValue(data, 'world.position.y', 300);
 *
 * console.log(data.world.position.y); // 300
 * ```
 *
 * @function Phaser.Utils.Objects.SetValue
 * @since 3.17.0
 *
 * @param {object} source - The object to set the value in.
 * @param {string} key - The name of the property in the object. If a property is nested, the names of its preceding properties should be separated by a dot (`.`)
 * @param {any} value - The value to set into the property, if found in the source object.
 *
 * @return {boolean} `true` if the property key was valid and the value was set, otherwise `false`.
 */
var SetValue = function (source, key, value)
{
    if (!source || typeof source === 'number')
    {
        return false;
    }
    else if (source.hasOwnProperty(key))
    {
        source[key] = value;

        return true;
    }
    else if (key.indexOf('.') !== -1)
    {
        var keys = key.split('.');
        var parent = source;
        var prev = source;

        //  Use for loop here so we can break early
        for (var i = 0; i < keys.length; i++)
        {
            if (parent.hasOwnProperty(keys[i]))
            {
                //  Yes it has a key property, let's carry on down
                prev = parent;
                parent = parent[keys[i]];
            }
            else
            {
                return false;
            }
        }

        prev[keys[keys.length - 1]] = value;

        return true;
    }

    return false;
};

module.exports = SetValue;
