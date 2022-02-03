/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * Retrieves a value from an object, or an alternative object, falling to a back-up default value if not found.
 *
 * The key is a string, which can be split based on the use of the period character.
 *
 * For example:
 *
 * ```javascript
 * const source = {
 *   lives: 3,
 *   render: {
 *     screen: {
 *       width: 1024
 *     }
 *   }
 * }
 *
 * const lives = GetValue(source, 'lives', 1);
 * const width = GetValue(source, 'render.screen.width', 800);
 * const height = GetValue(source, 'render.screen.height', 600);
 * ```
 *
 * In the code above, `lives` will be 3 because it's defined at the top level of `source`.
 * The `width` value will be 1024 because it can be found inside the `render.screen` object.
 * The `height` value will be 600, the default value, because it is missing from the `render.screen` object.
 *
 * @function Phaser.Utils.Objects.GetValue
 * @since 3.0.0
 *
 * @param {object} source - The primary object to try to retrieve the value from. If not found in here, `altSource` is checked.
 * @param {string} key - The name of the property to retrieve from the object. If a property is nested, the names of its preceding properties should be separated by a dot (`.`) - `banner.hideBanner` would return the value of the `hideBanner` property from the object stored in the `banner` property of the `source` object.
 * @param {*} defaultValue - The value to return if the `key` isn't found in the `source` object.
 * @param {object} [altSource] - An alternative object to retrieve the value from. If the property exists in `source` then `altSource` will not be used.
 *
 * @return {*} The value of the requested key.
 */
var GetValue = function (source, key, defaultValue, altSource)
{
    if ((!source && !altSource) || typeof source === 'number')
    {
        return defaultValue;
    }
    else if (source && source.hasOwnProperty(key))
    {
        return source[key];
    }
    else if (altSource && altSource.hasOwnProperty(key))
    {
        return altSource[key];
    }
    else if (key.indexOf('.') !== -1)
    {
        var keys = key.split('.');
        var parentA = source;
        var parentB = altSource;
        var value = defaultValue;

        //  Use for loop here so we can break early
        for (var i = 0; i < keys.length; i++)
        {
            if (parentA && parentA.hasOwnProperty(keys[i]))
            {
                //  Yes parentA has a key property, let's carry on down
                value = parentA[keys[i]];

                parentA = parentA[keys[i]];
            }
            else if (parentB && parentB.hasOwnProperty(keys[i]))
            {
                //  Yes parentB has a key property, let's carry on down
                value = parentB[keys[i]];

                parentB = parentB[keys[i]];
            }
            else
            {
                //  Can't go any further, so reset to default
                value = defaultValue;
                break;
            }
        }

        return value;
    }
    else
    {
        return defaultValue;
    }
};

module.exports = GetValue;
