/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

/**
 * @namespace Phaser.Curves
 */

module.exports = {

    Path: require('./path/Path'),

    CubicBezier: require('./CubicBezierCurve'),
    Curve: require('./Curve'),
    Ellipse: require('./EllipseCurve'),
    Line: require('./LineCurve'),
    Spline: require('./SplineCurve')

};
