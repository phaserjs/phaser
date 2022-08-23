/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2022 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Bezier = require('../../math/interpolation/BezierInterpolation');
var CatmullRom = require('../../math/interpolation/CatmullRomInterpolation');
var CubicBezier = require('../../math/interpolation/CubicBezierInterpolation');
var Linear = require('../../math/interpolation/LinearInterpolation');
var QuadraticBezier = require('../../math/interpolation/QuadraticBezierInterpolation');
var SmoothStep = require('../../math/interpolation/SmoothStepInterpolation');
var SmootherStep = require('../../math/interpolation/SmootherStepInterpolation');

var FuncMap = {
    bezier: Bezier,
    catmull: CatmullRom,
    catmullrom: CatmullRom,
    cubic: CubicBezier,
    cubicbezier: CubicBezier,
    linear: Linear,
    quad: QuadraticBezier,
    quadratic: QuadraticBezier,
    quadraticbezier: QuadraticBezier,
    smooth: SmoothStep,
    smoothstep: SmoothStep,
    smoother: SmootherStep,
    smootherstep: SmootherStep
};

/**
 * This internal function is used to return the correct interpolation function for a Tween.
 *
 * It can take a variety of input, including a string, or a custom function.
 *
 * @function Phaser.Tweens.Builders.GetInterpolationFunction
 * @since 3.60.0
 *
 * @param {(string|function)} interpolation - The interpolation function to find. This can be either a string, or a custom function.
 *
 * @return {function} The ease function.
 */
var GetInterpolationFunction = function (interpolation)
{
    //  Default interpolation function
    var interpolationFunction = FuncMap.linear;

    //  Prepare ease function
    if (typeof interpolation === 'string')
    {
        //  String based look-up

        //  1) They specified it correctly
        if (FuncMap.hasOwnProperty(interpolation))
        {
            interpolationFunction = FuncMap[interpolation];
        }
    }
    else if (typeof ease === 'function')
    {
        //  Custom function
        interpolationFunction = interpolation;
    }

    //  Return ease function
    return interpolationFunction;
};

module.exports = GetInterpolationFunction;
