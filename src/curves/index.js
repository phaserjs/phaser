/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2019 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

/**
 * @namespace Phaser.Curves
 */

/**
 * @typedef {object} JSONCurve
 *
 * @property {string} type - The of the curve
 * @property {number[]} points - The arrays of points like `[x1, y1, x2, y2]`
 */

module.exports = {
    Path: require('./path/Path'),

    CubicBezier: require('./CubicBezierCurve'),
    Curve: require('./Curve'),
    Ellipse: require('./EllipseCurve'),
    Line: require('./LineCurve'),
    QuadraticBezier: require('./QuadraticBezierCurve'),
    Spline: require('./SplineCurve')
};
