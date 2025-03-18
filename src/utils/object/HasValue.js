/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * Determine whether the source object has a property with the specified key.
 *
 * @function Phaser.Utils.Objects.HasValue
 * @since 3.0.0
 *
 * @param {object} source - The source object to be checked.
 * @param {string} key - The property to check for within the object
 *
 * @return {boolean} `true` if the provided `key` exists on the `source` object, otherwise `false`.
 */
var HasValue = function (source, key)
{
    return (source.hasOwnProperty(key));
};

module.exports = HasValue;
