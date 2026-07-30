/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * Internal function used by the Tween Builder to create a value resolver callback for a tween
 * property. It inspects the given `source` object for the specified `key` and returns a wrapper
 * function suitable for use during tween interpolation. If the property exists on the source and
 * is itself a function, it is wrapped so it receives the full tween context (target, targetKey,
 * value, targetIndex, totalTargets, tween) on each call. If the property is a static value, a
 * function that always returns that value is created instead. If the source does not have the
 * property, the `defaultValue` is used — either directly (if it is already a function) or wrapped
 * in a function that returns it.
 *
 * @function Phaser.Tweens.Builders.GetNewValue
 * @since 3.0.0
 *
 * @param {any} source - The source object to get the value from.
 * @param {string} key - The property to get from the source.
 * @param {any} defaultValue - A default value to use should the source not have the property set. May itself be a function.
 *
 * @return {function} A function which, when called, returns the resolved property value from the source, or the default value if the property is not present.
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
