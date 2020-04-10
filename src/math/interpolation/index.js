/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * @namespace Phaser.Math.Interpolation
 */

module.exports = {

    Bezier: require('./BezierInterpolation'),
    CatmullRom: require('./CatmullRomInterpolation'),
    CubicBezier: require('./CubicBezierInterpolation'),
    Linear: require('./LinearInterpolation'),
    QuadraticBezier: require('./QuadraticBezierInterpolation'),
    SmoothStep: require('./SmoothStepInterpolation'),
    SmootherStep: require('./SmootherStepInterpolation')

};
