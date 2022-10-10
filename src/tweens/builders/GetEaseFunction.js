/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2022 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var EaseMap = require('../../math/easing/EaseMap');
var UppercaseFirst = require('../../utils/string/UppercaseFirst');

/**
 * This internal function is used to return the correct ease function for a Tween.
 *
 * It can take a variety of input, including an EaseMap based string, or a custom function.
 *
 * @function Phaser.Tweens.Builders.GetEaseFunction
 * @since 3.0.0
 *
 * @param {(string|function)} ease - The ease to find. This can be either a string from the EaseMap, or a custom function.
 * @param {number[]} [easeParams] - An optional array of ease parameters to go with the ease.
 *
 * @return {function} The ease function.
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
