/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Bezier = require('../../math/interpolation/BezierInterpolation');
var CatmullRom = require('../../math/interpolation/CatmullRomInterpolation');
var Linear = require('../../math/interpolation/LinearInterpolation');

var FuncMap = {
    bezier: Bezier,
    catmull: CatmullRom,
    catmullrom: CatmullRom,
    linear: Linear
};

/**
 * Returns the interpolation function to be used by a Tween for multi-value properties.
 *
 * The `interpolation` argument can be a string key, a custom function, or `null`.
 * Valid string keys are `'linear'`, `'bezier'`, `'catmull'`, and `'catmullrom'`.
 * If a string is provided but not recognised, the function falls back to linear interpolation.
 * If `null` is passed, `null` is returned, indicating no interpolation should be applied.
 * If a custom function is passed, it is returned directly and used as the interpolator.
 *
 * @function Phaser.Tweens.Builders.GetInterpolationFunction
 * @since 3.60.0
 *
 * @param {(string|function|null)} interpolation - The interpolation function to resolve. Can be a string key (`'linear'`, `'bezier'`, `'catmull'`, `'catmullrom'`), a custom interpolation function, or `null`.
 *
 * @return {?function} The resolved interpolation function, or `null` if `null` was passed in.
 */
var GetInterpolationFunction = function (interpolation)
{
    if (interpolation === null)
    {
        return null;
    }

    //  Default interpolation function
    var interpolationFunction = FuncMap.linear;

    //  Prepare interpolation function
    if (typeof interpolation === 'string')
    {
        //  String based look-up

        //  1) They specified it correctly
        if (FuncMap.hasOwnProperty(interpolation))
        {
            interpolationFunction = FuncMap[interpolation];
        }
    }
    else if (typeof interpolation === 'function')
    {
        //  Custom function
        interpolationFunction = interpolation;
    }

    //  Return interpolation function
    return interpolationFunction;
};

module.exports = GetInterpolationFunction;
