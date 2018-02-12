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

    Curve: require('./curve/Curve'),
    CubicBezier: require('./cubicbezier/CubicBezierCurve'),
    Ellipse: require('./ellipse/EllipseCurve'),
    Line: require('./line/LineCurve'),
    Spline: require('./spline/SplineCurve')

};
