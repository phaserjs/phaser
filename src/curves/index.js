/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * @namespace Phaser.Curves
 */

module.exports = {
    Path: require('./path/Path'),
    MoveTo: require('./path/MoveTo'),

    CubicBezier: require('./CubicBezierCurve'),
    Curve: require('./Curve'),
    Ellipse: require('./EllipseCurve'),
    Line: require('./LineCurve'),
    QuadraticBezier: require('./QuadraticBezierCurve'),
    Spline: require('./SplineCurve')
};
