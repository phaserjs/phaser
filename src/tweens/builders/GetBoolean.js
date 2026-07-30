/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * Retrieves the boolean value of the given key from a source object, returning a default value if the key is missing or no source object is provided.
 *
 * @function Phaser.Tweens.Builders.GetBoolean
 * @since 3.0.0
 *
 * @param {object} source - The object to retrieve the value from.
 * @param {string} key - The key to look for in the `source` object.
 * @param {boolean} defaultValue - The default value to return if the `key` doesn't exist or if no `source` object is provided.
 *
 * @return {boolean} The boolean value associated with the key, or `defaultValue` if the key does not exist or no source object was provided.
 */
var GetBoolean = function (source, key, defaultValue)
{
    if (!source)
    {
        return defaultValue;
    }
    else if (source.hasOwnProperty(key))
    {
        return source[key];
    }
    else
    {
        return defaultValue;
    }
};

module.exports = GetBoolean;
