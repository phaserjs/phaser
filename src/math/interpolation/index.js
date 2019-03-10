/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2019 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
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
