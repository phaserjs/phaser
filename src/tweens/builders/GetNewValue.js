/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2024 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * Internal function used by the Tween Builder to create a function that will return
 * the given value from the source.
 *
 * @function Phaser.Tweens.Builders.GetNewValue
 * @since 3.0.0
 *
 * @param {any} source - The source object to get the value from.
 * @param {string} key - The property to get from the source.
 * @param {any} defaultValue - A default value to return should the source not have the property set.
 *
 * @return {function} A function which, when called, will return the property value from the source.
 */
var GetNewValue = function (source, key, defaultValue)
{
    var valueCallback;

    if (source.hasOwnProperty(key))
    {
        var t = typeof(source[key]);

        if (t === 'function')
        {
            valueCallback = function (target, targetKey, value, targetIndex, totalTargets, tween)
            {
                return source[key](target, targetKey, value, targetIndex, totalTargets, tween);
            };
        }
        else
        {
            valueCallback = function ()
            {
                return source[key];
            };
        }
    }
    else if (typeof defaultValue === 'function')
    {
        valueCallback = defaultValue;
    }
    else
    {
        valueCallback = function ()
        {
            return defaultValue;
        };
    }

    return valueCallback;
};

module.exports = GetNewValue;
