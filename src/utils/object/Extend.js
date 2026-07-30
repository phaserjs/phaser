/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var IsPlainObject = require('./IsPlainObject');

// @param {boolean} deep - Perform a deep copy?
// @param {object} target - The target object to copy to.
// @return {object} The extended object.

/**
 * Merges the properties of one or more source objects into a target object, returning the modified target.
 * This is a slightly modified version of {@link http://api.jquery.com/jQuery.extend/ jQuery.extend}.
 *
 * The function accepts a variadic argument list. If the first argument is a boolean `true`, a deep (recursive)
 * copy is performed, and the second argument is treated as the target. Otherwise, the first argument is the target
 * and all subsequent arguments are source objects. Properties from each source object are copied onto the target in
 * order; later sources overwrite earlier ones for the same key. Nested plain objects and arrays are cloned rather
 * than referenced during a deep copy, preventing mutation of the originals. `undefined` values on a source are
 * never copied to the target.
 *
 * @function Phaser.Utils.Objects.Extend
 * @since 3.0.0
 *
 * @param {...*} [args] - An optional leading boolean for deep-copy mode, followed by the target object, then one or more source objects whose properties will be merged into the target.
 *
 * @return {object} The extended object.
 */
var Extend = function ()
{
    var options, name, src, copy, copyIsArray, clone,
        target = arguments[0] || {},
        i = 1,
        length = arguments.length,
        deep = false;

    // Handle a deep copy situation
    if (typeof target === 'boolean')
    {
        deep = target;
        target = arguments[1] || {};

        // skip the boolean and the target
        i = 2;
    }

    // extend Phaser if only one argument is passed
    if (length === i)
    {
        target = this;
        --i;
    }

    for (; i < length; i++)
    {
        // Only deal with non-null/undefined values
        if ((options = arguments[i]) != null)
        {
            // Extend the base object
            for (name in options)
            {
                src = target[name];
                copy = options[name];

                // Prevent never-ending loop
                if (target === copy)
                {
                    continue;
                }

                // Recurse if we're merging plain objects or arrays
                if (deep && copy && (IsPlainObject(copy) || (copyIsArray = Array.isArray(copy))))
                {
                    if (copyIsArray)
                    {
                        copyIsArray = false;
                        clone = src && Array.isArray(src) ? src : [];
                    }
                    else
                    {
                        clone = src && IsPlainObject(src) ? src : {};
                    }

                    // Never move original objects, clone them
                    target[name] = Extend(deep, clone, copy);

                // Don't bring in undefined values
                }
                else if (copy !== undefined)
                {
                    target[name] = copy;
                }
            }
        }
    }

    // Return the modified object
    return target;
};

module.exports = Extend;
