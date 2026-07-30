/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * This is a slightly modified version of jQuery.isPlainObject.
 * A plain object is an object whose internal [[Class]] property is `[object Object]`,
 * meaning it was created via `{}`, `new Object()`, or `Object.create(null)`. Objects
 * such as DOM nodes, the `window` object, and instances of custom classes are not
 * considered plain objects and will cause this function to return `false`.
 *
 * @function Phaser.Utils.Objects.IsPlainObject
 * @since 3.0.0
 *
 * @param {object} obj - The object to inspect.
 *
 * @return {boolean} `true` if the object is plain, otherwise `false`.
 */
var IsPlainObject = function (obj)
{
    // Not plain objects:
    // - Any object or value whose internal [[Class]] property is not "[object Object]"
    // - DOM nodes
    // - window
    if (!obj || typeof(obj) !== 'object' || obj.nodeType || obj === obj.window)
    {
        return false;
    }

    // Support: Firefox <20
    // The try/catch suppresses exceptions thrown when attempting to access
    // the "constructor" property of certain host objects, ie. |window.location|
    // https://bugzilla.mozilla.org/show_bug.cgi?id=814622
    try
    {
        if (obj.constructor && !({}).hasOwnProperty.call(obj.constructor.prototype, 'isPrototypeOf'))
        {
            return false;
        }
    }
    catch (e)
    {
        return false;
    }

    // If the function hasn't returned already, we're confident that
    // |obj| is a plain object, created by {} or constructed with new Object
    return true;
};

module.exports = IsPlainObject;
