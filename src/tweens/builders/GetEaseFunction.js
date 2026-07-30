/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var EaseMap = require('../../math/easing/EaseMap');
var UppercaseFirst = require('../../utils/string/UppercaseFirst');

/**
 * Returns the easing function corresponding to the given `ease` value for use in a Tween.
 *
 * The `ease` argument can be an exact key from the EaseMap (e.g. `'Power2'`, `'Quad.easeIn'`),
 * a shorthand dot-notation string (e.g. `'quad.in'`, `'cubic.inout'`), or a custom easing function.
 * If the string cannot be resolved, the function falls back to `Power0` (linear easing).
 *
 * When `easeParams` is provided, the returned function is a wrapper that forwards those extra
 * arguments to the resolved ease function on every call, enabling parameterised easings such as
 * Stepped or Back easing.
 *
 * @function Phaser.Tweens.Builders.GetEaseFunction
 * @since 3.0.0
 *
 * @param {(string|function)} ease - The ease to resolve. Accepts an EaseMap key, a dot-notation shorthand (e.g. `'quad.in'`), or a custom easing function.
 * @param {number[]} [easeParams] - An optional array of additional parameters to pass to the ease function on each call.
 *
 * @return {function} The resolved ease function, or a wrapper function that applies the resolved ease with the provided parameters.
 */
var GetEaseFunction = function (ease, easeParams)
{
    //  Default ease function
    var easeFunction = EaseMap.Power0;

    //  Prepare ease function
    if (typeof ease === 'string')
    {
        //  String based look-up

        //  1) They specified it correctly
        if (EaseMap.hasOwnProperty(ease))
        {
            easeFunction = EaseMap[ease];
        }
        else
        {
            //  Do some string manipulation to try and find it
            var direction = '';

            if (ease.indexOf('.'))
            {
                //  quad.in = Quad.easeIn
                //  quad.out = Quad.easeOut
                //  quad.inout = Quad.easeInOut

                direction = ease.substring(ease.indexOf('.') + 1);

                var directionLower = direction.toLowerCase();

                if (directionLower === 'in')
                {
                    direction = 'easeIn';
                }
                else if (directionLower === 'out')
                {
                    direction = 'easeOut';
                }
                else if (directionLower === 'inout')
                {
                    direction = 'easeInOut';
                }
            }

            ease = UppercaseFirst(ease.substring(0, ease.indexOf('.') + 1) + direction);

            if (EaseMap.hasOwnProperty(ease))
            {
                easeFunction = EaseMap[ease];
            }
        }
    }
    else if (typeof ease === 'function')
    {
        //  Custom function
        easeFunction = ease;
    }

    //  No custom ease parameters?
    if (!easeParams)
    {
        //  Return ease function
        return easeFunction;
    }

    var cloneParams = easeParams.slice(0);

    cloneParams.unshift(0);

    //  Return ease function with custom ease parameters
    return function (v)
    {
        cloneParams[0] = v;

        return easeFunction.apply(this, cloneParams);
    };
};

module.exports = GetEaseFunction;
